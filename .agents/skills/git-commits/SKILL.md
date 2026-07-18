---
name: git-commits
description: >-
  Repo commit message and trailer contract: 13 Short Gitmojis subjects;
  Assisted-by; optional Acked-by / Reviewed-by to record human review;
  Reported-by for user-reported bugs; Suggested-by for human
  ideas and approach.
  Use when committing, writing a commit message, or adding review trailers.
---

# Git commits and trailers

Everyday agent rules live in [AGENTS.md](../../../AGENTS.md). **Read this skill before every commit** (AGENTS.md requires it).

## Commit messages

Use [13 Short Gitmojis](https://mmap.page/dive-into/gitmoji/). Prefer the emoji **code** (e.g. `:bug:`) over the glyph.

### Format

```
:<type>:[scope:] <summary>
```

- `<type>` — one of the 13 codes below (required)
- `scope` — optional
- `<summary>` — short description; imperative mood preferred
- Keep the first line under **50 characters** when practical

### Body

- After the subject, add a short body when motivation is not obvious from the diff.
- Explain the problem or trigger, not a file list.
- Put trailers after the body.

Examples:

```
:bug: fix wiki link resolution for subdirectories
:memo:humans.txt: lume-readme plugin url
:zzz: deno fmt
```

### Types

| code | usage |
|-----------|------------------|
| `:bug:` | bug fix |
| `:new:` | new feature |
| `:fire:` | remove feature |
| `:boom:` | breaking changes |
| `:lock:` | security fix |
| `:art:` | refactor |
| `:zap:` | performance |
| `:100:` | test |
| `:memo:` | doc |
| `:zzz:` | chore |
| `:tada:` | release |
| `:poop:` | dirty |
| `:egg:` | Easter eggs |

### Notes

- `:lock:` is for security issues (a special kind of bug)
- `:fire:` is for removing a feature / API surface, not only deleting files
- `:poop:` marks dirty hacks or workarounds that may need cleanup later
- Do not invent other gitmoji codes (including those from the full gitmoji.dev catalogue) for this repo

## Commit trailers

Trailers record agent help (`Assisted-by` per commit when an agent helped; squash before merge if you prefer). Git `Author` is always the human, for `git blame`. Review depth may be recorded with Linux-style trailers; meanings below are this repo’s contract, not a copy of every kernel trailer rule.

`Acked-by` / `Reviewed-by` are **optional** markers that record which commits a human reviewed.

Trailer order after the subject/body:

1. `Reported-by` (when the user reported a valid bug this commit fixes)
2. `Suggested-by` (when a human suggested the idea or approach this commit implements)
3. `Assisted-by` (when an agent helped)
4. `Acked-by` / `Reviewed-by` (optional human review markers)

`Reported-by`, `Suggested-by`, `Acked-by`, and `Reviewed-by` name **humans** only — never an agent. Agent help (including when the user asks an agent to review code) belongs in `Assisted-by`.

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
- Intermediate commits usually carry only `Assisted-by` (the user may not have bandwidth to review every step). When a human **has** reviewed a commit, it may also carry `Acked-by` or `Reviewed-by` for that commit.

### Reported-by

- On a `:bug:` fix for a bug the **user** reported and you confirmed valid, add `Reported-by: Name <email>`.
- Use the reporter’s usual git identity (from `Author`, prior commits, or what they give you in session).
- Do **not** add it when you found the bug without a user report, or when you disagreed and did not fix it.

```
:bug:netflix-csv: skip blank ids in duplicate check

Blank netflix values mapped to "" and falsely triggered
duplicate Netflix title id errors.

Reported-by: weakish <weakish@gmail.com>
Assisted-by: Cursor:composer-2.5
```

### Suggested-by

- When a **human** suggested the idea or approach this commit implements, add `Suggested-by: Name <email>`.
- Use their usual git identity (from `Author`, prior commits, or what they give you in session).
- Covers design direction, not only bug reports (e.g. “return `string[]`”, “reject blank titles”). Use `Reported-by` for a confirmed bug report; both may appear when a report also drove the approach.
- Do **not** add it for generic “please fix / please implement” without a substantive suggestion, or when you invented the approach alone.

```
:art:netflix-csv: validate helpers return errors

Drop shared mutable errors[]; concatenate returned
string[] slices in validate().

Suggested-by: weakish <weakish@gmail.com>
Assisted-by: Cursor:cursor-grok-4.5
```

### Acked-by (light review)

- Means: a human lightly reviewed **that commit**.
- Optional — use when you want to record light review.
- Identity: any human who did the light review (`Acked-by: Name <email>`) — the commit author, the agent's user, or another developer. A self-ack (reviewer = `Author`) is this repo's intentional review-depth attribution, not invalid trailer usage; do not flag it when reviewing commits or polishing messages.
- Agents must not add `Acked-by` on their own judgment; add it only when the user confirms a human did that light check (and names the reviewer), or asks for the trailer.
- Exception: when the user says LGTM (or an equivalent explicit approval) while asking for a commit, treat it as light-review confirmation — add `Acked-by` naming the user without asking, then tell the user the trailer was added. Do not infer acks from weaker signals ("sure, go ahead").

### Reviewed-by (full review)

- Means: a human fully reviewed **that commit**; same *role* as Linux kernel `Reviewed-by`.
- Optional — use when you want to record full review.
- Identity: any human who did the full review; may be the commit author (see the `Acked-by` note on self-review).
- Agents must not add `Reviewed-by` on their own judgment; add it only when the user confirms a human fully reviewed (and names the reviewer), or asks for the trailer.

### Example (lightly reviewed commit)

```
:memo:netflix-csv: document Y10K and RFC 3339 dates

Four-digit year/date validation is RFC 3339 profile, not full ISO 8601.

Assisted-by: Cursor:composer-2.5
Acked-by: weakish <weakish@gmail.com>
```

### Notes

- Do not invent other review trailers for light-vs-full depth.
- A review trailer certifies **that commit only**.
