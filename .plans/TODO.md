# Lume Plugin Abstraction Candidates

Based on analysis of `_config.ts` and related custom files.

## Summary Table

| Priority | Plugin | Complexity | Source File |
|----------|--------|------------|-------------|
| High | **Wiki Links** - remark plugin for `[[link]]` syntax with path resolution | ~260 lines | `custom-wiki-links.ts` |
| High | **Movie Page** - JSX page component for displaying movie data | ~80 lines | `movies/page.page.ts`, `_includes/movie.page.tsx` |
| Medium | **Gemini Engine** - custom engine for `.gmi` file rendering | ~30 lines | `gemini.ts` |
| Medium | **HTML→Gemtext** - post-build converter to generate Gemini format | ~300 lines | `gemini-converter.ts` |
| High | **README→Index** (`readme`) - URL transformer `README.md` → directory URL | ~100 lines | `readme.ts`, `mod.ts` ✅ Implemented |

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

### 5. README→Index Plugin (Completed ✅)

Plugin files:
- `readme.ts` - Core plugin implementation
- `mod.ts` - Entry point with exports
- `test/readme_test.ts` - Test suite
- `readme-plugin-README.md` - Documentation

Features implemented:
- Uses `site.preprocess()` approach (as per plan)
- Configurable `target` (default: `README`)
- `exclude` and `include` options (mutually exclusive)
- Preserves explicit URLs set in front matter
- Supports both pretty URLs and non-pretty URLs
- Sets `basename` to empty for clean URLs

---

## Other Customizations (Not Plugin-Worthy)

- Site hostname injection (simple preprocess)
- Conditional 404 based on `MIRROR_LOCATION` env
- Custom page types (`article`, `zettel`) for feed filtering
- Git Date (simple preprocess hook)

---

# Known Issues / Dev-Env Notes

Discovered while setting up the Cursor Cloud dev environment (Deno 2.9.3, Lume v3.0.4).

## 1. Lume serve worker swallows errors (silent hang)

**Symptom:** When `deno task serve` fails at build/serve time, it produces **no error message** — the process just hangs and never opens a port.

**Root cause:** Serve mode runs the build inside a Web Worker. In `cli/build_worker.ts` the message handler invokes the build without catching rejections:

```ts
addEventListener("message", (event) => {
  const { type } = event.data;
  if (type === "build" || type === "rebuild") {
    return build(event.data); // async fn, not awaited, no .catch
  }
  // ...
});
```

`build()` is `async`, so a throw inside it (e.g. `server.start()` → `Deno.serve` failing to bind) becomes an **unhandled promise rejection inside the worker**. `build_worker.ts` registers no `unhandledrejection`/`onerror` handler, and `watcher.start()` has already kept the event loop alive, so the worker neither crashes visibly nor serves. Net effect: a silent hang.

**Verified:** replicating the worker with a `try/catch` around `server.start()` surfaces the real error (`AddrNotAvailable` in the non-serve/bad-bind case), while the real `build_worker.ts` prints nothing.

**Suggested fixes (upstream Lume):**
- Wrap `build()` in `.catch` in the message handler, or make the handler `async` and `await` it inside a `try/catch`.
- Add a worker-level `addEventListener("unhandledrejection", …)` that logs and/or `postMessage`s the error back to the parent.
- Parent (`cli/build.ts`) could surface `worker.onerror` / `onmessageerror` to the console.

**Note:** In normal usage `deno task serve` binds `localhost:3000` and works (serve mode ignores the `location` in `_config.ts`). The `mmap.page:443` address only appears when the build runs **without** `-s` (non-serve branch of `getOptionsFromCli`), which is not how serve runs.

## 2. `deno task serve` intermittently hangs under an interactive TTY

**Symptom:** Launching `deno task serve` (or `deno task lume -s …`) inside an **interactive terminal / tmux pane** intermittently hangs during startup — stuck right after Deno's `--unstable` warning, before any build output, no server, no error.

**Observations:**
- Run **non-interactively** (output redirected to a file, or via a non-TTY runner) → builds and serves `localhost:3000` reliably.
- Run in an interactive tmux pane (a pty) → frequently hangs; observed with and without `--hostname 0.0.0.0 --port 3000`, so those flags are **not** a reliable workaround.
- Could not isolate a single deterministic trigger; behaves like a startup race that a controlling TTY makes far more likely. Likely a Lume-serve-worker × Deno 2.9.3 × TTY interaction. Issue #1 above is why it's silent rather than diagnosable.

**Workaround:** start the dev server non-interactively, e.g. redirect output to a log file / let a non-TTY runner background it, then `curl http://localhost:3000/`.

**Related sandbox caveat:** in the Cursor Cloud VM, detached processes (`nohup`/`setsid … &`) are reaped when the launching shell call ends, so a persistent server needs a session manager — but tmux panes (TTY) trigger the hang above. Practical path: run serve via a non-TTY background runner and keep the call alive long enough for startup.

**TODO:** file/track upstream Lume issues for #1 (swallowed worker errors) and #2 (TTY startup hang); minimal repro for #2 still needed.