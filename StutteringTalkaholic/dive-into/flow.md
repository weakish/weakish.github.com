Dive into Flow
==============

Run check
---------

To enable flow checking:

- project root: `.flowconfig` (may be auto created via `flow init`), **and**
- flow header for every file to check: `/* @flow */`.

```sh
; flow check
```

To check files without adding flow header,
specify them in `[include]` in `.flowconfig`.

Alternatively, to check all files including files without flow header `/* @flow */`,
set `all = true` in `[option]` in `.flowconfig` or run flow via `flow check --all`.

Currently WebStorm 2016.3.1 only recognize flow header, not settings in `.flowconfig`.

For large projects, run flow as a sever to check incrementally:

```sh
; flow
; flow # stop the server
```

Weak mode
---------

To introduce type checking for existing code gradually:

```js
/* @flow weak */
```

In weak mode, Flow will do much less type inference, skipping checks for unannotated variables not within functions.

flow-typed
----------

`flow-typed` provides `libdef` for specifying types for libraries separately.

```sh
; npm install
; flow-typed install
```

Example of `libdef`:

```flow
// flow-typed/lodash.js

declare module "lodash" {
  declare module.exports: {
    find<T>(list: Array<T>, properties: Object): T;
  };
}
```

convert
-------

### flow-remove-types

[flow-remove-types][] removes Flow type annotations from JavaScript files.

```sh
; npm install --global flow-remove-types
; flow-remove-types input.js > output.js
```

It also provides `flow-node`.
Note that `flow-node` just removes type annotations and run JavaScript,
it does not check types.

[flow-remove-types]: https://github.com/leebyron/flow-remove-types

### babel

babel is slower than flow-remove-types,
since it also transforms JavaScript to ES5.

Convert to JavaScript with babel:

```sh
; npm install -g babel-cli
; cd /path/to/my/project
; npm install babel-plugin-transform-flow-strip-types
; echo '{"plugins": ["transform-flow-strip-types"]}' > .babelrc
; babel --watch=./src --out-dir=./build
```

Run flow typed JavaScript file directly:

```sh
; babel-node /path/to/flow-typed.js
```

`babel-node` converts to JavaScript under the hood.

Webstorm
--------

Webstorm is slow to inspect type errors.
On my machine (16G RAM and SSD) it takes about 5s to inspect type errors
with `-Xms512m` and `-Xmx2048m`.
Disable "Code highlighting and built-in inspections" in settings
will further reduce the time to 3s.
Other settings (`-Xms1024m/-Xmx4096m` and `-Xms256m/-Xmx1500m`)
is slower (about 10 seconds).

Nuclide and vscode (with `vscode-flow-ide` extension) checks error on saving file, which is instant.
The features they provide for flow are similar to WebStorm.


Peek at the type system
-----------------------

- Annotation syntax is similar to TypeScript.
- Unlike TypeScript, flow requires annotations at the boundaries of modules for checking performance.
- Union type (`S | T`) and intersection type (`S & T`) are supported.
- `null` is typed `null` and `undefined` is typed `void`.
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
- `this` type can only appear in the covariant position in a class body.
- Functions are modeled as object type with a callable property.
- Interfaces uses structural typing like Go.
- For a class `C`, `C` is its instance type, and its class type is `Class<C>`.
- `T[]` is a shortcut to `Array<T>`.
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

Included type definition
------------------------

- [JavaScript standard library](https://github.com/facebook/flow/blob/master/lib/core.js)
- [DOM](https://github.com/facebook/flow/blob/master/lib/dom.js)
- [BOM](https://github.com/facebook/flow/blob/master/lib/bom.js)
- [CSSOM](https://github.com/facebook/flow/blob/master/lib/cssom.js)
- [Node.js standard library](https://github.com/facebook/flow/blob/master/lib/node.js)

`this` type
-----------

A `this` type in Class `C` may be as the type of an instance of `C`,
or a instance of a subtype of `C`.
So `this` can only appear in a covariant position in the definition of `C`.

Function type
-------------

    (p1: T1, .., pn: Tn) => U

Refinement
----------

Flow is pessimistic about refinements.
If it is possible that a refinement may become invalid,
Flow will throw away the refinement.

```js
function foo(x: { y: ?string }): string {
  if (x.y) {
    console.log("*obviously* this doesn't mutate x");
    return x.y; // error: Flow doesn't know that
  } else {
    return "default";
  }
}
```

So immutability is important.
If `x` refers to [an immutable record][record],
Flow will be sure it will not be changed by `console.log`.

[record]: http://facebook.github.io/immutable-js/docs/#/Record


Modules
-------

### JavaScript

Just ues ES2015 or CommonJS module,
with all export declaration type annotated.

### CSS module

CSSModule.js.flow

```js
/* @flow */
declare export var className: string
```

.flowconfig

```ini
[options]
module.name_mapper='^\(.*\)\.css$' -> '<PROJECT_ROOT>/CSSModule.js.flow'
```

`<PROJECT_ROOT>` will be replaced by Flow automatically.

main.js

```js
/* @flow */

import {className} from "./SomeCSSFile.css"
```

### Import type

```js
export type UserID = number
export type User = {
  id: UserID,
  name: string,
}
```

and

```js
import type {UserID, User} from "./User.js"
```

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

### Tuples/Arrays and objects are structural typed.

Objects has alternative nominal form called exact object type `{|k: T|}`.
Prefer it.

Also prefer exact object type to tuple,
i.e. `{|0: J, 1: K|}` instead of `[J, K]`.

Parameters of functions may be viewed as tuples,
they are structural too.
[Flow doc][functions] mentioned a workaround to prevent call a function with more parameters than defined:

function takesOnlyOneNumber(x: number, ...rest: Array<void>) {}

[functions]: https://flowtype.org/docs/functions.html#_

However, flow still does not check array bound
(you have to check index against array length yourself).

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