/** Collapse NetflixViewingHistory.csv to one work per distinct title + first watch date. */

import { parse } from "https://deno.land/std@0.201.0/csv/mod.ts";

export interface HistoryRow {
  Title: string;
  Date: string;
}

export interface Work {
  title: string;
  date: string;
}

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

/** Parse Netflix export date `M/D/YY` to ISO `YYYY-MM-DD` (matches Python `%m/%d/%y`). */
export function parseDate(d: string): string {
  const [month, day, year] = d.split("/").map((s) => Number.parseInt(s, 10));
  const fullYear = year >= 69 ? 1900 + year : 2000 + year;
  return `${fullYear}-${String(month).padStart(2, "0")}-${
    String(day).padStart(2, "0")
  }`;
}

export function stripEpisode(t: string): string {
  if (t in EPISODE_TO_SERIES) return EPISODE_TO_SERIES[t];
  if (KEEP_FULL.has(t)) return t;
  for (
    const pat of [
      /: Season \d+:.*$/,
      /: Limited Series:.*$/,
      /: Episode \d+.*$/,
    ]
  ) {
    const nt = t.replace(pat, "");
    if (nt !== t) return nt;
  }
  return t;
}

export interface WatchBounds {
  min: string;
  max: string;
}

/** Group history rows by collapsed work title (shared by collapse and validation). */
export function groupByWork(rows: HistoryRow[]): Map<string, HistoryRow[]> {
  const groups = new Map<string, HistoryRow[]>();
  for (const r of rows) {
    const key = stripEpisode(r.Title);
    const list = groups.get(key) ?? [];
    list.push(r);
    groups.set(key, list);
  }

  const candidates = new Map<string, string[]>();
  for (const t of groups.keys()) {
    if (KEEP_FULL.has(t)) continue;
    const idx = t.indexOf(": ");
    if (idx === -1) continue;
    const pref = t.slice(0, idx);
    const list = candidates.get(pref) ?? [];
    list.push(t);
    candidates.set(pref, list);
  }

  const collapsed = new Map<string, string>();
  for (const [pref, ts] of candidates) {
    if (ts.length >= 2) {
      for (const t of ts) collapsed.set(t, pref);
    }
  }

  const final = new Map<string, HistoryRow[]>();
  for (const [t, rs] of groups) {
    let key = collapsed.get(t) ?? t;
    key = RENAME[key] ?? key;
    const list = final.get(key) ?? [];
    list.push(...rs);
    final.set(key, list);
  }

  return final;
}

export function watchBounds(rows: HistoryRow[]): Map<string, WatchBounds> {
  const bounds = new Map<string, WatchBounds>();
  for (const [title, rs] of groupByWork(rows)) {
    const dates = rs.map((r) => parseDate(r.Date)).sort();
    bounds.set(title, { min: dates[0]!, max: dates.at(-1)! });
  }
  return bounds;
}

export function collapse(rows: HistoryRow[]): Work[] {
  const works: Work[] = [];
  for (const [title, { min }] of watchBounds(rows)) {
    works.push({ title, date: min });
  }
  works.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return works;
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
  const text = await Deno.readTextFile(history);
  const rows = parse(text, {
    skipFirstRow: true,
    strip: true,
  }) as unknown as HistoryRow[];
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
