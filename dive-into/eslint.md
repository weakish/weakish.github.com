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

Also, prettier can also avoid some lint rules, for example, eslint's `curly` rule helps to avoid misleading code:

```js
if (condition)
    DoSomething();
    DoSomethingElse();
```

However, prettier will format the above code as below to avoid the above issue:

```js
if (condition) DoSomething();
DoSomethingElse();
```

## TypeScript Can Detect Lots of Errors

[ts-check](/dive-into/ts-check/) can detect a lot of problems, and it is usually faster.

For example, the `array-callback-return` rule is unnecessary,
because if I accidentally forget to write `return` statement in array mapping function,
it tends to trigger a type error.
`eqeqeq` is another example of an unnecessary rule,
since TypeScript complains when you are comparing two values of different types.

TypeScript also has other helpful checks like `noFallthroughCasesInSwitch`.

```js
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexAccess": true,
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

So here is the five ESLint rules I use:

```js
"rules": {
    "prefer-arrow-callback": "error", // avoid the evil `this`
    "no-multi-assign": "error", // no `a = b = c = 1`
    "no-var": "error", // use `const` and `let` instead of `var`
    "prefer-const": "error", // use `const` when there is no reassignment
    "no-param-reassign": "error", // use nonreassignable function parameters
}
```