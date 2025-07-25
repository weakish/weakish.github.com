# An Opinionated Guide to ESLint

[ESLint] is a powerful and versatile tool.
I myself only use eslint for problems coming from JavaScript design.
Thus, I can have a short rule list.

[eslint]: https://eslint.org/

## No Formatting Rule

Use [deno fmt] or [prettier] instead.

I use `deno fmt` or prettier with its default options,
without any configuration.

[deno fmt]: https://deno.land/manual/tools/formatter
[prettier]: https://prettier.io/

`deno fmt` is faster, while prettier supports more formats.

Prettier also helps on some non-formatting lint rules.
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

## TypeScript Can Detect Lots of Errors

TypeScript can detect a lot of problems, and it is usually faster.

For example, the `array-callback-return` rule is unnecessary,
because if I accidentally forget to write `return` statement in array mapping function,
it tends to trigger a type error.
`eqeqeq` is another example of an unnecessary rule,
since TypeScript complains when you are comparing two values of different types.

TypeScript also has other helpful checks like `noFallthroughCasesInSwitch`.

So just extend one of strictest [tsconfig base].

[tsconfig base]: https://github.com/tsconfig/bases

## Only Include Obvious Rules

Do not include rules such as `no-new-object` and `no-nested-ternary`,
which are merely personal choice of programming style.

So here is the five ESLint rules I use:

```js
{
"parser": "@typescript-eslint/parser",
"plugins": ["@typescript-eslint"],
"rules": {
    "prefer-arrow-callback": "error", // avoid the evil `this`
    "no-multi-assign": "error", // no `a = b = c = 1`
    "no-var": "error", // use `const` and `let` instead of `var`
    "prefer-const": "error", // use `const` when there is no reassignment
    "no-param-reassign": "error", // use nonreassignable function parameters
}
}
```

Note that the default ESLint configuration file generated via `@eslint/config`
includes a lot of recommended rules (`extends`).
I do not use `npm init @eslint/config` and add dependencies by hand:

```sh
ni -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

## Alternatives

[Biome] and [quick-lint-ls] are faster alternatives to ESLint.
Biome currently only has [partial support for Svelte and Astro][biome-docs],
and quick-lint-ls before 3.0 does not support TypeScript.
Therefore, I still use ESLint.
However, since [quick-lint-ls 3.0 introduces TypeScript support][quick-lint-ts],
I plan to try it in future.
Also, Deno 2.0 introduces compatibility with Node.js and npm, so I also plan to try `deno lint` on non Deno projects.

[Biome]: https://biomejs.dev/
[biome-docs]: https://biomejs.dev/internals/language-support/
[quick-lint-ls]: https://quick-lint-js.com/
[quick-lint-ts]: https://quick-lint-js.com/blog/version-3.0/
