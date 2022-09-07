# Typescript Function Overload Considered Harmful

Typescript function type declaration supports overloading.

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
Because TypeScript looks at the overload list,
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

There is a cleaver implementation by [Matt McCutchen],
which works with function overloads.

```typescript
type EqEqEq<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;
```

[Matt McCutchen]: https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650

However, it still does not work with function intersection.
