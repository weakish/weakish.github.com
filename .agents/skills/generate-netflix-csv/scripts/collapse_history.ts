/** Collapse NetflixViewingHistory.csv to one work per distinct title + first watch date. */

import { parse } from "@std/csv";

export interface HistoryRow {
  title: string;
  mdyDate: string;
}

export interface Work {
  title: string;
  date: string;
}

// Exception tables for strip/collapse. Fine for a small curated export; does
// not scale as NetflixViewingHistory grows — prefer an alternative such as
// Wikidata lookup (series/episode membership) instead of ever-longer lists.

// Films / special titles whose colon is part of the work name (do not strip).
export const KEEP_FULL = new Set([
  "The Hunger Games: Mockingjay - Part 2",
  "The Hunger Games: Mockingjay - Part 1",
  "Jawan: Tamil Extended Cut",
  "A Chinese Odyssey Part Two: Cinderella",
  "John Wick: Chapter 3 - Parabellum",
  "John Wick: Chapter 2",
  "Sex, Love & goop: A show about sex.",
  "BLACKPINK: Light Up the Sky",
  "Anne+: The Film",
  "Gypsy: The Rabbit Hole",
]);

// Single watched episode whose Netflix title is not "Show: Season N: …".
export const EPISODE_TO_SERIES: Record<string, string> = {
  "Doona!: An Unexpected Twist": "Doona!",
  "Our Planet: One Planet": "Our Planet",
  "The Letter for the King: Storm Clouds Gather": "The Letter for the King",
  "Girl From Nowhere The Reset: Sky": "Girl From Nowhere The Reset",
};

// After pattern collapse, normalize duplicated show prefixes.
export const RENAME: Record<string, string> = {
  "The Empress of Ayodhaya: The Empress Of Ayodhaya": "The Empress of Ayodhaya",
};

export function plainDateFromYmdOrRangeError(
  year: number,
  month: number,
  day: number,
): Temporal.PlainDate | RangeError {
  try {
    return Temporal.PlainDate.from(
      { year, month, day },
      { overflow: "reject" },
    );
  } catch (err) {
    if (err instanceof RangeError) return err;
    throw err;
  }
}

/** Parse Netflix streaming export `M/D/YY` to ISO `YYYY-MM-DD` (`YY` → 20YY).
 * Netflix started their streaming business in 2007 and the exported watch
 * history only includes titles streamed. DVD rentals are not included. */
export function parseDate(d: string): string {
  if (!/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(d)) {
    throw new Error(`history date must be M/D/YY, got ${JSON.stringify(d)}`);
  }
  const [month, day, year] = d.split("/").map((s) => Number.parseInt(s, 10));
  const dateOrError = plainDateFromYmdOrRangeError(2000 + year, month, day);
  if (dateOrError instanceof RangeError) {
    throw new Error(
      `history date is not a valid calendar day, got ${JSON.stringify(d)}`,
      { cause: dateOrError },
    );
  }
  return dateOrError.toString();
}

export function stripEpisode(t: string): string {
  if (t in EPISODE_TO_SERIES) return EPISODE_TO_SERIES[t];
  if (KEEP_FULL.has(t)) return t;
  for (
    const stripPattern of [
      /: Season \d+:.*$/,
      /: Limited Series:.*$/,
      /: Episode \d+.*$/,
    ]
  ) {
    const stripped = t.replace(stripPattern, "");
    if (stripped !== t) return stripped;
  }
  return t;
}

/** Collapse titles that share a `": "`-prefix with at least one other title. */
export function collapseSharedPrefixes(
  titles: Iterable<string>,
): Map<string, string> {
  const candidates = Map.groupBy(
    [...titles].filter((title) =>
      !KEEP_FULL.has(title) && title.includes(": ")
    ),
    (title) => title.slice(0, title.indexOf(": ")),
  );

  const collapsed = new Map<string, string>();
  for (const [prefix, prefixedTitles] of candidates) {
    if (prefixedTitles.length >= 2) {
      for (const title of prefixedTitles) collapsed.set(title, prefix);
    }
  }
  return collapsed;
}

export interface WatchBounds {
  min: string;
  max: string;
}

