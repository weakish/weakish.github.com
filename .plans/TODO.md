# Lume Plugin Abstraction Candidates

Based on analysis of `_config.ts` and related custom files.

## Summary Table

| Priority | Plugin | Complexity | Source File |
|----------|--------|------------|-------------|
| High | **Wiki Links** - remark plugin for `[[link]]` syntax with path resolution | ~260 lines | `custom-wiki-links.ts` |
| High | **Movie Page** - JSX page component for displaying movie data | ~80 lines | `movies/page.page.ts`, `_includes/movie.page.tsx` |
| Medium | **Gemini Engine** - custom engine for `.gmi` file rendering | ~30 lines | `gemini.ts` |
| Medium | **HTML→Gemtext** - post-build converter to generate Gemini format | ~300 lines | `gemini-converter.ts` |
| Low | **README→Index** - URL transformer `README.md` → `index.html` | ~10 lines | `_data.ts` |

## Plugin Details

### 1. Wiki Links (High Priority)
Custom remark plugin that:
- Converts `[[link]]`, `[[link|text]]`, `[[link#heading|text]]` to HTML links
- Recursively resolves link paths across directories
- Handles `==text==` highlighting (renders as `<mark>`)
- Skips code blocks

### 2. Movie Page (High Priority)
JSX page component that:
- Renders a movie list from CSV data (`movies/ratings.csv`, `movies/movies.csv`)
- Parses notes from `movies/notes.csv`
- Displays ratings with collapsible notes
- Links to omdb.org for each movie

### 3. Gemini Engine (Medium Priority)
Custom Lume engine for `.gmi` (Gemtext) files:
- Uses `dioscuri` buffer for parsing
- Applies `rehype-starry-night` syntax highlighting

### 4. HTML→Gemtext Converter (Medium Priority)
Post-build script that:
- Parses HTML output with rehype
- Converts to Gemtext markup (headings, links, lists, code blocks)
- Skips certain directories (e.g., `zk/`)
- Deletes original HTML files

### 5. README→Index URL Transformer (Low Priority)
In `_data.ts` - transforms `README.md` paths to `index.html`

---

## Other Customizations (Not Plugin-Worthy)

- Site hostname injection (simple preprocess)
- Conditional 404 based on `MIRROR_LOCATION` env
- Custom page types (`article`, `zettel`) for feed filtering
- Git Date (simple preprocess hook)