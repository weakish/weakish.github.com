# Agent instructions

## Conversational style

- Keep answers short and concise
- Technical prose only, be direct
- When responding to user feedback or an analysis, explicitly say whether you agree or disagree before saying what you changed.

## Code quality

### General

- Read files in full before wide-ranging changes, before editing files you have not fully inspected, and when asked to investigate or audit. Do not rely on search snippets for broad changes.
- Always ask before removing functionality or code that appears intentional (including redirects and legacy URL copies).

### Deno / TypeScript

- No `any` unless absolutely necessary.
- Never remove or downgrade code to fix type errors from outdated deps; bump the URL import or Lume version in `deno.json` instead.
- Prefer erasable TypeScript: no parameter properties, `enum`, `namespace`/`module`, `import =`, `export =`, or other constructs needing emit transforms. Use explicit fields with constructor assignments.

## Agent skills

Project skills live under `.agents/skills/`. Each skill is a directory with a `SKILL.md` file (YAML frontmatter + workflow) and optional `scripts/`.

When a task matches a skill's description, read that skill's `SKILL.md` and follow it. Current skills:

| Skill | Path |
|-------|------|
| Generate `movies/netflix.csv` | `.agents/skills/generate-netflix-csv/SKILL.md` |

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