/** Validate movies/netflix.csv against NetflixViewingHistory.csv and schema rules. */

import { parse } from "@std/csv";
import {
  type HistoryRow,
  loadHistoryRows,
  plainDateFromYmdOrRangeError,
  type WatchBounds,
  watchBounds,
} from "./collapse_history.ts";

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

export interface NetflixCsvData {
  /** Header names in file order (may include "" for unnamed columns). */
  headers: string[];
  records: Record<string, string>[];
}

const RAGGED_NETFLIX_CSV_ROW =
  "netflix.csv row cell count does not match header";

/** Parse netflix.csv text; trim header names so spaced columns still map. */
export function netflixCsvFromText(text: string): NetflixCsvData {
  const table = parse(text);
  const header = table[0];
  if (header === undefined) return { headers: [], records: [] };
  const headers = header.map((h) => h.trim());
  const records = table.slice(1).map((cells) => {
    if (cells.length !== headers.length) {
      throw new Error(RAGGED_NETFLIX_CSV_ROW);
    }
    const row: Record<string, string> = {};
    for (const [i, key] of headers.entries()) {
      // Unnamed headers are kept in `headers` for the column check; skip here
      // so they do not collapse to a single "" field on the record.
      if (key === "") continue;
      row[key] = cells[i];
    }
    return row;
  });
  return { headers, records };
}

async function loadNetflixCsv(path: string): Promise<NetflixCsvData> {
  return netflixCsvFromText(await Deno.readTextFile(path));
}

function columnMismatchErrors(headers: string[]): string[] {
  if (headers.join(",") !== COLUMNS.join(",")) {
    return [`columns want ${[...COLUMNS]}, got ${headers}`];
  }
  return [];
}

// Skip "" so blanks do not look like duplicates; rowFieldErrors reports blank
// title / missing netflix id.
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
      [...wantTitles.difference(gotTitles)].toSorted(),
    ),
    ...titleCoverageListError(
      "extra",
      [...gotTitles.difference(wantTitles)].toSorted(),
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

/** Trim CSV fields into a domain NetflixRow (after column check). */
function netflixRowFromRecord(row: Record<string, string>): NetflixRow {
  return {
    id: trimmedCsvField(row.id),
    title: trimmedCsvField(row.title),
    year: trimmedCsvField(row.year),
    date: trimmedCsvField(row.date),
    wikidata: trimmedCsvField(row.wikidata),
    netflix: trimmedCsvField(row.netflix),
  };
}

function isValidNetflixPlainDate(date: string): boolean {
  const [yearPart, month, day] = date.split("-").map((p) =>
    Number.parseInt(p, 10)
  );
  const dateOrError = plainDateFromYmdOrRangeError(yearPart, month, day);
  return !(dateOrError instanceof RangeError);
}

function fieldErrorsForNetflixRow(
  line: number,
  row: NetflixRow,
  bounds: Map<string, WatchBounds>,
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
  } else if (!isValidNetflixPlainDate(date)) {
    errors.push(
      `L${line} ${qTitle}: date is not a valid calendar day ${
        quoteValueInError(date)
      }`,
    );
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
  bounds: Map<string, WatchBounds>,
): string[] {
  return netflixRows.flatMap((row, i) =>
    // CSV line 1 is the header; netflixRows[i] is file line i + 2.
    fieldErrorsForNetflixRow(i + 2, row, bounds)
  );
}

export function validate(
  netflix: NetflixCsvData,
  historyRows: HistoryRow[],
): string[] {
  const { headers, records: netflixRecords } = netflix;
  if (headers.length === 0 && netflixRecords.length === 0) {
    return ["netflix.csv is empty"];
  }

  // Column keys from the raw CSV header. On mismatch, stop before field checks
  // turn missing headers into blank-field noise. Header-only files still run
  // this check so extra/unnamed columns are not reported as "empty".
  const columnErrors = columnMismatchErrors(headers);
  if (columnErrors.length > 0) return columnErrors;

  if (netflixRecords.length === 0) return ["netflix.csv is empty"];

  const rows = netflixRecords.map(netflixRowFromRecord);
  const bounds = watchBounds(historyRows);
  const wantTitles = new Set(bounds.keys());
  const gotTitles = new Set(rows.map((r) => r.title));

  return [
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
  const netflixCsv = await loadNetflixCsv(netflix);
  const historyRows = await loadHistoryRows(history);

  const errors = validate(netflixCsv, historyRows);
  if (errors.length) {
    console.error(`FAIL (${errors.length} issues)`);
    for (const e of errors) console.error(e);
    return 1;
  }

  const blankWikidataCount =
    netflixCsv.records.filter((r) => !trimmedCsvField(r.wikidata)).length;
  const msg = blankWikidataCount
    ? `OK ${netflixCsv.records.length} rows (${blankWikidataCount} blank wikidata)`
    : `OK ${netflixCsv.records.length} rows`;
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
