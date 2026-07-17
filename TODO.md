# mmap.page site review

Code + content review of the Lume 3 / Deno static site · July 2026

## Verdict

Distinctive material (uses, dapi scholarship, zk, dive-into, film logs) sits
alongside intentional demo framing: this site experiments with Lume and AI
capacities, so a sandbox-style homepage and a public `AGENTS.md` are features,
not bugs. Remaining work is mostly discoverability, ops hardening, and shipping
orphaned `film/` data.

| Metric | Count |
|--------|------:|
| Markdown pages | ~170 |
| Open high findings | 0 |
| Medium findings | 5 |
| Test files | 3 |

## Architecture

Content-first Lume site → Netlify (mmap.page) + GitHub Pages mirror. Markdown
via remark/rehype (wiki-links, starry-night, AVIF pictures); dates from git;
feeds filter `type=article` (zettels excluded).

### Build pipeline

`_config.ts` → sri, nunjucks, jsx, pagefind, images, remark, resolve_urls,
readme, purgecss, sitemap, dual feeds

Gemini: `.gmi` engine in-build; HTML→Gemtext via `deno task gmi` (separate,
destructive on `_site`)

### Hosting split

`MIRROR_LOCATION` toggles Netlify vs GH Pages (404, copies, redirects)

Edge: `/teapot` → 418 · ~25 force redirects with static stubs for GH Pages
degradation

## Findings

| Severity | Area | Issue | Where | Status |
|----------|------|-------|-------|--------|
| High | CI | Test workflow pinned Deno v1.x (EOL) while Lume 3 wants Deno 2 | `.github/workflows/deno.yml` | Done — both workflows use `deno-version: lts` |
| Medium | Ops | `deno.lock` gitignored + `deno upgrade` on every Netlify build | `.gitignore`, `netlify.toml` | Open |
| Medium | Content | Homepage frames site as demos / AI sandbox | `README.md` | Intentional — demo of Lume + AI capacities |
| Medium | Content | `AGENTS.md` ships as a public page | `_site/AGENTS/` | Intentional — same demo purpose |
| Medium | Content | `film/` data never builds | `film/` | Open — see plan below |
| Medium | Discoverability | No global nav; zk/thoughts/coding-style/etc. absent from homepage | `_includes/default.njk`, `README.md` | Open (homepage omission intentional; nav still useful) |
| Medium | Code | Movies CSV typed as numbers but parse returns strings; `note` unused | `_includes/movie.page.tsx` | Open |
| Medium | Code | Wiki-link resolver: non-deterministic dupes, silent fallback | `plugins/wiki-links/mod.ts` | Open |
| Medium | Tests | Converter tests use marked HTML, not production remark pipeline | `gemini-converter_test.ts` | Open |
| Low | i18n | CJK pages hardcode `lang=en-US` | `_includes/default.njk` | Open |
| Low | Ops | GitHub Pages mirror uses `http://weakish.github.io` | `github-pages.yml` | Documented in `humans.txt` |

## Content by section

| Section | Pages | Status | Note |
|---------|------:|--------|------|
| zk | 38 | Strong | Zettelkasten; excluded from feeds |
| dive-into | 33 | Strong | Main technical notes |
| dapi | 23 | Strong | Chinese scholarship + games |
| coding-style | 14 | Good | Not linked from homepage |
| uses | 4 | Flagship | Best single page on the site |
| movies | 1 | Good | Live CSV-driven table |
| film | 0 | Orphaned | Rich JSON rolls; not in build |
| java/python/vim | 4 | Thin | Barely justify top-level dirs |

Also: log (archive), poems, thoughts, lists, web, fun/teapot toys,
StutteringTalkaholic (legacy redirects)

### Content strengths

- `uses/` — detailed, current, personal flagship
- `dapi/` — classical Chinese + literary + game guides; unique
- `zk/` — coherent wiki-linked Zettelkasten (Luhmann addresses)
- `dive-into/` — solid focused technical notes
- `film/rolls` — rich per-frame photo logs (currently invisible)
- Nice: WNPP/removal banners, humans.txt craft, Gemtext support

### Content gaps

