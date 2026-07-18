---
name: generate-netflix-csv
description: >-
  Build or refresh movies/netflix.csv from NetflixViewingHistory.csv: collapse
  episodes to works, resolve OMDb/IMDb/TMDB ids, Wikidata Q-ids, and Netflix
  title IDs. Use when generating, updating, or validating netflix.csv, or when
  the user mentions Netflix viewing history, NetflixViewingHistory.csv, or
  movies/netflix.csv.
---

# Generate netflix.csv

Repo paths (from repository root):

| File | Role |
|------|------|
| `movies/NetflixViewingHistory.csv` | Netflix export (`Title,Date`; dates `M/D/YY`) |
| `movies/netflix.csv` | Curated output |
| `movies/ratings.csv` | OMDb numeric ids (no `m` prefix) — reuse when titles match |

## Helper scripts (Deno/TypeScript)

Helpers live under `scripts/` as Deno/TypeScript (same `@std/csv` import as `_includes/movie.page.tsx`). Run from repo root with explicit read permissions; add `--allow-write` only when using `-o` / `--output`:

```bash
# stdout (read-only)
deno run --allow-read=movies,.agents/skills/generate-netflix-csv/scripts \
  .agents/skills/generate-netflix-csv/scripts/collapse_history.ts \
  movies/NetflixViewingHistory.csv

# write JSON via -o
deno run --allow-read=movies,.agents/skills/generate-netflix-csv/scripts \
  --allow-write=works.json \
  .agents/skills/generate-netflix-csv/scripts/collapse_history.ts \
  movies/NetflixViewingHistory.csv -o works.json
```

No network permission is required for collapse or validate.

## Output schema

Header (exact order):

```csv
id,title,year,date,wikidata,netflix
```

Example:

```csv
m300581,"Lorena, Light-Footed Woman",2019,2025-06-06,Q78191654,80244683
```

