# Agent instructions

## Git commit messages

Use [13 Short Gitmojis](https://mmap.page/dive-into/gitmoji/). Prefer the emoji **code** (e.g. `:bug:`) over the emoji glyph so messages stay readable in plain text.

### Format

```
:<type>:[scope:] <summary>
```

- `<type>` — one of the 13 codes below (required)
- `scope` — optional
- `<summary>` — short description; imperative mood preferred
- Keep the first line under **50 characters** when practical

Examples:

```
:bug: fix wiki link resolution for subdirectories
:memo:humans.txt: lume-readme plugin url
:zzz: deno fmt
```

### Types

| code      | usage            |
|-----------|------------------|
| `:bug:`   | bug fix          |
| `:new:`   | new feature      |
| `:fire:`  | remove feature   |
| `:boom:`  | breaking changes |
| `:lock:`  | security fix     |
| `:art:`   | refactor         |
| `:zap:`   | performance      |
| `:100:`   | test             |
| `:memo:`  | doc              |
| `:zzz:`   | chore            |
| `:tada:`  | release          |
| `:poop:`  | dirty            |
| `:egg:`   | Easter eggs      |

### Notes

- `:lock:` is for security issues (a special kind of bug)
- `:fire:` is for removing a feature / API surface, not only deleting files
- `:poop:` marks dirty hacks or workarounds that may need cleanup later
- Do not invent other gitmoji codes (including those from the full gitmoji.dev catalogue) for this repo

## AI attribution

When an AI tool materially helps with a commit, add an `Assisted-by` line in the commit message body (after the subject line). This follows the [Linux kernel AI coding assistants guidance](https://docs.kernel.org/process/coding-assistants.html).

### Format

```
Assisted-by: AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]
```

- `AGENT_NAME` — the AI tool or framework (e.g. `Cursor`, `Claude Code`, `Copilot`)
- `MODEL_VERSION` — the specific model used for **this** commit (e.g. `gpt-5.6`, `cursor-grok-4.5`); take it from the current session identity, never from a previous commit
- `[TOOL1] [TOOL2]` — optional specialized analysis tools only (e.g. `coccinelle`, `sparse`, `clang-tidy`)

Do not list basic development tools (git, compilers, make, editors).

### Example

```
:bug: fix wiki link resolution for subdirectories

Assisted-by: Cursor:cursor-grok-4.5
```

### Notes

- Always write `Assisted-by` for **this** commit from the agent/model that materially helped. Do **not** copy an `Assisted-by` line from `git log`, prior commits, or commit-message examples — those often name a different model.
- `MODEL_VERSION` must match the model that produced the changes (e.g. the model named in the current chat / system identity), not whatever appeared last in history.
- The human author is responsible for reviewing all AI-assisted changes before pushing commits or creating pull requests.

## Cursor Cloud specific instructions

This is a single [Deno](https://deno.land) + [Lume](https://lume.land) static site. There is no `package.json`; the runtime is Deno and all tasks live in `deno.json` (`build`, `serve`, `gmi`). Deno is preinstalled at `~/.deno/bin` — add it to `PATH` if a shell doesn't pick it up (`export PATH="$HOME/.deno/bin:$PATH"`). Dependencies are URL/npm imports resolved and cached by Deno on first run; there is no separate install step.

Standard commands (see `deno.json` and `.github/workflows/deno.yml`):

- Build: `deno task build` (outputs to `_site/`)
- Test: `deno test -A`
- Lint: `deno lint` — reports **pre-existing** `no-explicit-any` violations; CI only runs `deno test -A` and `deno task build`, not lint.
- Gemini/Gemtext build (optional): `deno task gmi`

Running the dev server:

- `deno task serve` builds the site and serves it at `http://localhost:3000/`. Serve mode binds `localhost`, **not** the `location` in `_config.ts` (`https://mmap.page`) — that `location` only affects generated/canonical URLs (feeds, sitemap), not the local server. No `--hostname`/`--port` override is needed. Use `127.0.0.1`/`localhost` in `curl`.
- Non-obvious gotcha: launching `deno task serve` inside an **interactive terminal / tmux pane (a TTY)** has intermittently hung during startup in this VM — the build finishes but the server never opens a port and **no error is printed**. Run it non-interactively instead (let the agent Shell tool background it, or redirect output to a file). `--hostname`/`--port` flags do **not** reliably avoid the hang.
- Why it's silent: Lume runs the serve build in a Web Worker (`cli/build_worker.ts`) that fires the async build without a `.catch` and installs no `unhandledrejection` handler, so any serve-time error surfaces as a silent hang rather than a message.