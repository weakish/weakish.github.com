# Agent instructions

## Conversational style

- Keep answers short and concise
- Technical prose only, be direct
- When responding to user feedback or an analysis, explicitly say whether you agree or disagree before saying what you changed.

## Code quality

### General

- Read files in full before wide-ranging changes, before editing files you have not fully inspected, and when asked to investigate or audit. Do not rely on search snippets for broad changes.
- Always ask before removing functionality or code that appears intentional (including redirects and legacy URL copies).
- Prefer one clear approach; avoid weird defaults and parallel ways of doing the same thing; refactor when duplication appears.
- If something fails, propagate the error, throw, or exit. Do not swallow failures with silent fallbacks.
- Do not keep old methods or shims for "compatibility" unless the user asks.

### Deno / TypeScript

- No `any` unless absolutely necessary.
- Never remove or downgrade code to fix type errors from outdated deps; bump the URL import or Lume version in `deno.json` instead.
- Prefer erasable TypeScript: no parameter properties, `enum`, `namespace`/`module`, `import =`, `export =`, or other constructs needing emit transforms. Use explicit fields with constructor assignments.
- Treat `deno.json` import-map edits, inline `https://` import changes, and `deno.lock` updates as reviewed code. Pin direct external deps to exact versions (tags or full URLs, not ranges).

## Commands

- After TypeScript/plugin changes (not content/docs): `deno task check` (full output, no tail). Fix all errors before committing; run `deno task fmt` to fix formatting. Does not run tests.
- If you create or modify a test file, run it and iterate until it passes, e.g. `deno test -A gemini-converter_test.ts`.
- Never add sleeps to tests.

### Deno tasks

- `deno task check` — verify only (`deno fmt --check` then `deno check`); does not modify files.
- `deno task fmt` — apply formatting fixes.
- Both use `**/*.ts **/*.tsx` globs so `.agents/` skill scripts are included; bare `deno fmt` without globs skips dot-directories and can touch or panic on wiki markdown.
- Do not run bare `deno fmt` / `deno check` (or shell-expanded globs); use `deno task fmt` / `deno task check` only.

## Agent skills

Project skills live under `.agents/skills/`. Each skill is a directory with a `SKILL.md` file (YAML frontmatter + workflow) and optional `scripts/`.

When a task matches a skill's description, read that skill's `SKILL.md` and follow it. Current skills:

| Skill | Path |
|-------|------|
| Generate `movies/netflix.csv` | `.agents/skills/generate-netflix-csv/SKILL.md` |

## Git

Multiple agent sessions may be running in this cwd at the same time, each modifying different files. Git operations that touch unstaged, staged, or untracked files outside your own changes will stomp on other sessions' work. Follow these rules:

### Committing

- Only commit and stage files YOU changed in THIS session.
- Before committing, run `git status` and verify you are only staging your files.
- Message format: see [Git commit messages](#git-commit-messages) and [AI attribution](#ai-attribution).
- Commit your changes before finishing your turn.
- Never push to remote unless the user explicitly asks you to.
- Never force push to remote even if the user explicitly asks you to.
- Never push to master even if the user explicitly asks you to.

### Never run

These destroy other agents' work or bypass checks:

- `git reset --hard`, `git checkout .`, `git clean -fd`, `git stash`, `git add -A`, `git add .`, `git commit --no-verify`

### Rebase conflicts

- Resolve conflicts only in files you modified.
- If a conflict is in a file you did not modify, abort and ask the user.
- Never force push.

### Issues and Pull Requests

- Never create an issue unless the user explicitly asks you to.
- Never create a pull request unless the user explicitly asks you to. In that case, always create a draft PR.

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

### Body

- After the subject, add 1–3 lines when motivation is not obvious from the diff.
- Explain the problem or trigger, not a file list.
- Do not duplicate [AGENTS.md](#commands); for toolchain changes, a one-line pointer is enough (e.g. "See AGENTS.md Commands").
- Put `Assisted-by` after the body (see [AI attribution](#ai-attribution)).

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