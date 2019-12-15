# Fight for Type Safety. Stand with JavaScript.

TypeScript 2.3 and later support type-checking JavaScript files with JSDoc types.
And JSDoc's uses the Closure Compiler's type language,
which in turn is originally based on the abandoned ES4 spec.
Therefore, to some extent, TypeScript can check against [ES4 type language][es4-draft]!

[es4-draft]: https://github.com/bkero/es4/blob/master/spec/working-drafts/type-system.pdf

## ES4 Type Language Overview

Take a glance at ES4 type language:

```js
/** @type {null} */
const nil = null

/** @type {string?} */
let nullable = null

/** @type {function(number, number): number} */
const functionType = (x, y) => x + y

/**
 * function.<T>(T): T
 * @type {<T>(x: T) => T}
 */
const genericFunction = x => x

/**
 * @type {{k: string}}
 */
const objectType = { k: "structural" }

/**
 * (string, number)
 * @type {string  | number}
 */
let unionType = 0

/**
 * [number]
 * @type {number[]}
 */
const arrayType = [1, 2, 3]

/**
 * @type {[string, number]}
 */
const tupleType = ["one", 1]

/** @type {*} */
let dynamicType = null
```

Note that TypeScript syntax differs from ES4 for the following types:

0. dynamic type: `any` vs `*`
1. union type: `A | B` vs `(A, B)`
2. array: `T[]` vs `[T]`
3. function: `(x: P) => R` vs `function(P): R`

Since Closure Compiler also uses `*` and `function(P): R`,
and TypeScript tries to be compatible with Closure type syntax,
TypeScript also accepts `*` and `function(P): R` in JSDoc type annotation,
except for the syntax of generic functions.

And there are other subtle differences,
e.g. ES4 tuples should have at least two elements.
But let's just ignore these details for now.

## More Syntax Borrowed from Closure Compiler

### Type Alias

Type aliases can be defined with the keyword `@typedef`:

```js
/** @typedef {{x: number, y: number}} Pointer */
/** @type {Pointer} */
const typeAlias = { x: 0, y: 0 }
```

### Type Cast

In the following example, the variable `one` would have an inferred literal type `1`
if there was no type cast.

```js
const one = genericFunction(/** @type {number} */ (1))
```

Type cast requires parenthesized expression.

### Enum

`@enum` is also borrowed from [Closure Compiler's type system][closure-enum],
and is quite different from [TypeScript's enum][ts-enum].

[closure-enum]: https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler#enum-type
[ts-enum]: https://www.typescriptlang.org/docs/handbook/enums.html

```js
/**
 * @enum {function(number): number}
 */
const immutableObjectLiteral = {
  /** @type {function(number)} */
  succ: n => n + 1,
  /** @type {function(number)} */
  pred: n => n - 1
}
```

## Type Checking

Just enable `allowJs`, `checkJs`, `noEmit` in tsconfig.json,
to tell vscode to check JavaScript files.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedParameters": true,
    "noUnusedLocals": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "checkJs": true,
    "noEmit": true,
    "target": "ES2017",
    "incremental": true
  }
}
```

It is possible to check JavaScript files without tsconfig.json file
with writing magic comment `// @ts-check` or setting an configuration option in vscode.
But I prefer the tsconfig.json way, since I tend to setup some typescript compiler options.

## Why

Actually ES4 type system is quite different from TypeScript.
For example, they have different subtype rules.
Also, the JSDoc way of TypeScript type checking lacks some features,
for example, there is no way to pass type parameter when invoking generic functions via JSDoc.
The only thing we can do is let TypeScript infer the type parameter.
If it fails to infer the type, we have to accept `any` as the type parameter.
Also, there is no equivalent form of `as const` assertion yet ([#30445]).

[#30445]: https://github.com/Microsoft/TypeScript/issues/30445

So why not code in TypeScript instead?

Possible reasons:

1. Get rid of the compilation step.
2. Avoid using TypeScript features unavailable in ECMAScript.
3. Secretly migrate a JavaScript project to TypeScript when other project developers do not want to switch to TypeScript.