TypeScript Coding Style
=======================

Use 2.0
--------

Use typescipt 2.0 with the following compilation options:

```sh
tsc --strictNullChecks --noImplicitThis --noUnusedParameters --noUnusedLocals
```

Default `kind` parameter to represent parameter number
------------------------------------------------------

Due to structural typing,
functions with fewer parameters are assignable to functions that take more parameters.

A workaround is to add an additional default `kind` parameter.

```typescript
type Kind1P = "1p";
type Kind2P = "2p";

function f(x: number, kind: Kind1P = "1p") {
    return x;
}
function g(x: number, y: number, kind: Kind2P = "2p") {
    return x + y;
}
```

A similar workaround for bivariant function parameter:

```typescript
type KindHUStrNum = "string | number";

function higher(
        f: (x: string | number, kind: K1P, kindH: KUStrNum) => string,
        y: string | number,
        kind: K2P = "2p",
        kindH: KUStrNum = "string | number";
        ) {
	console.log(`calling ${f}`);
	return f(y);
}

// No need to specify `kindH` since `number` is primitive.
function sub(x: number, kind: K1P): string {
	return `${x * x}`;
}
```

Reduce using `void` functions
-----------------------------

Due to structural typing, non-void functions are assignable to void functions.

Consider using `Unit` instead:

```typescript
// type alias is sealed in TypeScript.
type Unit = "Unit";
const unit: Unit = "Unit";

function side_effect(x: number, kind: Kind1P = "1p"): Unit {
    console.log(x);
    return unit;
}
side_effect(1);
```

Avoid unused parameter in generics
----------------------------------

TypeScript cannot infer expected type with unused parameter in generics.

Avoid empty interfaces
----------------------

All types are assignable to empty interfaces.

Semicolons
----------

See [JavaScript](/coding-style/javascript/).