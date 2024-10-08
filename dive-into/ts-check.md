# Fight for Type Safety Stand with JavaScript

Note: This note is based on old versions of TypeScript and ReScript.

TypeScript 2.3 and later support type-checking JavaScript files with JSDoc types.
JSDoc uses the Closure Compiler's type language,
which in turn is originally based on the abandoned ES4 spec.
Therefore, to some extent, TypeScript can check against [ES4 type language][es4-draft]!

[es4-draft]: https://github.com/bkero/es4/blob/master/spec/working-drafts/type-system.pdf

```js
/**
 * @template T, U
 * @typedef {U & { readonly __TYPE__: T}} Opaque */

/** @typedef {Opaque<'age', number>} Age */
/** @type {function(number): Age} */
const newAge = (n) => {
  if (n < 0) {
    throw new Error("age must be positive")
  } else {
    return /** @type {Age} */(n)
  }
}
```

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
 * @type { {k: string} }
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

const immutableArray = /** @type {const} */ ([1, 2, 3])

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
TypeScript also accepts `*` and `function(P): R` in JSDoc type annotation.
However, some function type cannot be expressed in `function(P): R` form,
e.g. type guard and assertion signature:

```js
/** @typedef { {swim(): void;} } Fish */
/** @typedef { {fly(): void;} } Bird */

/** @type {(p: Fish | Bird) => p is Fish} */
const isFish =  (p) => /** @type {Fish} */(p).swim !== undefined

/** @type {(p: Fish | Bird) => asserts p is Fish} */
const assertIsFish = (p) => {
    if (/** @type {Fish} */(p).swim === undefined) {
        throw new AssertionError("not a string");
    }
}
```

And there are other subtle differences,
e.g. ES4 tuples should have at least two elements.
But let's just ignore these details for now.

## More Syntax Borrowed from Closure Compiler

### Type Alias

Type aliases can be defined with the keyword `@typedef`:

```js
/** @typedef { {x: number, y: number} } Pointer */
/** @type {Pointer} */
const typeAlias = { x: 0, y: 0 }
```

Generic type parameters can be defined with the keyword `template`:

```js
/**
 * @template T, U
 * @typedef {U & { readonly __TYPE__: T}} Opaque */

/** @typedef {Opaque<'age', number>} Age */
/** @type {function(number): Age} */
const newAge = (n) => {
  if (n < 0) {
    throw new Error("age must be positive")
  } else {
    // Type cast requires parenthesized expression.
    return /** @type {Age} */(n)
  }
}
```

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

### Function Overloads

```js
/**
 * @param {string} input
 * @returns {string} result
 *//**
 * @param {number} input
 * @returns {string} result
 */
function notSupported(input) { /* omit */ }
```

[#55056]: https://github.com/microsoft/TypeScript/issues/55056

Instead, TypeScript supports [a new `@overload` tag][#51234].

[#51234]: https://github.com/microsoft/TypeScript/pull/51234

### Import Types

Use `import("module").Type` to import types:

```js
/** @type { import("m").T } */
```

This is often used in type aliases for brevity:

```js
/** @typedef { import("module-name").LongTypeName } ShortName */
```

But if you have difficulties in expressing certain types in JSDoc comments,
you can also declare the type in a separate TypeScript file,
then import it in JSDoc comments.

## Type Checking

Just create a `jsconfig.json` file under the root of the project.

It is possible to check JavaScript files without the `jsconfig.json` file
with writing magic comment `// @ts-check`
or setting a configuration option in vscode.
But I prefer the `jsconfig.json` way, since I tend to set up some compiler options.

## Why

Actually ES4 type system is quite different from TypeScript.
For example, they have different subtype rules.
Also, the JSDoc way of TypeScript type checking lacks some features,
for example, there is no way to pass type parameter when invoking generic functions via JSDoc.
The only thing we can do is let TypeScript infer the type parameter.
If it fails to infer the type, we have to accept `any` as the type parameter.
Another example is TypeScript cannot parse conditional types in JSDoc comments correctly. ([#27424])

[#27424]: https://github.com/microsoft/TypeScript/issues/27424

So why not code in TypeScript instead?

Possible reasons:

1. Get rid of the compilation step.
2. Avoid using TypeScript features unavailable in ECMAScript.
3. Secretly migrate a JavaScript project to TypeScript when other project developers do not want to switch to TypeScript.

## Alternatives

An alternative approach for a secret migration from JavaScript is to rewrite them in ReScript,
and use genType to generate TypeScript files.

```ts
/* TypeScript file generated from index.res by genType. */
/* eslint-disable import/first */

// @ts-ignore: Implicit any on import
import * as indexBS__Es6Import from './index.bs';
const indexBS: any = indexBS__Es6Import;

// tslint:disable-next-line:interface-over-type-literal
export const h1: (line:string) => string = indexBS.h1;
```

This TypeScript files work, but the `indexBS` part is not perfectly human-readable.
The TypeScript compiler can be used to generate corresponding `.d.ts` files.

```ts
export declare const htm: (text: string) => string;
```

This approach also brings in a sound type system.
