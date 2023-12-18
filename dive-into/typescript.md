# Notes on TypeScript

## Top and Bottom Types

Unlike `Anything` or `Any` in most static typed languages,
`any` supports the same operations as a value in JavaScript
and minimal static type checking is performed.
TypeScript's `unknown` is more similar to `Any` (top type) in other languages.

TypeScript's bottom type is `never`, which is called `Nothing` in some languages.

```ts
const verifyCasesAreExhaustive = (kind: "x" | "y" | "z") => {
switch (kind) {
    case "x":
        return 1
    case "y":
        return 2
    case "z":
        return 3
    default:
        const nothing: never = kind
        throw(nothing)
}
}
```

## Function Overloads

Considering the following definition:

```typescript
function plus(x: number, y: 0): boolean;
function plus(x: number, y: number): number;
function plus(x: string, y: string): string;
// function plus(x: number, y: string): boolean;
// function plus(x: string, y: number): boolean;
function plus(x: number | string, y: number | string): number | string | boolean {
    if (typeof x == "number" && typeof y == "number") {
        if (y === 0) {
            return false
        } else {
        return x + y;
        } 
    } else if (typeof x == "string" && typeof y == "string") {
        return `${x}${y}`; // equivalent to `x + y`.
    } else {
        return false;
    }
}

In early versions of TypeScript (e.g. [v3.5.1]),
the following code gives misleading error information:

```typescript
plus("1", 0)
// error: Argument of type '0' is not assignable to parameter of type 'string'.
```

Readers may wonder why TypeScript does not match `("1", 0)` against `plus(x: number | string, y: number | string)`.

However, recent versions of TypeScript (e.g. [v5.3.2]) provides clearer message:

```typescript
plus("1", 0)
// The call would have succeeded against this implementation,
// but implementation signatures of overloads are not externally visible
```

[v3.5.1]: https://www.typescriptlang.org/play?ts=3.5.1#code/GYVwdgxgLglg9mABABwDYgM4AoAeAuRMEAWwCMBTAJwBpEBPAgBgEoDS45VyBDMAbgBQoSLAQp02fIRIUa9AkTJVW0pZUHDo8JGky4CGKJRhgA5rQaJDxsyusnTggPRPEm0Ton7VsiwaMOKuycPPwCLm7gWmK6kv425vI+ymwcXLwaUR7ielKKsogAPlYBZn7JlEUlCSr5VFX2ZlXB6UgA3gKIXYgwwIhYUHTI5HB9OIgAvBOIAER1lDOIAGRLiIPDo-ST03MyVDPMiB3dJz19WHTb0yxHnaf3lORQIJRIwNyoGOR39wC+iORPuRbvcuo9nq9EOMANT0QSgxD-H6IgFAs79dYjMbbWaNUyLFZrIZYrZTXGlfGHY6g8EvJAAAwAJG0cL9mXRfvS+IgIuQAI4gGAANw+5DAUDWcEQ9Jh9HpADpkf9AV8QTSnnS3B8vvDur8BPqBLEsDMAIwzWgsIA
[v5.3.2]: https://www.typescriptlang.org/play?ts=5.3.2#code/GYVwdgxgLglg9mABABwDYgM4AoAeAuRMEAWwCMBTAJwBpEBPAgBgEoDS45VyBDMAbgBQoSLAQp02fIRIUa9AkTJVW0pZUHDo8JGky4CGKJRhgA5rQaJDxsyusnTggPRPEm0Ton7VsiwaMOKuycPPwCLm7gWmK6kv425vI+ymwcXLwaUR7ielKKsogAPlYBZn7JlEUlCSr5VFX2ZlXB6UgA3gKIXYgwwIhYUHTI5HB9OIgAvBOIAER1lDOIAGRLiIPDo-ST03MyVDPMiB3dJz19WHTb0yxHnaf3lORQIJRIwNyoGOR39wC+iORPuRbvcuo9nq9EOMANT0QSgxD-H6IgFAs79dYjMbbWaNUyLFZrIZYrZTXGlfGHY6g8EvJAAAwAJG0cL9mXRfvS+IgIuQAI4gGAANw+5DAUDWcEQ9Jh9HpADpkf9AV8QTSnnS3B8vvDur8BPqBLEsDMAIwzWgsIA

## Type Equality

With TypeScript's conditional types, testing type equality is intuitive:

```ts
type EqEq<T, S> = [T] extends [S] ? ([S] extends [T] ? true : false) : false

type FunctionOverloadsEquality = EqEq<
    { (x: 0, y: null): void; (x: number, y: null): void },
    { (x: number, y: null): void; (x: 0, y: null): void }> // true

type F = (x: 0, y: null) => void
type G = (x: number, y: string) => void
type FunctionIntersectionEquality = EqEq<F & G, G & F> // true
```

## The Crazy `satisfies` Operator

Below is the example given in [What's New in TypeScript 4.9][4.9]:

[4.9]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator

```ts
type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];
const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255]
//  ~~~~ The typo is now caught!
} satisfies Record<Colors, string | RGB>;
// Both of these methods are still accessible!
const redComponent = palette.red.at(0);
const greenNormalized = palette.green.toUpperCase();
```

IMHO, this shows the craziness of TypeScript.
Why `green` is encoded as hex string but `red` and `blue` are encoded as RGB arrays?
What if one day someone refactors the code and change `green` to an RGB array?
And in real world application, I would rather make all colors encoded as hex strings or RGB arrays,
but not a mix of them.
Then the `getComponent` or `displayHex` will be implemented assuming input is either a hex string or an RGB array.