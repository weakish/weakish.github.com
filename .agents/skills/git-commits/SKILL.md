---
name: git-commits
description: >-
  Repo commit message and trailer contract: 13 Short Gitmojis subjects,
  Assisted-by, Acked-by, Reviewed-by gates for draft PRs and master. Use when
  committing, writing a commit message, adding review trailers, or opening a
  draft PR.
---

# Git commits and trailers

Everyday agent rules live in [AGENTS.md](../../../AGENTS.md). **Read this skill before every commit** (AGENTS.md requires it); also when opening a draft PR.

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

- After the subject, add 1–3 lines when motivation is not obvious from the diff.
- Explain the problem or trigger, not a file list.
- For toolchain changes, a one-line pointer is enough (e.g. "See AGENTS.md Commands").
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

This repo keeps per-commit agent history (different models on feature branches) and uses human `Author` for `git blame`. Review depth is recorded with Linux-style trailers; meanings below are this repo’s contract (milestone gates), not a copy of every kernel trailer rule.

The gates exist for quality assurance: `master` auto-deploys to production (protect end users), and a draft PR whose code no human has at least lightly reviewed is likely an AI-slop PR that wastes other developers' time.

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
- Intermediate commits usually carry only `Assisted-by` (the user may not have bandwidth to review every step). When a human **has** reviewed an intermediate commit, it may also carry `Acked-by` or `Reviewed-by` for that commit.

### Acked-by (light review)

- Means: a human lightly reviewed **that commit**; LGTM enough to share (draft PR when on the branch tip).
- Identity: any human who did the light review (`Acked-by: Name <email>`) — the commit author, the agent's user, or another developer. A self-ack (reviewer = `Author`) is this repo's intentional review-depth attribution, not invalid trailer usage; do not flag it when reviewing commits or polishing messages.
- Required on the branch tip **before opening a draft PR** (unless the tip already has `Reviewed-by`). May also appear on earlier commits a human lightly reviewed.
- Agents must not add `Acked-by` on their own judgment; add it only when the user confirms a human did that light check (and names the reviewer) via asking for the trailer or a draft PR.
- Exception: when the user says LGTM (or an equivalent explicit approval) while asking for a commit, treat it as light-review confirmation — add `Acked-by` naming the user without asking, then tell the user the trailer was added. Do not infer acks from weaker signals ("sure, go ahead").

### Reviewed-by (full review)

- Means: a human fully reviewed **that commit**; same *role* as Linux kernel `Reviewed-by` (ready to land when on the merge tip).
- Identity: any human who did the full review; may be the commit author (see the `Acked-by` note on self-review).
- Required on the tip that merges into `master` (e.g. squash tip). A draft PR tip may use `Reviewed-by` instead of `Acked-by` if a full review already happened. May also appear on earlier commits a human fully reviewed.
- Agents must not add `Reviewed-by` on their own judgment; add it only when the user confirms a human fully reviewed (and names the reviewer) via asking for the trailer or the merge tip.

### Example (lightly reviewed commit)

```
:memo:netflix-csv: document Y10K and RFC 3339 dates

Four-digit year/date validation is RFC 3339 profile, not full ISO 8601.

Assisted-by: Cursor:composer-2.5
Acked-by: weakish <weakish@gmail.com>
```

### Notes

- Do not invent other review trailers for light-vs-full depth.
- A review trailer certifies **that commit only**. Range aggregation is script-defined (e.g. a marker covers commits since the previous marker); commits with only `Assisted-by` are unreviewed steps.
