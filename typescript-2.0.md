TypeScript pre 0.2 is crippled.

Optional types
--------------

`--strictNullChecks` makes `T` just `T`, not implicit `T | null | undefined`.
It also checks assigned-before-use.

In `--strictNullChecks`:

- Optional parameters and properties automatically have `undefined` added to their types
- Type guards, `&&` and `||`, support non-null and non-undefined checks.
- The `null` and `undefined` types are not widened to `any`.
- Given an optional type `T`, `T!` asserts `T` is non-null and non-undefined.

In regular type checking mode:

- `null` and `undefined` are automatically erased from union types.
- `T!` is permitted but has no effect.

Control flow typing
-------------------

Also, TypeScript 2.0 implements a control flow-based type analysis
for local variables and parameters,
which is particuarly relevant in `--strictNullChecks`.

Tagged/Discriminated union types
--------------------------------

Also, TypeScript 2.0 implements support for tagged (or discriminated) union types.
So type guards can narrow union types based on tests of a discriminant property.
Currently only supports discriminant properties of string literal types.
In future, boolean and numeric literal types will be supported.

Discriminant property can also be used to prevent two types from being structurally compatible.

Alternatively, a private or protected property.

never
-----

TypeScript 2.0 adds a `never` for functions never returns (always throws).
`never` is called `Nothing` in other languages.

Read-only properties
--------------------

Read-only properties may have initializers and may be assigned to in
constructors within the same class declaration, but otherwise assignments to
read-only properties are disallowed.

In addition, entities are implicitly read-only in several situations:

- A property declared with `get` but without `set`.
- In the type of an enum object, enum members are considered read-only properties.
- In the type of a module object, exported `const` variables are considered read-only properties.
- An entity declared in an `import` statement is considered read-only.
- An entity accessed through an ES2015 namespace import is considered read-only
  (e.g. `foo.x` is read-only when `foo` is declared as `import * as foo from "foo"`).

`this` type for functions
-------------------------

TypeScript 2.0 allows an explicit `this` parameter.
The `this` parameter comes first in the parameter list of a function,
like Python.
This is mainly used to specify the type of `this`.
By default the type of `this` inside a function is `any`.

Example:

```typescript
interface UIElement {
    addClickListener(onclick: (this: void, e: Event) => void): void;

}
```

The above code forbids `onClick` to call `this` in its body.

`--noImplicitThis` flag all uses of `this` in functions without an explicit type annotation.

Glob support in `tsconfig.json`
-------------------------------

Glob-like file patterns are supported two properties `"include"` and `"exclude"`.

Shorthand ambient module declarations
-------------------------------------

```typescript
declare module "hot-new-module";
declare module "myLibrary/*"; // wildcard
```

All imports from a shorthand module will have the any type.

Optional class properties
-------------------------

Optional properties and methods can now be declared in classes,
similar to what is already permitted in interfaces.

Private and Protected Constructors
----------------------------------

for classes.

Abstract properties and accessors
---------------------------------

An abstract class can declare abstract properties and/or accessors.

Cherry-pick ES2015 features
---------------------------

For example, `--lib es2015.collection,es2015.promise`.

Unused declarations
-------------------

`--noUnusedParameters` and `--noUnusedLocals`

Trailing commas in function parameter and argument lists
--------------------------------------------------------

Now allowed.

--skipLibCheck
--------------

Skip declaration files.
Compile times may be significantly shortened by skipping declaration file type checks.

Allow duplicate identifiers across declarations
-----------------------------------------------

as long as they have identical types.

--declarationDir
----------------

Generating declaration files in a different location than JavaScript files.

Conclusion
----------

```sh
tsc --strictNullChecks --noImplicitThis --noUnusedParameters --noUnusedLocals --skipLibCheck
```

Note that TypeScript 2.0 is still crippled by
structural typing
(thus functions with fewer parameters assignable to functions that take more parameters,
functions returning non-void assignable to function returning void,
unused generic parameter cause troubles to inferred type,
and all types are assignable to empty interfaces),
type erasure,
no explicit covariant/contravariant annotations
(thus bivariant function parameters).


