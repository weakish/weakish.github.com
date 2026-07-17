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
| `title` | Collapsed work title (see collapse script). Keep Netflix language tags like `(Tamil)` when present in history. |
| `year` | Film release year, or series premiere / first-release year. |
| `date` | Latest watch date from history, ISO `YYYY-MM-DD`. |
| `wikidata` | Item Q-id when known (e.g. `Q78191654`). May be blank. |
| `netflix` | Bare numeric Netflix title id (e.g. `80244683`). **Required** — every history-derived work was on Netflix. |

Sort rows by `date` descending.

When copying an OMDb id from `ratings.csv`, **add** the `m` prefix for `netflix.csv` (`300581` → `m300581`). Do not change `ratings.csv`.

## Workflow

Copy and track:

```
Progress:
- [ ] 1. Collapse history → works
- [ ] 2. Reuse existing netflix.csv / ratings.csv metadata
- [ ] 3. Resolve missing id / year / wikidata / netflix
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

1. If `movies/netflix.csv` already has that title, keep `id`, `year`, `wikidata`, `netflix` unless the user asked to fix a wrong mapping.
2. Else if `movies/ratings.csv` matches the title, take its numeric OMDb `id` → `m{id}` and `year`; still look up `wikidata` + Netflix `netflix` id.
3. Always refresh `date` from the latest history date for that work.

### 3. Resolve missing metadata

**id + year** (in order):

1. Wikidata search → claims `P345` (IMDb), `P3302` (OMDb numeric if present), publication date for year.
2. IMDb suggestion API: `https://v2.sg.media-imdb.com/suggestion/{first_letter}/{urlencoded_title}.json`
3. omdb.org / web search for numeric OMDb id when the title exists there.
4. TMDB search only if neither OMDb nor IMDb has an entry → bare numeric id.
5. Disambiguate by language tag, cast, and **what Netflix actually streams**. Prefer the remake/edition on Netflix over an older film that shares the title (e.g. `Kushi (Tamil)` → 2023 remake, not 2000).

**wikidata**: Q-id of the same work. Leave blank if none exists.

**netflix** (Netflix title id):

1. Wikidata `P1874` (Netflix ID).
2. Else web search / uNoGS / Netflix title pages. Confirm the page matches the work (not a same-name neighbor like Dark Desire vs The Desire).
3. Never leave `netflix` blank for a history-derived row.

### 4. Write CSV

Write `movies/netflix.csv` with proper CSV quoting (e.g. Deno `@std/csv` or manual). One row per collapsed work. UTF-8, `\n` line endings.

### 5. Validate

```bash
deno run --allow-read=movies,.agents/skills/generate-netflix-csv/scripts \
  .agents/skills/generate-netflix-csv/scripts/validate_netflix_csv.ts
```

Fix until it prints `OK`. Blank `wikidata` is allowed; blank `netflix` / `id` / `year` is not.

## Incremental updates

When the user drops a new `NetflixViewingHistory.csv`:

1. Collapse and diff titles against current `netflix.csv`.
2. Update `date` for titles that already exist.
3. Look up metadata only for **new** titles (and any the user flagged as wrong).
4. Re-sort by date desc and validate.

## Common pitfalls

- Collapsing film subtitles at the first colon (`John Wick: Chapter 2` must stay whole → `KEEP_FULL`).
- Using bare OMDb digits in `netflix.csv` (must be `m…`).
- Mapping a Netflix watch to a non-Netflix edition of the same name.
- Confusing similarly named Netflix titles (verify `netflix` id against plot/cast).
- Forgetting to bump `date` when history is re-exported.
