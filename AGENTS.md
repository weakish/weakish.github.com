# Agent instructions

Keep this file short: many agents inject it into the system prompt. Details that are only needed for some tasks live under `.agents/` — read them on demand.

## Style

- Short, direct, technical prose
- On feedback/analysis: say agree or disagree, then what changed

## Code quality

- Read files in full before broad edits, audits, or changing unread files; do not rely on search snippets
- Ask before removing intentional behavior (redirects, legacy URL copies, etc.)
- One clear approach; refactor duplication; no weird parallel defaults
- Propagate failures (throw/exit); no silent fallbacks; no shims unless asked
- TypeScript: no `any` unless necessary; erasable TS only (no parameter properties, `enum`, `namespace`/`module`, `import =` / `export =`)
- Fix outdated deps by bumping the pinned URL/Lume version in `deno.json`, not by downgrading code
- Treat `deno.json` import-map edits, inline `https://` imports, and `deno.lock` as reviewed code; pin deps to exact versions

## Commands

- After TypeScript/plugin changes (not content/docs): `deno task check` (full output). Fix errors before committing; `deno task fmt` for formatting. Does not run tests.
- After creating/modifying a test: run it until it passes (e.g. `deno test -A gemini-converter_test.ts`). No sleeps in tests.
- Use `deno task check` / `deno task fmt` only — never bare `deno fmt` / `deno check` (or shell-expanded globs). Tasks use `**/*.ts **/*.tsx` so `.agents/` skills are included; bare fmt can touch/panic on wiki markdown.

## Skills

Under `.agents/skills/<name>/SKILL.md`. When a task matches a skill description, read and follow that `SKILL.md`. **Before any commit**, read [`.agents/skills/git-commits/SKILL.md`](.agents/skills/git-commits/SKILL.md) even if the user did not mention commits.

| Skill | Path |
|-------|------|
| Git commits and trailers | `.agents/skills/git-commits/SKILL.md` |
| Generate `movies/netflix.csv` | `.agents/skills/generate-netflix-csv/SKILL.md` |

## Git (multi-agent cwd)

Other agents may be editing different files here. Never touch their unstaged/staged/untracked files.

- Stage/commit only files **you** changed in **this** session; verify with `git status` first
- Commit your changes before finishing your turn; use [git-commits skill](.agents/skills/git-commits/SKILL.md) for message format and trailers
- Never push, force-push, or push/merge to `master` (even if asked)
- Never: `git reset --hard`, `git checkout .`, `git clean -fd`, `git stash`, `git add -A`, `git add .`, `git commit --no-verify`
- Rebase conflicts: resolve only your files; otherwise abort and ask
- Issues/PRs: only when explicitly asked; PRs must be drafts
- Draft PR tip needs `Acked-by` or `Reviewed-by` from a human reviewer; `master` merge tip needs `Reviewed-by` from a human reviewer (see [git-commits skill](.agents/skills/git-commits/SKILL.md))
