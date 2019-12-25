On TypeScript
=============

Primitive types
---------------

- `number` (float point)
- `bigint` (target `esnext` only)
- `boolean`
- `string`
- `symbol` and `unique symbol`
- `null`
- `undefined`

All other types are non-primitive, a.k.a. `object`.

```typescript
function add(left: number, right: number): number {
	return left + right;
}
```

Here return type `number` can be inferred,
but explicit declaration helps compiler to find bugs in function body.

If no type can be inferred, then it defaults to `any`.
Unlike `Anything` or `Any` in most static typed languages,
`any` supports the same operations as a value in JavaScript
and minimal static type checking is performed.
TypeScript's `unknown` is more similar to `Any` (top type) in other languages.

TypeScript's bottom type is `never`, which is called `Nothing` in some languages.

Declaration files
-----------------

Type annotations can be exported to a separate declarations file (like header files)
to describe types of objects in existing JavaScript code.

```typescript
declare module arithmetics {
    add(left: number, right: number): number;
    subtract(left: number, right: number): number;
    multiply(left: number, right: number): number;
    divide(left: number, right: number): number;
}
```

We can use npm to install typings for packages:

```sh
npm install @types/<package>
```

Compile
-------

```sh
npm install -g typescript
tsc file.ts # output: file.js
```

TypeScript will warn type errors.
But the JavaScript file is still generated (and can still be used as a JavaScript file).

REPL
----

[ts-node](https://github.com/TypeStrong/ts-node)

Pitfalls
--------

### Excess Property Checking for Object Literal

TypeScript uses structural typing (to work with typical JavaScript code).

```typescript
function print_height(person: { height: number }): void {
    console.log(person.height)
}

const somebody = { height: 150, weight: 150 };
print_height(somebody);
```

However, TypeScript has excess property checking for object literal.
Thus if we inline the `somebody` declaration above, TypeScript raises an error:

```typescript
print_height({ height: 150, weight: 150 }); // Error!
```

However, partial overlap is still permitted:

```typescript
type Point = {
    x: number;
    y: number;
}
type Label = {
    name: string;
}
const partialOverlap: Point | Label = {
    x: 0,
    y: 0,
    name: "origin"
}
function print_pl(pl: Point | Label) {
    console.log(pl)
}
print_pl({ x: 0, y: 0, name: "origin"})
```

But overlap with conflicting properties is not permitted:

```typescript
type Point = {
    x: number;
    y: number;
}
type SPoint = {
    x: string;
    y: string;
}
const conflictingProperties: Point | SPoint = {x: 0, y: "0"}
```

### Function Overloads

Function type declaration supports overloading.

```typescript
function plus(x: number, y: number): number;
function plus(x: string, y: string): string;
function plus(x: number, y: number): boolean; // see notes below
function plus(x: number | string, y: number | string): number | string | boolean { // this line is not overload
    if (typeof x == "number" && typeof y == "number") {
        return x + y;
    } else if (typeof x == "string" && typeof y == "string") {
        return `${x}${y}`; // equivalent to `x + y`.
    }
}
```

In the above example, the third overload will not be matched forever.
Because TypeScripts looks at the overload list,
proceeding with the first overload attempts to call the function with the provided parameters.
If it finds a match, it picks this overload as the correct overload.
And since intersection type of functions are defined as function overloads in TypeScript,
this breaks the commutative rule of intersection function.
Given two function types `F` and `G`, `F & G` and `G & F` are not equivalent.

Not surprisingly, it is difficult to check function overloads for type equality.

With TypeScript's conditional types, testing type equality is intuitive:

```ts
type EqEq<T, S> = [T] extends [S] ? ([S] extends [T] ? true : false) : false
```

But it cannot handle function overloads and function intersection:

```typescript
type FunctionOverloadsEquality = EqEq<
    { (x: 0, y: null): void; (x: number, y: null): void },
    { (x: number, y: null): void; (x: 0, y: null): void }> // true

type F = (x: 0, y: null) => void
type G = (x: number, y: string) => void
type FunctionIntersectionEquality = EqEq<F & G, G & F> // true
```

To check function overloads' type equality, use this cleaver implementation by [Matt McCutchen]:

```typescript
type EqEqEq<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;

type FunctionOverloads = EqEqEq<
    { (x: 0, y: null): void; (x: number, y: null): void },
    { (x: number, y: null): void; (x: 0, y: null): void }> // false
```

[Matt McCutchen]: https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650

However, it still cannot handle  function intersection:

```typescript
type FunctionIntersection = EqEqEq<F & G, G & F> // true
```

Besides, `EqEq` considers `any` to equal to any type except `never`.
`EqEqEq` does not consider `any` to be identical to other type.

### Literal String, Literal Number, But Unique Symbol

TypeScript has literal strings and literal numbers, but there is no literal symbols.
Instead, there is unique symbols (only allowed in const declarations).

In other words:

```js
let no_unique_string_type: 'non sense but valid' = 'non sense but valid'
let no_literal_symbol: symbol = Symbol("cannot express Symbol(0) | Symbol(1)")
```

## tsconfig.json Example

See [weakish/js/tsconfig.json](https://github.com/weakish/js/blob/master/tsconfig.json)