| Column | Rule |
|--------|------|
| `id` | Prefer [omdb.org](https://www.omdb.org) as `m` + digits (e.g. `m300581`). Else IMDb `tt…`. Else TMDB bare digits (e.g. `660978`). |
| `title` | Collapsed work title (see collapse script). Keep Netflix **language tags**—parenthetical edition markers like `(Tamil)` / `(Hindi)` from the export `Title`—verbatim when present in history. |
| `year` | Film release year, or series premiere / first-release year. RFC 3339 four-digit year (see [Limits](#limits)). |
| `date` | First watch date from history, RFC 3339 `full-date` (`YYYY-MM-DD`; oldest date for that collapsed work). Four-digit year (see [Limits](#limits)). |
| `wikidata` | Item Q-id when known (e.g. `Q78191654`). May be blank. |
| `netflix` | Bare numeric Netflix title id (e.g. `80244683`). **Required** — every history-derived work was on Netflix. |

Sort rows by `date` descending.

## Limits

**Y10K:** `year` and `date` use RFC 3339’s four-digit-year profile (`YEAR_RE`, `DATE_RE` in `validate_netflix_csv.ts`), not full ISO 8601 extended years (`+010000-01-01`). Years after **9999** fail validation. String sort/compare in the validator assumes fixed-width years. Not a practical issue for Netflix exports or film release years; widening would need longer regexes and parsed-date comparison (not lexicographic strings).

When copying an OMDb id from `ratings.csv`, **add** the `m` prefix for `netflix.csv` (`300581` → `m300581`). Do not change `ratings.csv`.

## Workflow

Copy and track:

```
Progress:
- [ ] 1. Collapse history → works
- [ ] 2. Reuse existing netflix.csv / ratings.csv metadata
- [ ] 3. Resolve missing id / year / wikidata / Netflix title id
- [ ] 4. Write movies/netflix.csv
- [ ] 5. Validate
```

### 1. Collapse history

Run (from repo root):

```bash
deno run --allow-read=movies,.agents/skills/generate-netflix-csv/scripts \
  .agents/skills/generate-netflix-csv/scripts/collapse_history.ts \
  movies/NetflixViewingHistory.csv
```

Use this script — do not re-invent collapse rules. If a new title needs an exception, edit `KEEP_FULL`, `EPISODE_TO_SERIES`, or `RENAME` in `.agents/skills/generate-netflix-csv/scripts/collapse_history.ts`, then re-run.

### 2. Reuse curated rows

For each collapsed title:

1. If `movies/netflix.csv` already has that title, keep `id`, `year`, `date`, `wikidata`, `netflix` unless the user asked to fix a wrong mapping.
2. Else (title not yet in `netflix.csv`): reuse `ratings.csv` `id` and `year` when the title matches (`m{id}`); look up Wikidata Q-id and Netflix title id; set `date` from the collapsed first-watch date.

### 3. Resolve missing metadata

**id + year** (in order):

1. Resolve the **Netflix title id** first (`netflix` column / Wikidata `P1874` / `netflix.com/title/…`). The Netflix page is the source of truth for which edition was watched.
2. Wikidata search → claims `P345` (IMDb), `P3302` (OMDb numeric if present), publication date for year. Prefer the item linked to that Netflix edition.
3. IMDb suggestion API: `https://v2.sg.media-imdb.com/suggestion/{first_letter}/{urlencoded_title}.json`
4. omdb.org / web search for numeric OMDb id when the title exists there.
5. TMDB search only if neither OMDb nor IMDb has an entry → bare numeric id.
6. Disambiguate same-name works using the Netflix title page, then **language tag**, cast, plot, and year. Pick the OMDb/IMDb/Wikidata entry for the edition **on Netflix (or that was on Netflix when watched)**—not the newest remake by default.
   - **Language tag** = edition marker in the Netflix export `Title` (e.g. `(Tamil)`, `(Hindi)`, or subtitles like `Tamil Extended Cut`). Not a locale code or audio-track field. For South Asian titles, treat it as a distinct language edition, often re-filmed—not just a dub.
   - Example: `Kushi (Tamil)` → Netflix title id `81728992` streams the 2023 Tamil edition (`tt15380630`), not the unrelated 2000 film—because that is what Netflix listed, not because it is newer.

**Netflix title id** (`netflix` column) — lock this **before** matching OMDb/IMDb/Wikidata:

1. Wikidata `P1874` (Netflix ID).
2. Else web search / uNoGS / Netflix title pages. Confirm the page matches the work (not a same-name neighbor like Dark Desire vs The Desire). Use this page to disambiguate same-title editions (see **id + year** above).
3. Never leave the column blank for a history-derived row.

**wikidata**: Q-id of the same Netflix edition. Leave blank if none exists.

### 4. Write CSV

Write `movies/netflix.csv` with proper CSV quoting (e.g. Deno `@std/csv` or manual). One row per collapsed work. UTF-8, `\n` line endings.

### 5. Validate

```bash
deno run --allow-read=movies,.agents/skills/generate-netflix-csv/scripts \
  .agents/skills/generate-netflix-csv/scripts/validate_netflix_csv.ts
```

Fix until it prints `OK`. Blank `wikidata` is allowed; `id`, `year`, and `netflix` are required. Each `date` must not be after the last watch in the current history export; preserved first-watch dates older than that export's minimum are allowed.

## Incremental updates

When the user drops a new `NetflixViewingHistory.csv`:

1. Collapse and diff titles against current `netflix.csv`.
2. Keep `date` for titles that already exist (first watch is stable).
3. Look up metadata only for **new** titles (and any the user flagged as wrong); set their `date` from the collapsed first-watch date.
4. Re-sort by date desc and validate.

## Common pitfalls

- Collapsing film subtitles at the first colon (`John Wick: Chapter 2` must stay whole → `KEEP_FULL`).
- Using bare OMDb digits in `netflix.csv` (must be `m…`).
- Mapping a Netflix watch to an edition Netflix did not stream for that title id (e.g. a remake or another language version not on that Netflix page).
- Confusing similarly named Netflix titles (verify the title id against plot/cast).
- Overwriting an existing row's `date` on re-export (first watch must stay).
- Forgetting to re-sort by `date` desc after adding new titles.
