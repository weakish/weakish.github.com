## Abstract

```sh
cat << END
set -e
snake_case() {
  local foo=bar
  some-command --long-option "$foo"
}
END | dash
```

## Naming

We prefer `hyphen-word` over `snake_case` over `CamelCase`.
However, `dash` [only allows `_` and alnum as variable names][alnum].
Thus, `snake_case` is preferred.

[alnum]: https://github.com/mirror/busybox/blob/1_23_stable/libbb/endofname.c

## Short options

We prefer `--long` for self-documentation.

## Compatibility

Test against dash.

## Fails early

Use `set -e`.

## Local variable

Use `local` variables in function definitions when possible.