/** Group history rows by collapsed work title (shared by collapse and validation). */
export function groupByWork(rows: HistoryRow[]): Map<string, HistoryRow[]> {
  const groups = Map.groupBy(rows, (r) => stripEpisode(r.title));
  const collapsed = collapseSharedPrefixes(groups.keys());

  const final = new Map<string, HistoryRow[]>();
  for (const [t, rs] of groups) {
    const collapsedOrOriginal = collapsed.get(t) ?? t;
    const key = RENAME[collapsedOrOriginal] ?? collapsedOrOriginal;
    const list = final.get(key) ?? [];
    list.push(...rs);
    final.set(key, list);
  }

  return final;
}

function isoDateBounds(dates: string[]): WatchBounds {
  const first = dates[0];
  if (first === undefined) {
    throw new Error("isoDateBounds requires at least one date");
  }
  let min = first;
  let max = first;
  for (const d of dates) {
    if (d < min) min = d;
    if (d > max) max = d;
  }
  return { min, max };
}

export function watchBounds(rows: HistoryRow[]): Map<string, WatchBounds> {
  const bounds = new Map<string, WatchBounds>();
  for (const [title, rs] of groupByWork(rows)) {
    bounds.set(
      title,
      isoDateBounds(rs.map((r) => parseDate(r.mdyDate))),
    );
  }
  return bounds;
}

export function collapse(rows: HistoryRow[]): Work[] {
  return [...watchBounds(rows)]
    .map(([title, { min }]) => ({ title, date: min }))
    .toSorted((a, b) => b.date.localeCompare(a.date));
}

/** Map Netflix export CSV (`Title,Date`) into trimmed domain rows. */
export function historyRowsFromCsv(text: string): HistoryRow[] {
  const table = parse(text);
  const header = table[0];
  const missingColumns = "history CSV requires Title and Date columns";
  if (header === undefined) {
    throw new Error(missingColumns);
  }
  const keys = header.map((h) => h.trim());
  const titleIdx = keys.indexOf("Title");
  const dateIdx = keys.indexOf("Date");
  if (titleIdx === -1 || dateIdx === -1) {
    throw new Error(missingColumns);
  }
  return table.slice(1).map((cells) => {
    if (cells.length !== keys.length) {
      throw new Error("history CSV row cell count does not match header");
    }
    const title = cells[titleIdx];
    const date = cells[dateIdx];
    const trimmedTitle = title.trim();
    const trimmedDate = date.trim();
    if (trimmedTitle === "" || trimmedDate === "") {
      throw new Error("history CSV row has blank Title or Date");
    }
    return { title: trimmedTitle, mdyDate: trimmedDate };
  });
}

export async function loadHistoryRows(path: string): Promise<HistoryRow[]> {
  return historyRowsFromCsv(await Deno.readTextFile(path));
}

function usage(): void {
  console.error(
    `Usage: deno run collapse_history.ts [history.csv] [-o output.json] [--titles-only]

Collapse NetflixViewingHistory.csv to distinct works with first watch dates.`,
  );
}

function parseCli(args: string[]) {
  let history = "movies/NetflixViewingHistory.csv";
  let output: string | undefined;
  let titlesOnly = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "-o" || a === "--output") {
      output = args[++i];
      if (!output) throw new Error("missing value for --output");
    } else if (a === "--titles-only") {
      titlesOnly = true;
    } else if (a === "-h" || a === "--help") {
      usage();
      Deno.exit(0);
    } else if (a.startsWith("-")) {
      throw new Error(`unknown option: ${a}`);
    } else {
      history = a;
    }
  }

  return { history, output, titlesOnly };
}

async function main(args: string[]): Promise<number> {
  const { history, output, titlesOnly } = parseCli(args);
  const rows = await loadHistoryRows(history);
  const works = collapse(rows);

  const body = titlesOnly
    ? works.map((w) => w.title).join("\n") + "\n"
    : JSON.stringify(works, null, 2) + "\n";

  if (output) {
    await Deno.writeTextFile(output, body);
  } else {
    await Deno.stdout.write(new TextEncoder().encode(body));
  }

  console.error(`# ${works.length} works from ${rows.length} history rows`);
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
