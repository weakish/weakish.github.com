# mmap.page site review

Code + content review of the Lume 3 / Deno static site · July 2026

## Verdict

The writing is stronger than the packaging. Distinctive material (uses, dapi
scholarship, zk, dive-into) is undersold by a demo-framed homepage, missing
navigation, and a few infra leaks. The highest-urgency code issue is CI
testing on Deno v1 while production builds on Deno 2.

| Metric | Count |
|--------|------:|
| Markdown pages | ~170 |
| High findings | 1 |
| Medium findings | 7 |
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

| Severity | Area | Issue | Where |
|----------|------|-------|-------|
| High | CI | Test workflow pins Deno v1.x while Lume 3 needs Deno 2 | `.github/workflows/deno.yml` |
| Medium | Ops | `deno.lock` gitignored + `deno upgrade` on every Netlify build | `.gitignore`, `netlify.toml` |
| Medium | Content | Homepage frames strong content as demos / possible AI sandbox | `README.md` |
| Medium | Content | `AGENTS.md` ships as a public page; `film/` data never builds | `_site/AGENTS/`, `film/` |
| Medium | Discoverability | No global nav; zk/thoughts/coding-style/etc. absent from homepage | `_includes/default.njk`, `README.md` |
| Medium | Code | Movies CSV typed as numbers but parse returns strings; `note` unused | `_includes/movie.page.tsx` |
| Medium | Code | Wiki-link resolver: non-deterministic dupes, silent fallback | `plugins/wiki-links/mod.ts` |
| Medium | Tests | Converter tests use marked HTML, not production remark pipeline | `gemini-converter_test.ts` |
| Low | i18n | CJK pages hardcode `lang=en-US` | `_includes/default.njk` |
| Low | Ops | GitHub Pages mirror uses `http://weakish.github.io` | `github-pages.yml` |

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

- README identity: demo/sandbox vs real personal site
- No section menu; many dirs only via sitemap/search
- Feeds hide zettels; no keyword index (`humans.txt` TODO)
- Thin hubs: java, python, vim; missing READMEs on several dirs
- Typos in older log/search pages; `typescrit-slogan` filename
- `removal:` pages linger; AI provenance noted unevenly

## Recommended next steps

### P0 — Fix & protect

- [ ] Pin Deno v2.x in `deno.yml`
- [ ] Exclude `AGENTS.md` from build
- [ ] Rewrite homepage as real landing TOC
- [ ] Ship or drop `film/`

### P1 — Discoverability

- [ ] Footer/nav linking all sections
- [ ] zk feed or include zettels
- [ ] Keyword index for `zk/`
- [ ] Indexes for lang/web/vim/…

### P2 — Hardening

- [ ] Commit `deno.lock`; drop `deno upgrade`
- [ ] Fix `movie.page.tsx` types
- [ ] Warn on unresolved wiki links
- [ ] Per-page `lang` for CJK; typo pass

---

Sampled sections rather than every page. Working tree was clean on branch
`review` at review time.
