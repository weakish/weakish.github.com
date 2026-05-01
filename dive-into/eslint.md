# An Opinionated Guide to ESLint/Oxlint

[ESLint] is a powerful and versatile tool.
I myself only used ESLint for problems coming from JavaScript design and kept the rule list short.
Later I switched to [Oxlint], the high-performance successor of ESLint.

[ESLint]: https://eslint.org/
[Oxlint]: https://oxc.rs/docs/guide/usage/linter.html

## No Formatting Rule

[Oxfmt], [Biome], [deno fmt] (dprint), or [prettier] can be used without any configuration for code formatting.
No need to specify ESLint rules for code formatting. 

[Oxfmt]: https://oxc.rs/docs/guide/usage/formatter.html
[Biome]: https://biomejs.dev/
[deno fmt]: https://deno.land/manual/tools/formatter
[prettier]: https://prettier.io/

Oxfmt, Biome, and dprint are faster, while prettier supports more formats.
And any of them is much faster than ESLint.

Formatters can also help on some non-formatting lint rules.
For example, eslint's `curly` rule helps to avoid misleading code:

```js
if (condition)
    do_something();
    do_something_else();
```

However, prettier will format the above code as below to avoid the above issue:

```js
if (condition) do_something();
do_something_else();
```

In the code sample above, I use `snake_case` for function names.
The Python community favors `snake_case`:

> Function names should be lowercase,
> with words separated by underscores as necessary to improve readability.
>
> Variable names follow the same convention as function names.
>
> mixedCase is allowed only in contexts where that’s already the prevailing style
> (e.g. threading.py), to retain backwards compatibility.
>
> -- [PEP 8](https://peps.python.org/pep-0008/#function-and-variable-names)

However, mixedCase is prevailing in the JavaScript/TypeScript community.
Thus, I use mixedCase for exported names.

Among those formatters, I use Oxfmt since I already used Oxlint for linting.

## TypeScript Can Detect Lots of Errors

TypeScript can detect a lot of problems, usually faster than ESLint.

For example, the `array-callback-return` rule of ESLint is unnecessary,
because if I accidentally forget to write `return` statement in array mapping function,
it tends to trigger a type error.
`eqeqeq` is another example of an unnecessary rule,
since TypeScript complains when you are comparing two values of different types.

TypeScript also has other helpful checks like `noFallthroughCasesInSwitch` which can be enabled via `tsconfig.json`.

## Only Include Obvious Rules

Do not include rules such as `no-new-object` and `no-nested-ternary`,
which are merely personal choice of programming style.

The four Oxlint rules I use:

```jsonc
// .oxlintrc.json
{
  "rules": {
    "no-multi-assign": "error", // no `a = b = c = 1`
    "no-var": "error", // use `const` and `let` instead of `var`
    "prefer-const": "error", // use `const` when there is no reassignment
    "no-param-reassign": "error" // use nonreassignable function parameters
  }
}
```

When I was using ESLint, I also used an additional rule `prefer-arrow-callback` to avoid the evil `this` in JavaScript.
Unfortunately, Oxlint (up to 1.62.0) does not support this rule yet.

Oxlint supports TypeScript out of the box, so I do not need to add `"parser": "@typescript-eslint/parser"` as I did in ESLint.
Also, Oxlint still uses the legacy configuration format of ESLint, which I prefer over the new flat configuration format of recent versions of ESLint.

## Alternatives

As mentioned above, I only use a minimal set of rules in ESLint/Oxlint.
If you prefer to use linter to catch common programming errors, you can consider Biome or [quick-lint-ls], which are [faster][quick-lint-js-blog] than ESLint and have built-in support for TypeScript.

[quick-lint-ls]: https://quick-lint-js.com/
[quick-lint-js-blog]: https://quick-lint-js.com/blog/why-another-javascript-linter/

