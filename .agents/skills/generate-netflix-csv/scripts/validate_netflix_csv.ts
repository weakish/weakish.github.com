/** Validate movies/netflix.csv against NetflixViewingHistory.csv and schema rules. */

import { parse } from "https://deno.land/std@0.201.0/csv/mod.ts";
import { type HistoryRow, watchBounds } from "./collapse_history.ts";

const COLUMNS = ["id", "title", "year", "date", "wikidata", "netflix"] as const;

const ID_RE = /^(tt\d+|m\d+|\d+)$/;
const NETFLIX_RE = /^\d+$/;
// year/date: RFC 3339 four-digit-year profile (not ISO 8601 extended years).
// Years after 9999 fail these regexes; date sort/compare below is lexicographic.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const YEAR_RE = /^\d{4}$/;
const QID_RE = /^Q\d+$/;

export interface NetflixRow {
  id: string;
  title: string;
  year: string;
  date: string;
  wikidata: string;
  netflix: string;
}

async function loadCsv(path: string): Promise<Record<string, string>[]> {
  const text = await Deno.readTextFile(path);
  return parse(text, { skipFirstRow: true, strip: true }) as Record<
    string,
    string
  >[];
}

type WatchBounds = ReturnType<typeof watchBounds>;

function columnMismatchErrors(firstRow: NetflixRow): string[] {
  const fields = Object.keys(firstRow);
  if (fields.join(",") !== COLUMNS.join(",")) {
    return [`columns want ${[...COLUMNS]}, got ${fields}`];
  }
  return [];
}

function duplicateNonEmptyValueErrors(
  values: string[],
  message: string,
): string[] {
  const nonEmpty = values.filter((v) => v !== "");
  if (nonEmpty.length !== new Set(nonEmpty).size) return [message];
  return [];
}

function duplicateTitleErrors(netflixRows: NetflixRow[]): string[] {
  return duplicateNonEmptyValueErrors(
    netflixRows.map((r) => r.title ?? ""),
    "duplicate titles in netflix.csv",
  );
}

function duplicateNetflixIdErrors(netflixRows: NetflixRow[]): string[] {
  return duplicateNonEmptyValueErrors(
    netflixRows.map((r) => r.netflix ?? ""),
    "duplicate Netflix title ids in netflix.csv",
  );
}

function titleCoverageErrors(
  wantTitles: Set<string>,
  gotTitles: Set<string>,
): string[] {
  const errors: string[] = [];
  const missing = [...wantTitles].filter((t) => !gotTitles.has(t)).sort();
  const extra = [...gotTitles].filter((t) => !wantTitles.has(t)).sort();
  if (missing.length) {
    errors.push(`missing titles (${missing.length}): ${missing.slice(0, 5)}`);
  }
  if (extra.length) {
    errors.push(`extra titles (${extra.length}): ${extra.slice(0, 5)}`);
  }
  return errors;
}

function unsortedByDateDescendingErrors(netflixRows: NetflixRow[]): string[] {
  const dates = netflixRows.map((r) => r.date ?? "");
  const sorted = [...dates].sort().reverse();
  if (dates.join("\0") !== sorted.join("\0")) {
    return ["rows not sorted by date descending"];
  }
  return [];
}

function rowFieldErrors(
  netflixRows: NetflixRow[],
  bounds: WatchBounds,
): string[] {
  const errors: string[] = [];
  for (let i = 0; i < netflixRows.length; i++) {
    const line = i + 2;
    const r = netflixRows[i];
    const title = r.title ?? "";
    const id = r.id ?? "";
    const year = r.year ?? "";
    const date = r.date ?? "";
    const wd = r.wikidata ?? "";
    const netflixId = r.netflix ?? "";

    if (!title) errors.push(`L${line}: blank title`);
    if (!ID_RE.test(id)) errors.push(`L${line} '${title}': bad id '${id}'`);
    if (year && !YEAR_RE.test(year)) {
      errors.push(`L${line} '${title}': bad year '${year}'`);
    }
    if (!year) errors.push(`L${line} '${title}': blank year`);
    if (!DATE_RE.test(date)) {
      errors.push(`L${line} '${title}': bad date '${date}'`);
    }
    const range = bounds.get(title);
    if (range && date > range.max) {
      errors.push(
        `L${line} '${title}': date ${date} after last history watch ${range.max}`,
      );
    }
    if (wd && !QID_RE.test(wd)) {
      errors.push(`L${line} '${title}': bad wikidata '${wd}'`);
    }
    if (!NETFLIX_RE.test(netflixId)) {
      errors.push(
        `L${line} '${title}': bad/missing Netflix title id '${netflixId}'`,
      );
    }
  }
  return errors;
}

export function validate(
  netflixRows: NetflixRow[],
  historyRows: HistoryRow[],
): string[] {
  if (netflixRows.length === 0) return ["netflix.csv is empty"];

  const bounds = watchBounds(historyRows);
  const wantTitles = new Set(bounds.keys());
  const gotTitles = new Set(netflixRows.map((r) => r.title));

  return [
    ...columnMismatchErrors(netflixRows[0]),
    ...duplicateTitleErrors(netflixRows),
    ...duplicateNetflixIdErrors(netflixRows),
    ...titleCoverageErrors(wantTitles, gotTitles),
    ...unsortedByDateDescendingErrors(netflixRows),
    ...rowFieldErrors(netflixRows, bounds),
  ];
}

function usage(): void {
  console.error(
    `Usage: deno run validate_netflix_csv.ts [--netflix path] [--history path]

Validate movies/netflix.csv against collapsed Netflix viewing history.`,
  );
}

function parseCli(args: string[]) {
  let netflix = "movies/netflix.csv";
  let history = "movies/NetflixViewingHistory.csv";

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--netflix") {
      netflix = args[++i];
      if (!netflix) throw new Error("missing value for --netflix");
    } else if (a === "--history") {
      history = args[++i];
      if (!history) throw new Error("missing value for --history");
    } else if (a === "-h" || a === "--help") {
      usage();
      Deno.exit(0);
    } else {
      throw new Error(`unknown option: ${a}`);
    }
  }

  return { netflix, history };
}

async function main(args: string[]): Promise<number> {
  const { netflix, history } = parseCli(args);
  const netflixRows = await loadCsv(netflix) as unknown as NetflixRow[];
  const historyRows = await loadCsv(history) as unknown as HistoryRow[];

  const errors = validate(netflixRows, historyRows);
  if (errors.length) {
    console.error(`FAIL (${errors.length} issues)`);
    for (const e of errors) console.error(e);
    return 1;
  }

  const blankWd = netflixRows.filter((r) => !r.wikidata).length;
  const msg = blankWd
    ? `OK ${netflixRows.length} rows (${blankWd} blank wikidata)`
    : `OK ${netflixRows.length} rows`;
  console.log(msg);
  return 0;
}

if (import.meta.main) {
  try {
    Deno.exit(await main(Deno.args));
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    usage();
    Deno.exit(1);
  }
}
