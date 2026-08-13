---
name: review
description: >-
  Review one git commit against repo conventions; letter-label tree findings so
  the user can reply `B,d,e`, `b-d`, `y`/`c`, `h`/`help`, or `all`; fix
  selected tree issues (including nits), report message/trailer hygiene only,
  then land tree fixes as a new follow-up commit. Triggers: `r` or
  `r <sha-or-ref>` (report, then wait for letter selection); `fix b,d,e` /
  `b-d` / `yes`/`y`/`continue`/`c` / `h`/`help` (apply or explain from last
  report); `review-and-fix` / polish the tip (fix all in one shot); bare
  SHA/ref; `review <sha-or-ref>`. Do not use for PR/issue creation, history
  rewrite, or show/explain/log of a commit without the review-and-fix loop.
---

# Review one commit, then fix

Read [git-commits](../git-commits/SKILL.md) before any commit this skill creates.

## Triggers

Any of these invoke this skill:

| Input | Target / behavior |
|-------|-------------------|
| `r` | `HEAD` — report with letter labels; **wait** for selection (do not fix yet) |
| `r <sha-or-ref>` | that commit — same report-only flow (`r HEAD` ok) |
| message that is **only** a SHA / short SHA / ref | that commit — report only |
| `review <sha-or-ref>`, run the review skill | named or `HEAD` — report only |
| `review-and-fix`, polish the tip | named or `HEAD` — report, then fix **all** tree items in the same turn (upper and lower marks, same as `all`) |
| `yes`, `y`, `continue`, `c` (`fix` prefix optional) | fix **recommended** items from the last lettered report (see [Select items to fix](#select-items-to-fix)) |
| `all`, `fix all` | fix every tree item from the last lettered report |
| `fix b,d,e`, `b,d,e`, `b-d`, `fix b-d`, … | fix selected labels from the last lettered report |
| `h`, `help`, `h B,d`, `help <labels>` | explain findings from the last lettered report (no fixes) |
| `none`, `skip` | no tree edits, no fix commit |

Do **not** treat show / explain / `git log` / questions like “what changed in this commit” as this skill.

## Goal

1. Review **one** commit (default: `HEAD`)
2. Report tree findings with **letter labels** (`B`/`b`, `D`/`d`, …; or letter+number when they do not fit — see below); report message hygiene only (no letters)
3. Fix the user’s **selected** tree items. `all` / `fix all` and `review-and-fix` / polish the tip fix **every** finding (upper and lower marks); `yes` / `y` / `continue` / `c` fix **recommended** findings only (uppercase marks); `h` / `help` explain more detail (no fixes) — bare `h` / `help` covers every finding, scoped `h <labels>` / `help <labels>` covers listed labels only. Include minor nits in whatever they select.
4. Land tree fixes as a **new** commit — never amend unless the user explicitly asks

If there are no tree findings, say so and stop (no empty commit). Still report message hygiene when present.

On `r` / bare SHA / `review <sha-or-ref>`, stop after the report — do not fix yet, and do **not** add a separate end-of-turn prompt line (the letter labels in the report are enough). On `review-and-fix` / polish the tip, fix every tree item (upper and lower marks) in the same turn without waiting.

## Select the commit

- Resolve the target from [Triggers](#triggers); default `HEAD` when unset
- If the user names a subject / “the cursor-bench commit”, resolve to that one commit
- Scope: **that commit only** (`git show <sha>` / `git diff <sha>^!` to see which paths changed), not the whole branch
- Read every changed file in full before judging the diff; do not rely on hunks or search snippets (see [AGENTS.md](../../../AGENTS.md))
- Do not expand scope to unrelated dirty files from other agents (see [AGENTS.md](../../../AGENTS.md) multi-agent rules)

## Review

Check the commit against [AGENTS.md](../../../AGENTS.md) and surrounding code. Look for:

- Incorrect behavior, edge cases, broken failure propagation (silent fallbacks, swallowed errors)
- Intentional behavior removed or “cleaned up” without asking (redirects, legacy URL copies, platform workarounds)
- Style drift: duplication, parallel defaults, comments that restate the code, vague names
- TypeScript / Deno norms in [AGENTS.md](../../../AGENTS.md) (no unnecessary `any`; erasable TS only; pin deps in `deno.json` / import maps / `deno.lock`; prefer `deno task check` / `deno task fmt`)
- Commit message / trailers vs [git-commits](../git-commits/SKILL.md) (wrong gitmoji, agent `Co-authored-by`, missing `Assisted-by` when the diff was agent-helped) — message hygiene, report only

Severity is for the summary only — **report tree nits too**, not only blockers. Mark case encodes the agent’s recommendation (see below).

Message or trailer problems on the **reviewed** commit itself (wrong gitmoji, bad `Assisted-by`, etc.) are **report-only**. They need a history rewrite (human decides; see [git-commits](../git-commits/SKILL.md)), not a tree follow-up. Do not amend or rewrite the reviewed commit’s message for hygiene findings as part of this skill.

### Out of scope

- Do not push, force-push, or rewrite history (including message-only rewrites for hygiene findings)
- Do not add `Acked-by` / `Reviewed-by` (human-only; see [git-commits](../git-commits/SKILL.md))
- Do not invent content for other agents’ dirty/untracked files

## Report, then fix

Before editing, give a short review (agree/disagree style not required here):

```
Commit: <short-sha> <subject>

Tree findings:
- B. <finding>
- d. <finding>
- …

(or when letter+number — e.g. `- B1. <finding>`, `- b2. <finding>`, `- D1. <finding>`)

(or: No tree findings.)

Message hygiene (report only; human decides on rewrite):
- <finding>
- …

(or: No message hygiene findings.)
```

**Letter labels:** assign labels to tree findings only; keep the mapping stable for the session. Message-hygiene bullets are not lettered (not tree-fixable here).

**Mark case (report only; selection ignores case):**
- **Uppercase** (`B`, `D1`, …): agent **recommends** a fix
- **Lowercase** (`b`, `d1`, …): fine to **keep as is** (still selectable if the user wants it fixed)

**Reserved letters** (never use as single-letter labels or as letter+number category letters): `a`, `c`, `f`, `h`, `n`, `r`, `s`, `y` — collide with `all`, `yes`/`y`/`continue`/`c`, `h`/`help`, `skip`/`none`, review (`r`), fix-ish replies, and similar one-letter inputs. Assign from the remaining alphabet in order: `b`, `d`, `e`, `g`, `i`, `j`, `k`, `l`, `m`, `o`, `p`, `q`, `t`, `u`, `v`, `w`, `x`, `z` (18 letters). Write each mark upper or lower for recommendation; letter **identity** for ordering, spans, and categories ignores case. Selection examples use assignable letters only (not reserved).

Use **one** label scheme per report — never mix single-letter and letter+number labels in the same report:

| Count | Scheme | Examples |
|-------|--------|----------|
| ≤ 18 | single letter (non-reserved; case = recommendation) | the 18-letter list above, in order (`B`/`b`, `D`/`d`, `E`/`e`, …) |
| > 18 | letter + number | `B1`, `b2`, `D1`, `d2`, `D3`, … |

When a report has more than 18 tree findings, label **all** of them in letter+number form (do not use single letters for the first 18 and switch partway). **Categorize when possible:** the letter identity (case-insensitive) groups related findings (non-reserved only); numbers are sequential within that category (`B1`, `b2`, … then `D1`, …). When findings do not group naturally (e.g. 19 unrelated items), a single category is fine (`B1` … `b19`).

Use each section’s `(or: …)` line instead of bullets when that section is empty.

When the user has chosen items to fix (see [Select items to fix](#select-items-to-fix)), apply only those **tree** fixes in the working tree. Prefer the smallest change that addresses the finding. If a finding needs a product/design choice, ask — do not guess. Do not rewrite the reviewed commit’s message.

### Select items to fix

Parse the user’s selection from the latest lettered report in this session. Syntax depends on which label scheme that report used.

**Single-letter reports** (≤ 18 findings):

| Form | Meaning |
|------|---------|
| `b`, `fix d` | one item (case-insensitive) |
| `b,d,e` | items b, d, and e |
| `fix b,d,e` | same (`fix` prefix optional) |
| `b-d` | letter hyphen span (single-letter labels; see Both schemes) |
| `b,d-g,i` | mix of singles and ranges |

**Letter+number reports** (> 18 findings):

| Form | Meaning |
|------|---------|
| `b1`, `fix d2` | one item (case-insensitive) |
| `b1,b3,d2` | listed items |
| `b1-4` | same-prefix numeric range (see Both schemes) |
| `b` | every label with prefix `b`/`B` (b1, B2, …) |
| `b-e` | letter hyphen span (category prefixes; see Both schemes) |

Cross-prefix numbered ranges (e.g. `d3-g4`) are **not** supported — ask the user to confirm before guessing.

**Both schemes:**

- Selection matching is **case-insensitive** (`B,d` = `b,D` = findings marked `B`/`b` and `D`/`d`). Mark case in the report still encodes recommendation.
- Ignore spaces around commas and hyphens.
- **Parse order:** keyword forms first (`y`, `fix y`, `help`, `h B,d`, `all`, …). Reserved-letter **pause** (below) applies only when a reserved letter is a **label** token in a list or scoped argument (e.g. `b,h,d`, `help h`), not when it is consumed as part of a keyword form.
- No prior lettered report in session: say so; do not invent findings.
- `yes`, `y`, `continue`, `c` (`fix` prefix optional): every **recommended** tree finding (uppercase marks only). If none are recommended, say so and do not fix.
- `h`, `help` (message is **only** this word): explain **more detail** on **every** tree finding (upper and lower marks) — do **not** fix; then wait for selection as after the original report. If there are no tree findings, say so.
- `h <labels>`, `help <labels>`: explain more detail on the listed labels / spans only (same selection syntax as fix forms, case-insensitive; upper or lower marks). Span/range pause rules apply. Unknown labels: say which, explain the rest. Do **not** fix; then wait for selection.
- `all`, `fix all`: every tree finding (upper and lower).
- `none`, `skip`: no tree edits, no fix commit.
- Empty message (nothing else): ask which labels to fix (briefly; no end-of-turn prompt line).
- Other instructions, no letter selection: implicit `none`/`skip` for review fixes.
- **Letter hyphen spans** (`b-d`, `b-e`) are **inclusive**. Skip **reserved** letters inside the span; match labels or prefixes **assigned in this report** (letter identity, ignoring case) — e.g. single-letter `b-d` → `b`/`B` and `d`/`D` (not `c`); letter+number `b-e` → prefixes `b`/`B`, `d`/`D`, `e`/`E`. If a non-reserved letter in the span was never assigned in this report, **pause** — say which and ask for confirmation; do not apply any part of the selection until the user replies.
- **Same-prefix numeric ranges** (`b1-4`) are **inclusive** over sequential numbers within that prefix (case-insensitive). Labeling assigns `1`, `2`, … without gaps for that letter identity, so a missing number inside the range should not occur when the report followed this skill. If the range runs past the highest assigned number for that prefix (e.g. `b1-4` when only `b1`–`B3` exist), **pause** — say which and ask for confirmation; do not apply any part of the selection until the user replies.
- Unknown or out-of-range labels (not part of a letter span or numeric range token): say which, continue with the rest.
- A **reserved** letter used as a **label** token in a list or scoped argument (e.g. `b,h,d`, `help h`) is **invalid** — **pause**, say which, and ask for confirmation; do not apply or explain until the user replies.

When fixes touch TypeScript / plugin code (not content/docs alone), run `deno task check` before committing; run `deno task fmt` when formatting is needed. After creating or modifying a test, run that test until it passes. Never use bare `deno check` / `deno fmt`.

## Commit the fixes

New commit only. Stage **only** files this review-fix changed.

- Message: pick gitmoji from the **primary** nature of the fixes (`:bug:` for real bugs, `:art:` for refactor/clarity, `:memo:` for docs, `:zzz:` for chore). Subject should say it is review follow-up when that helps (e.g. `:art:cursor: review follow-up: tighten SVG escape`).
- Body: what landed; optional one line that it follows review of `<short-sha>`.
- Trailers: `Assisted-by` for this session’s model (required when this session produced the fix diff). Do **not** copy review trailers onto the fix commit.
- Report the new commit hash when done.

### Amend (opt-in only)

Amend folds **tree** fixes into the reviewed tip — not message hygiene (still report-only above). Use **only** if the user explicitly asks **and** all of:

- Tip is the reviewed commit
- Not pushed (or user accepts rewrite; still never force-push to `master`)
- Tip has no `Acked-by` / `Reviewed-by` yet
- Working tree changes belong in that same story

Otherwise keep the new-commit path and say why amend was skipped.

## Done

- Summarize what changed (brief)
- Hashes: reviewed commit → fix commit (or “clean, no fix commit”)
