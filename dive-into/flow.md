# Dive into Flow

Peek at the type system
-----------------------

- Nullability. Maybe type `?T` is `T|null|void`.
- Optional object properties and function parameters are typed `T|void`,
  e.g. `function optional_parameter(p?: string) { (p: string|void) }`.
- Function parameters with a default value are typed `T|void` for callers but `T` in function body.
- `any` is unchecked (supertype *and* subtype of all types),
  `mixed` is `Any` in other languages,
  `Object` is a supertype of all object types including functions,
  not including primitive types and array types.
  and `Function` is a supertype of all functions.
- Flow does not do bound checking for arrays.
  This means `[J, K]` is actually `[J, K, any...]`.
  This is less strict than TypeScript.
- Object is also structural typed, but they have nominal alternatives `{| p: T |}`.
- Objects can be invariant(default), covariant(`{+p: T}`), or contravariant (`{-p: T}`).
  Generics use the same variance syntax.
- Functions are modeled as object type with a callable property.
- Interfaces uses structural typing like Go.
- For a class `C`, `C` is its instance type, and its class type is `Class<C>`.
- Array types are invariant to element type.
- Rest parameters are annotated with an array type, e.g. `...xs: number[]`.
- Object type can include a callable property, e.g. `(...xs: number[]): number`,
  which allows values of that type be called like a function,
  and an indexer property, e.g. `[x: number]: string`,
  which allows values of that type to be used like a dictionary.
- Type aliases, interfaces, `import type` and `export type` are entirely erased at compile time.
- Destructing are annotated as a whole,
  e.g. `let {a, b: {c}}: {a: string, b: {c: number}} = {a: "", b: {c: 0}};`
- Type casting uses the same syntax as type annotation `e: T`.
- `typeof e` in type annotation represents the type of `e`.

Built-in types
--------------

### Boolean

JavaScript specifies many implicit conversions,
which provide boolean semantics to values of other types.
Flow allows this in conditional of `if` statements etc.

Note that in JavaScript `Boolean(0)` and `new Boolean(0)` are different.
The formal is converting `0` to the `boolean` primitive type via the `Boolean` function,
the later is initialize a `Boolean` wrapped object, which is rarely used.
Same thing applies to `number`/`Number` and `string`/`String`.

### Number

JavaScript has a single number type, which is IEEE 754 floating point numbers.

### Literal types

`true`, `false`, any `number`, and any `string` is a literal type.

`let wrong: false = true && false` is valid
since a type checker can infer that for `t` typed `true` and `f` typed `false`, `t && f` is typed `false`,
just like a type checker can infer that for `m` and `n` typed `number`, `m + n` is typed `number`.
Unlike boolean, literal types of number and string has infinite members,
a type checker cannot infer if the sum of two number typed as literal type has another specific literal type.
So `let two: 2 = 1 + 1` is invalid.


Declaration files
-----------------

Flow's declaration files are like C's header files.

A declaration file of `foo.js` is named `foo.js.flow`:

```js
/* @flow */

declare export function isLeapYear(year: string): boolean;
declare export let DEBUG: boolean;

declare export class Counter {
  val: number;
  increase(): void;
}

declare export type Response = 'yes' | 'no' | 'maybe';

declare export interface Stack<T> {
  push(item: T): void;
  pop(): T;
  isEmpty(): bool;
}
```

Declaration files supports mixin,
which can also be used in implementations, for example,

```js
/* @flow */

declare class MyClass extends Child mixins MixinA, MixinB {}
declare class MixinA {
  a: number;
  b: number;
}
// Mixing in MixinB will NOT mix in MixinBase
declare class MixinB extends MixinBase {}
declare class MixinBase {
  c: number;
}
declare class Child extends Base {
  a: string;
  c: string;
}
declare class Base {
  b: string;
}

var c = new MyClass();
(c.a: number); // Both Child and MixinA provide `a`, so MixinA wins
(c.b: number); // The same principle holds for `b`, which Child inherits
(c.c: string); // mixins does not copy inherited properties,
               // so `c` comes from Child
```

Problems
--------

### Interfaces use structural typing.

[Go's FAQ][go-faq] suggests to add an additional method to doc implementations:

```go
type Fooer interface {
    Foo()
    ImplementsFooer()
}
```

This is a simple workaround for documentation
and it prevents accidental implementation of interfaces.
However, it does not prevent a later modification of implementation of `Fooer`
to remove `Foo()` and make `ImplementsFooer()` not correct any more.

With JavaScript, a much better workaround is possible (mentioned in [#2376][]):

```js
/* @flow */
interface A {
  foo(): number;
}

class AImpl {
  constructor(): A {
    return this;
  }
  foo(): number {
    return 1
  }
}
```

So flow's structural typed interface is not as hopeless bad as Go.

[#2376]: https://github.com/facebook/flow/issues/2376

[go-faq]: https://golang.org/doc/faq#guarantee_satisfies_interface

### Implicitly type casting `number` to `string` with `+`.

The `number + string` idiom is fairly common, so flow accepts it, like TypeScript.

With this [patch][4610], `flow` will reject `number + string`:

```
Error: main.js:3
  3:    return 1 + "s"
               ^ number. This type cannot be added to
  3:    return 1 + "s"
                   ^^^ string
```

[4610]: https://github.com/facebook/flow/pull/4610

Hegel
-----

[Hegel] has a more sound type system than Flow,
and it does not have the two problems mentioned above:

1. It dose not support interface.
2. No type coercion for `number + string`.

[Hegel]: https://hegel.js.org/

It borrows Flow's syntax for type annotation, thus JavaScript can be generated via Flow tools (`@babel/preset-flow` or `flow-remove-types`).
However, it uses TypeScript `d.ts` files for library definition, because TypeScript has a much larger ecosystem than Flow.
Note some types are not supported, for example, Flow's interface and TypeScript's conditional typing.

Its vscode extension is [still in development][hegel].

[hegel]: https://github.com/JSMonk/hegel/issues/81