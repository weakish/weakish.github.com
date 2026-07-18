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

// Skip "" so blanks do not look like duplicates; rowFieldErrors reports blank
// title / missing netflix id. No branded NonEmptyString: TS brands are a cast-
// bypassable workaround (no first-class opaque types), heavier than this needs.
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
    netflixRows.map((r) => r.title),
    "duplicate titles in netflix.csv",
  );
}

function duplicateNetflixIdErrors(netflixRows: NetflixRow[]): string[] {
  return duplicateNonEmptyValueErrors(
    netflixRows.map((r) => r.netflix),
    "duplicate Netflix title ids in netflix.csv",
  );
}

function sortedTitlesIn(titles: Set<string>) {
  return {
    notIn(excluding: Set<string>): string[] {
      return [...titles].filter((t) => !excluding.has(t)).sort();
    },
  };
}

function quoteValueInError(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function titleCoverageListError(
  kind: "missing" | "extra",
  titles: string[],
): string[] {
  if (titles.length === 0) return [];
  const sample = titles.slice(0, 5);
  const sampleList = sample.map(quoteValueInError).join(", ");
  const suffix = sample.length < titles.length ? ", ..." : "";
  return [`${kind} titles (${titles.length}): ${sampleList}${suffix}`];
}

function titleCoverageErrors(
  wantTitles: Set<string>,
  gotTitles: Set<string>,
): string[] {
  return [
    ...titleCoverageListError(
      "missing",
      sortedTitlesIn(wantTitles).notIn(gotTitles),
    ),
    ...titleCoverageListError(
      "extra",
      sortedTitlesIn(gotTitles).notIn(wantTitles),
    ),
  ];
}

function unsortedByDateDescendingErrors(netflixRows: NetflixRow[]): string[] {
  for (let i = 1; i < netflixRows.length; i++) {
    const prev = netflixRows[i - 1].date;
    const curr = netflixRows[i].date;
    if (prev < curr) return ["rows not sorted by date descending"];
  }
  return [];
}

function trimmedCsvField(value: string | undefined): string {
  return (value ?? "").trim();
}

function trimNetflixRow(row: NetflixRow): NetflixRow {
  return {
    id: trimmedCsvField(row.id),
    title: trimmedCsvField(row.title),
    year: trimmedCsvField(row.year),
    date: trimmedCsvField(row.date),
    wikidata: trimmedCsvField(row.wikidata),
    netflix: trimmedCsvField(row.netflix),
  };
}

function trimHistoryRow(row: HistoryRow): HistoryRow {
  return {
    Title: trimmedCsvField(row.Title),
    Date: trimmedCsvField(row.Date),
  };
}

function fieldErrorsForNetflixRow(
  line: number,
  row: NetflixRow,
  bounds: WatchBounds,
): string[] {
  const errors: string[] = [];
  const title = row.title;
  const qTitle = quoteValueInError(title);
  const id = row.id;
  const year = row.year;
  const date = row.date;
  const wikidata = row.wikidata;
  const netflixId = row.netflix;

  if (title === "") errors.push(`L${line}: blank title`);
  if (id === "") {
    errors.push(`L${line} ${qTitle}: blank id`);
  } else if (!ID_RE.test(id)) {
    errors.push(`L${line} ${qTitle}: invalid id ${quoteValueInError(id)}`);
  }
  if (year === "") {
    errors.push(`L${line} ${qTitle}: blank year`);
  } else if (!YEAR_RE.test(year)) {
    errors.push(`L${line} ${qTitle}: invalid year ${quoteValueInError(year)}`);
  }
  if (date === "") {
    errors.push(`L${line} ${qTitle}: blank date`);
  } else if (!DATE_RE.test(date)) {
    errors.push(`L${line} ${qTitle}: invalid date ${quoteValueInError(date)}`);
  } else {
    const range = bounds.get(title);
    if (range && date > range.max) {
      errors.push(
        `L${line} ${qTitle}: date ${date} after last history watch ${range.max}`,
      );
    }
  }
  if (wikidata && !QID_RE.test(wikidata)) {
    errors.push(
      `L${line} ${qTitle}: invalid wikidata ${quoteValueInError(wikidata)}`,
    );
  }
  if (netflixId === "") {
    errors.push(`L${line} ${qTitle}: blank Netflix title id`);
  } else if (!NETFLIX_RE.test(netflixId)) {
    errors.push(
      `L${line} ${qTitle}: invalid Netflix title id ${
        quoteValueInError(netflixId)
      }`,
    );
  }
  return errors;
}

function rowFieldErrors(
  netflixRows: NetflixRow[],
  bounds: WatchBounds,
): string[] {
  return netflixRows.flatMap((row, i) =>
    // CSV line 1 is the header; netflixRows[i] is file line i + 2.
    fieldErrorsForNetflixRow(i + 2, row, bounds)
  );
}

export function validate(
  netflixRows: NetflixRow[],
  historyRows: HistoryRow[],
): string[] {
  if (netflixRows.length === 0) return ["netflix.csv is empty"];

  // Trim once so field, duplicate, coverage, sort, and bounds share values.
  const rows = netflixRows.map(trimNetflixRow);
  const bounds = watchBounds(historyRows.map(trimHistoryRow));
  const wantTitles = new Set(bounds.keys());
  const gotTitles = new Set(rows.map((r) => r.title));

  return [
    ...columnMismatchErrors(rows[0]),
    ...duplicateTitleErrors(rows),
    ...duplicateNetflixIdErrors(rows),
    ...titleCoverageErrors(wantTitles, gotTitles),
    ...unsortedByDateDescendingErrors(rows),
    ...rowFieldErrors(rows, bounds),
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

  const blankWikidataCount = netflixRows.filter((r) => !r.wikidata).length;
  const msg = blankWikidataCount
    ? `OK ${netflixRows.length} rows (${blankWikidataCount} blank wikidata)`
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
