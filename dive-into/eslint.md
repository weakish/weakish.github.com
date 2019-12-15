# An Optioned Guide to ESLint

[eslint] is a powerful and versatile tool.
I myself only use eslint for problems coming from JavaScript design.
Thus I can have a short rule list:

[eslint]: https://eslint.org/

## No Formatting Rule

Use [prettier] instead.

I use prettier with its default options,
without any configuration.

[prettier]: https://prettier.io/

## TypeScript Can Detect Lots of Errors

[ts-check](ts-check/) can detect a lot of problems, and it is usually faster.

For example, the `array-callback-return` rule is unnecessary,
because if I accidentally forget to write `return` statement in array mapping function,
it tends to trigger a type error.

TypeScript also has other helpful checks like `noFallthroughCasesInSwitch`.

```js
{
  "compilerOptions": {
    "strict": true,
    "noUnusedParameters": true,
    "noUnusedLocals": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
    // more options omitted
  }
}
```

## Only Include Obvious Rules

Do not include rules such as `no-new-object` and `no-nested-ternary`,
which are merely personal choice of programming style.

So here is the seven ESLint rules I use:

```js
"rules": {
    "eqeqeq": "error", // prefer `===` instead of `==`
    "prefer-arrow-callback": "error", // avoid the evil `this`
    "curly": "error", // not omit braces for statements in control flow
    "no-multi-assign": "error", // no `a = b = c = 1`
    "no-var": "error", // use `const` and `let` instead of `var`
    "prefer-const": "error", // use `const` when there is no reassignment
    "no-param-reassign": "error", // use nonreassignable function parameters
}
```

See [an example of a full eslint configuration file][eslintrc].

[eslintrc]: https://github.com/weakish/js/blob/master/.eslintrc