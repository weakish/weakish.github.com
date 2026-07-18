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
- Message format: see [Git commit messages](#git-commit-messages) and [Commit trailers](#commit-trailers).
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
- Before opening a draft PR, the branch tip must carry `Acked-by` or `Reviewed-by` (see [Commit trailers](#commit-trailers)). Add that trailer only when the user has lightly or fully reviewed and asks you to open the PR (or explicitly asks to add the trailer).
- Never merge to `master`. The human merges; the tip that lands on `master` must carry `Reviewed-by`.

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
- Put trailers after the body (see [Commit trailers](#commit-trailers)).

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

## Commit trailers

This repo keeps per-commit agent history (different models on feature branches) and uses human `Author` for `git blame`. Review depth is recorded with Linux-style trailers whose **who** is always the human author; meanings below are this repo’s contract (milestone gates), not a copy of every kernel trailer rule.

Trailer order after the subject/body:

1. `Assisted-by` (when an agent helped)
2. `Acked-by` / `Reviewed-by` (human review markers, when required)

### Author

- Git `Author` is always the human. Never set the agent as author (breaks blame and ownership).
- The human is responsible for what lands on `master`.

### Assisted-by

Required on every commit an AI agent materially helped produce. Follows the [Linux kernel AI coding assistants guidance](https://docs.kernel.org/process/coding-assistants.html).

```
Assisted-by: AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]
```

- `AGENT_NAME` — the AI tool or framework (e.g. `Cursor`, `Claude Code`, `Copilot`)
- `MODEL_VERSION` — the model for **this** commit (e.g. `gpt-5.6`, `cursor-grok-4.5`); take it from the current session identity, never from a previous commit
- `[TOOL1] [TOOL2]` — optional specialized analysis tools only (e.g. `coccinelle`, `sparse`, `clang-tidy`)

Do not list basic development tools (git, compilers, make, editors).

```
:bug: fix wiki link resolution for subdirectories

Assisted-by: Cursor:cursor-grok-4.5
```

- Always write `Assisted-by` for **this** commit from the agent/model that helped. Do **not** copy an `Assisted-by` line from `git log`, prior commits, or examples — those often name a different model.
- Intermediate commits usually carry only `Assisted-by` (no bandwidth to review every step). When you **have** reviewed an intermediate commit, it may also carry `Acked-by` or `Reviewed-by` for that commit.

### Acked-by (light review)

- Means: human lightly reviewed **that commit**; LGTM enough to share (draft PR when on the branch tip).
- Identity: same human as git `Author` (`Acked-by: Name <email>`).
- Required on the branch tip **before opening a draft PR** (unless the tip already has `Reviewed-by`). May also appear on earlier commits you lightly reviewed.
- Agents must not add `Acked-by` unless the user has done that light check and asks for the trailer or for a draft PR.

### Reviewed-by (full review)

- Means: human fully reviewed **that commit**; same *role* as Linux kernel `Reviewed-by` (ready to land when on the merge tip).
- Identity: same human as git `Author`.
- Required on the tip that merges into `master` (e.g. squash tip). A draft PR tip may use `Reviewed-by` instead of `Acked-by` if a full review already happened. May also appear on earlier commits you fully reviewed.
- Agents must not add `Reviewed-by` unless the user has fully reviewed and asks for the trailer or to prepare the merge tip.

### Example (draft-PR tip after light review)

```
:zzz:deno.json: add fmt task, drop includes

Assisted-by: Cursor:cursor-grok-4.5
Acked-by: weakish <weakish@gmail.com>
```

### Notes

- Do not invent other review trailers for light-vs-full depth.
- Scripts may treat `Acked-by` / `Reviewed-by` on a commit as marking reviewed ranges from that commit forward (or back to the previous review marker); commits with only `Assisted-by` are unreviewed steps.