- No section menu; many dirs only via sitemap/search
- Feeds hide zettels; no keyword index (`humans.txt` TODO)
- Thin hubs: java, python, vim; missing READMEs on several dirs
- Typos in older log/search pages; `typescrit-slogan` filename
- `removal:` pages linger; AI provenance noted unevenly
- `film/` JSON exists but has no pages in the build

## Recommended next steps

### P0 — Fix & ship

- [x] Pin CI to Deno 2 LTS (`deno.yml` + `github-pages.yml`)
- [ ] Ship `film/` (plan below)
- ~~Exclude `AGENTS.md` from build~~ — intentional
- ~~Rewrite homepage as real landing TOC~~ — intentional demo framing

### P1 — Discoverability

- [ ] Footer/nav linking all sections (including `film/` once shipped)
- [ ] zk feed or include zettels
- [ ] Keyword index for `zk/`
- [ ] Indexes for lang/web/vim/…

### P2 — Hardening

- [ ] Commit `deno.lock`; drop `deno upgrade`
- [ ] Fix `movie.page.tsx` types
- [ ] Warn on unresolved wiki links
- [ ] Per-page `lang` for CJK; typo pass

---

## Plan: ship `film/`

### Goal

Make `film/rolls/*.json` visible on the site as browsable pages, following the
same data-driven pattern as `movies/` (page module + JSX layout).

### Current state

| Path | Role |
|------|------|
| `film/rolls/hp5-anniversary.json` | One roll (~40 frames): name, ISO, camera, per-frame EXIF-ish data |
| `film/rolls/kodak-double-x-baiyoke.json` | Second roll, same schema |
| `_site/film/` | Missing — no generator, no `site.copy`, no README |

Roll schema (top level): `name`, `iso`, `pullPush`, `cameraName`, `frames`,
optional `note` / `date`.

Frame schema: `lensName`, `aperture`, `shutterSpeed`, `date`,
`exposureValue`, optional `distance` / `note`, and `location` as either a
place string or `{ latitude, longitude }`.

### Approach

Mirror `movies/`: a thin page module plus a JSX layout that reads JSON at
build time and renders HTML tables. Keep the JSON files as the source of
truth (no Markdown duplication).

### Steps

1. **Index page** — add `film/page.page.ts` (or `film/README.md`) listing all
   rolls with name, camera, ISO, frame count, and link to each roll URL.
2. **Roll pages** — add a generator (e.g. `film/rolls.page.ts` using Lume
   `paginate` / dynamic pages, or one `*.page.ts` per roll) that:
   - reads `film/rolls/*.json`
   - sets `url` to `/film/<slug>/` (slug from filename)
   - sets `layout` to a new `_includes/film.page.tsx`
3. **Layout** — `_includes/film.page.tsx` renders:
   - roll header (name, camera, ISO, pull/push, roll note/date)
   - frame table: #, date, aperture, shutter, distance, lens, note, location
   - for GPS locations, a text lat/lon (and optional OSM link); for strings, show as-is
4. **Discoverability** — link `/film/` from homepage sandbox list and/or
   footer once nav work lands; include in sitemap via normal page pipeline
   (`type=article` or a dedicated `type=film` if feeds should exclude them).
5. **Optional polish** — sort frames numerically; normalize empty notes;
   add a short `film/README.md` explaining the logging format.

### Files to add/change

| File | Action |
|------|--------|
| `film/page.page.ts` | New — index of rolls |
| `film/rolls.page.ts` (or similar) | New — one page per JSON roll |
| `_includes/film.page.tsx` | New — JSX roll layout |
| `README.md` | Optional — one link under random pages |
| `_includes/default.njk` | Later — footer/nav link (P1) |

### Out of scope (for this ship)

- Hosting scanned negatives / image assets (JSON-only for now)
- Interactive maps
- Gemtext conversion special-casing

### Done when

- `/film/` lists both existing rolls
- `/film/hp5-anniversary/` and `/film/kodak-double-x-baiyoke/` render frame tables
- `deno task build` succeeds; pages appear in `_site/film/` and sitemap

---

Sampled sections rather than every page. Working tree was clean on branch
`review` at initial review time; CI Deno pin and `humans.txt` hosting notes
landed afterward.
