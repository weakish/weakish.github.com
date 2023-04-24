Code Formatting
===============

Formatting style does not affect AST and thus is unlikely to affect readability
of code.
If they do, it can be automatically adjusted via tools.

Use the official formatter if the language tool chain includes it, for example:

- `go fmt` for Go
- `deno fmt` for Deno
- `rustfmt` for Rust

Since different contributors may have different formatting preferences configured in their editor/IDE,
with different rules or formatters,
formatting should be configured at the project level,
enforced by commit hook automatically.
This is the best practice.

If formatting is not configured at the project level,
it is a good idea to only commit in non-whitespace changes,
to avoid formatting changes pollute repository history.
For example, with Git:

```sh
git diff -w > changes
# review changes, run tests, etc.
git reset --hard
patch < changes
# stage and commit
```

If the project does not configure auto formatting,
and you need to review someone else's commits with a lot of formatting changes,
you can use `git diff -w` to ignore whitespace,
or use similar options in other tools,
such as "Hide whitespace changes" in GitHub's "Diff settings".


