On TypeScript
=============

*work in progress*

Backward compatibility
----------------------

TypeScript is a strict superset of ECMAScript 2015,
which is a superset of ECMAScript 5, commonly referred to as JavaScript.

Primitive types
---------------

- `number` (float point)
- `bigint` (added in TypeScript 3.2, target `esnext` only)
- `boolean`
- `string`
- `symbol`
- `null`
- `undefined`

All other types are non-primitive, a.k.a. `object` (added since TypeScript 2.2).

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
TypeScript's `unknown` (top type added in TypeScript 3.0) is more similar to `Any` in other languages.

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

Since TypeScript 2.0, we can use npm to install typings for packages:

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

### Property Renaming

```typescript
const {a: new_name_for_a, b: new_name_for_b}: {a: number, b: number} = o;
```

Here `: {a: number, b: number}` is a type declaration, and it can be omitted (inferred).
But `: new_name_for_a` is not a type declaration.
This confuses me.
JavaScript uses `:` in object notation to represent mapping.
TypeScript uses `:` in declaration to represent mapping to types.
But here `:` is used in declaration to represent mapping to property names.

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

### Loose Function Typing

```typescript
function add(x: number, y: number): number {
    if (y) {
        return x + y;
    } else {
        return x;
    }
}

add(1); // Error!
```

However,

```typescript
function h(f: (x: number, y?: number) => number): number {
    return f(1, 1) + 1;
}

h(add); // No error!
```

Also,

```typescript
function g(f: (x: number, y: number) => number): number {
    return f(1, 1) + 1;
}

function multiply(x: number, y?: number): number {
    if (y) {
        return x * y;
    } else {
        return x;
    }
}

g(multiply); // No error!
```

### `this` type

Below is a simplification of the `BasicCalculator` and `ScientificCalculator` example in Handbook.

```typescript
class Add {
    public constructor(protected value: number = 0) {}
    public result(): number {
        return this.value;
    }
    public add(other: number): this {
        this.value += other;
        return this;
    }
}
class Minus extends Add {
    public constructor(value: number = 0) {
        super(value);
    }
    public minus(other: number): this {
        this.value -= other;
        return this;
    }
}
const calculate_example = new Minus(1).add(49).minus(7).add(1).result();
```

Without features like `this` type, `new Minus(1).add(49)` returns `Add`,
which does not have a `minus` method.
Thus `Minus` need to refine `add` if there was no `this` type.

However, I think `Add` and `Minus` should be two interface.
It is clearer that `Add` and `Minus` declares operations to implement.
Use `this` type will produce a long chain of inherence.
For example, if we want to add `Multiple`,
returning `this` type requires `Multiple` extends `Minus`.
Then what if we have a type `SomeGroup` can do `add` and `multiple`, but not `minus`?
Refine `minus` to throw an exception?
It is only a workaround on runtime and does not help compile time type check.
If `Add`, `Minus`, and `Multiple` are all interfaces,
then `SomeGroup` can simply implements `Add` and `Multiple`, but not `Minus`.
Same applies `BasicCalculator` and `ScientificCalculator` in the Handbook example.

Overview
--------

### TypeScript

```typescript
// .ts
const template_string = `1 + 1 = ${1 + 1}`;

const an_array : Array<number> = [1, 2, 3];

// destructuring
const [first, second, third] = an_array;
const [car, ...cdr] = an_array;
const [, hard, to_read ] = an_array; // hard: 2, to_read: 3
const o = { a: 1, b: 2, c: 3 }
const {a, c} = o; // skip b

let a_tuple: [string, number];
a_tuple = ["key", 0];
a_tuple[2] = "outside tuple"; // Error!
a_tuple = [0, "value"]; // Error!
// Since TypeScript 2.7, tuples of different arities are no longer assignable to each other.
// Since TypeScript 3.0, tuple types support the `?` postfix for optional element.
// The `length` property of a tuple type with optional elements is a union of numeric literal types, e.g. the type of the `length` property of tuple type `[number, string?, boolean?]` is `1 | 2 | 3`.
// Since TypeScript 3.0, the last element of a tuple can be a rest element of `...ArrayType`, i.e. an open-ended tuple containing zero or more additional elements of the array element type.

const enum Color {Red, Green, Blue}; // completely removed during compilation
enum NonConstEnumLikesObject {
    A = 1, // without initializer it would be 0
    B,  // the value of A plus 1
    C, // 3
    // The enum member is initialized with a constant enum expression.
    // A constant enum expression is one of:
    // - numeric literal
    // - reference to previously defined constant enum member
    //   (it can be defined in different enum).
    // - parenthesized constant enum expression
    // - `+`, `-`, `~` unary operators applied to constant enum expression
    // - arithmetic and binary operators applied to constant enum expressions
    //   (it is a compiler error if it is evaluated to `NaN` or `Infinity`).
    //
    // All other enum members are computed.
    L = "abc".length
}
// TypeScript 2.4 added string enums.
enum Colors {
    Red = "RED",
    Green = "GREEN",
    Blue = "BLUE",
}

function side_effect(): void {
    console.log("just side effect");
}

const a_string_typed_any: any = "a string";
const string_length: number = (a_string_typed_any as string).length;

interface InterfaceAreLikeTypeAlias {
    age: number;
}
function print_age(person: InterfaceAreLikeTypeAlias): void {
    console.log(person.age);
}
function anonymous_interface(person: { age: number }): void {
    console.log(person.age);
}

// TypeScript uses structural typing (to work with typical JavaScript code).
const someone = { age: 10, weight: 23 };
print_age(someone);


interface InterfaceForFunction {
    (x: number): number;
    // `x` is for description only.
    // Function implementation is not required to use matching parameter.
}
interface IndexableType {
    [index: number]: string
}

interface TraditionalInterface {
    age: number;
    set_age(age: number); // abstract function
}
class man implements TraditionalInterface {
    age: number; // cannot omit
    set_age(age: number) {
        return this.age;
    }
    constructor(birth_year: number) {
        const current_year: number = new Date().getFullYear();
        this.age = current_year - birth_year;
    }
}

// constructor is static (not belong to instance).
// So constructor functions declared in interface
// cannot be implemented in classes implements the interface.
// We need an additional constructor function.
interface PointConstructor {
    new (x: number, y: number): PointInterface;
}
interface PointInterface {
    print();
}
function new_point(
        point_constructor: PointConstructor,
        x: number, y: number
        ): PointInterface {
    return new point_constructor(x, y);
}
class Point implements PointInterface {
    constructor(x: number, y: number) {}
    print() {
        console.log("This is a point.");
    }
}
let a_point = new_point(Point, 1, 2);
// In fact, a class C declaration produces two types:
//
// 1. `C`: the type of its instance;
// 2. `typeof C`: the type of the class itself.
//
// In TypeScript, the type of the class itself is the type of its constructor.
// The constructor type contains
// the constructor function and all static members of the class.
//
// In the above code, `new_point()` accepts a `PointConstructor` type,
// and we pass a `Point` value to it.
// This is valid since the type of `Point` itself is its constructor type,
// which satisfies `PointConstructor` interface.
//
// Another example:
const point_creator: typeof Point = Point;
const another_point: Point = new point_creator(1, 2);
//
// If this feels confusing,
// consider a class declaration as an invocation of a class constructor,
// and "object is a poor man's  closure".


// interface extension
interface Pet {
    name: string;
}
interface Carnivore {
    eat(meat: string): void;
}
interface Dog extends Pet, Carnivore {
    bark(): void;
}

// hybrid interface
interface BothFunctionAndObject {
    (x: number): number;
    name: String;
    print(): void;
}
function mainly_for_interop_with_javascript(): BothFunctionAndObject {
    const hybrid = <BothFunctionAndObject>function (x: number) {}
    hybrid.name = "hybrid";
    hybrid.print = () => { console.log("name"); } // fat arrow
    return hybrid;
}

// We have seen fat arrows in the above code.
// More examples:
const identity = (x: number): number => { return x };
const shortcut_of_identity = (x: number) => x; // return type inferred
// Fat arrow is not just a syntax sugar for one liners,
// it fix JavaScript's dynamic scoping `this`.
const higher_order = {
    count: 1,
    return_a_function: function() {
        return () => {
            return this.count;
            // Without fat arrow, `this` is dynamic scoping.
            // For example, if we call `higher_order.return_a_function()()`,
            // in the toplevel in browser,
            // `this` will be `window` (or `undefined` in strict mode).
        }
    }
}


// In TypeScript, classes can be used as an interface,
// extensible by other interfaces, and implementable by other classes.

class AClassToBeExtendedByInterface {
    // private and protected will also be inherited.
    private password: string; // `public` by default
    print(): void {
        console.log("Implementation will not be inherited by interface.");
    }
}
interface InterfaceExtendsAClass extends AClassToBeExtendedByInterface {
    own_method(): void;
}

class ClassCanBeUsedAsInterface {
    print() {
        console.log("Implementations must declare this function.");
    }
}
class ImplementsNotExtends implements ClassCanBeUsedAsInterface {
    print() {
        console.log("Required to declare this.");
        console.log("Cannot call `super` since not `extends`.");
    }
}

// Besides working with existing JavaScript code,
// the only usage case I can imagine is using implemented class in tests.
// Thus we do not need to define an additional interface just for mocking.


class GetterSetter {
    private _under_line: string; // TypeScript still needs this.
    get under_line(): string {
        return this._under_line;
    }
    set under_line(value: string) {
        this._under_line = value;
    }
}

class StaticMember {
    static static_property = 0;
    print() {
        console.log(StaticMember.static_property);
    }
}

abstract class MayContainImplementation {
    abstract abstract_method(): void;
    print(): void {
        console.log("default implementation");
    }
    // Constructors in derived classes must contain a super call.
    constructor(public name: string) {}
}

class AbstractClassImplementation extends MayContainImplementation {
    constructor(name: string) {
        super(name);
    }
    abstract_method(): void {
        console.log("Must implemented all abstract methods.");
    }
}



// contextual typing
//
// We already know types can be inferred:
const inferred_function_type = function(x: number): number { return x; }
// i.e. type of declaration can be inferred from the value assigned to it.
// The opposite also works, i.e. contextual typing:
const contextual_typed_function: (x: number) => number = function(x) { return x; }
// `x` in `function(x)` is typed `number`.

// TypeScript requires invocation arguments matching declaration arguments.
function two_arguments(x: number, y: number): number {
    return x + y;
}
const call_two_arguments = two_arguments(1); // Error: too few parameters
const call_two_arguments_again = tow_arguments(1, 2, 3); // Error: too many parameters

// In JavaScript, every parameter is optional (`undefined` if not given).
// TypeScript requires explicitly declare them as optional:
function one_optional_argument(x: number, y?: number): number {
    // required parameters comes before optional ones
    if (y) {
        return x + y;
    } else {
        return x;
    }
}
const call_one_optional_argument = one_optional_argument(); // Error: `x` is required.
const omit_optional_argument = one_optional_argument(1); // O.K.
const too_many_arguments = one_optional_argument(1, 2, 3); // Error

// Similar to optional parameter:
function default_parameter(x: number, y: number = 0): number {
    return x + y;
}
// The type is the same as `one_optional_argument`:
// `(x: number, y?: number) => number`.

function default_before_required(default_parameter: number = 1, required: number): number {
    return default_parameter + required;
}
// Avoid the above since invocation is confusing:
const pass_undefined = default_before_required(undefined, 2);

function variadic_parameter(first: number, ...rest: number[]) {
    return `${first}, ${rest.join(',')}`;
}


// Function type declaration supports overloading.
function plus(x: number, y: number): number;
function plus(x: string, y: string): string;
function plus(x: number, y: number): boolean; // see notes below
function plus(x, y): number | string | boolean { // union type
    if (typeof x == "number" && typeof y == "number") {
        return x + y;
    } else if (typeof x == "string" && typeof y == "string") {
        return `${x}${y}`; // equivalent to `x + y`.
    }
}
// The third overload will not be matched forever.
// Because TypeScripts looks at the overload list,
// proceeding with the first overload attempts to call the function with the provided parameters.
// If it finds a match, it picks this overload as the correct overload.

// In the above code, the return type of `plus` is `number | string | boolean`,
// which is a union type.
// Since TypeScript 2.7, union types can properly distinguish between structurally identical classes.



// Generic classes are similar to generic interfaces.
class GenericClass<T> {
    default: T;
    echo: (x: T) => T;
}
// Class types with prototype in generics
//
// Below is an example from [TypeScript Handbook][handbook].
//
// [handbook]: http://www.typescriptlang.org/docs/handbook/generics.html
class BeeKeeper {
    hasMask: boolean;
}
class ZooKeeper {
    nametag: string;
}
class Animal {
    numLegs: number;
}
class Bee extends Animal {
    keeper: BeeKeeper;
}
class Lion extends Animal {
    keeper: ZooKeeper;
}
function findKeeper<A extends Animal, K> (a: {new(): A; prototype: {keeper: K}}): K {
    return a.prototype.keeper;
}


const function_subtype = (x: number) => 0;
const discarding_parameter = (x: number, y: string) => 0;
// `function_subtype` is compatible with `discarding_parameter`.
// This design of TypeScript is based on the fact
// that ignoring extra function parameters is actually very common in JavaScript.
// This rules also applies to optional parameters and rest parameters
// (a rest parameter is treated as if it were an infinite series of optional parameters.)


// Similarly, to work with common JavaScript patterns,
// function parameter is "bivariant" when assigning them.
// (The only exception, introduced in TypeScript 2.4, is callback parameters of `map`,
// which is checked in a contravariant manner.)
// Thankfully, TypeScript 2.6 introduces `--strictFunctionTypes`, which is part of the `--strict` family of switches.
// With `--strictFunctionTypes`, parameters in function are checked contravariantly instead of bivariantly,
// except those originating in method or constructor declarations
// Methods are excluded for TypeScript's crippled variance handling of generic classes and interfaces such as `Array<T>`.

// And type parameters in generics only affect the resulting type
// when consumed as part of the type of a member.
//
// A overload function `s` is a subtype of another overload function `u`
// if each overload of `s` is a subtype of corresponding overload of `u`.

// Narrow down types.
//
// To narrow down a type, we can define a type guard that returns a type predicate:
interface Fish {
    swim(): void;
}
interface Bird {
    fly(): void;
}
function isFish(p: Fish | Bird): p is Fish {
    return (p as Fish).swim !== undefined;
}
// For primitive types, we can just use something like `typeof t === "number"`.
// These type guards are recognized in `typeof t (=|!)== type_name`
// where `type_name` is one of `"number"`, `"string"`, `"boolean"`, and `"symbol"`.
//
// `instanceof` type guard uses constructor function to narrow down types.
// The right side of the `instanceof` needs to be a constructor function, i.e. class,
// and since TypeScript 2.7 `instanceof` can properly distinguish between structurally identical classes.
//
// A `string_literal in union_type` expression can also be inferred as type guards.

// Intersection type
function swim_then_fly(p: Fish & Bird) {
    p.swim();
    p.fly();
}


type TypeAlias = string | number | boolean;
// Recursive type alias are allowed in a property.
type Tree<T> = {
    left: Tree<T>;
    right: Tree<T>;
}
// It’s not possible for a type alias to appear anywhere else
// on the right side of the declaration:
type Invalid = Array<Invalid>;
// Difference between type alias and interface:
//
// - Type alias cannot be implemented or extended.
// - Interface cannot extends a union or intersection of interfaces.

type StringLiteralType = "left" | "right";
// It can be used to mimic enum.
type StringLiteralCanBeUseAsALiteralType = "one" | number;

// TypeScript 2.0 added boolean literal, number literal, and enum literal.
type Result<T> =
  | { success: true; value: T }
  | { success: false; error: string };

let httpdPort: 80 | 443;

const enum HttpStatus {
    Ok = 200,
    NotFound = 404
}

let httpStatus: HttpStatus = 200;

// TypeScript 2.7 added the `unique symbol` type,
// which is a subtype of `symbol`,
// and are produced only from calling `Symbol()` or `Symbol.for()`,
// or from explicit type annotations.
// `unique symbol` is only allowed on `const` declarations and `readonly` properties.

// TypeScript supports `symbol` if the compilation target is ECMAScript 2015.
const a_symbol: symbol = Symbol("symbols are immutable");
const an_empty_symbol = Symbol();
const another_empty_symbol = Symbol();
console.log(`symbols are unique? ${an_empty_symbol !== another_empty_symbol}`);


// In TypeScript, just as in ECMAScript 2015,
// any file containing a top-level import or export is considered a module.
export const month_regex = /([0][0-9])|([1][0-2])/;
// If a file has a single `export function` or `export class`,
// consider using `export default`.
export default function main_function() {
    console.log('client uses `import any_name_they_like from "./main_function"');
    console.log('An import starts with `(/)|(\./)|(../)` is a relative import.');
}
// import entire module as a variable
import * as URL from "url";
// `"url"` is a non-relative import.
// With `--moduleResolution Node`,
// TypeScript will resolve it in Node.js way except:
// - if `.ts` is not found, search for `.d.ts`,
// - use `typings` instead of `main` in `package.json`.
// With `--moduleResolution Classic`,
// TypeScript will walk up the directory tree
// starting with the directory containing the importing file,
// trying to locate a matching definition file.
// `--moduleResolution {Node, Classic}` can also be used with relative import.
//
// For simplicity, always use `--moduleResolution Node`.

function compatible_with_common_js() {}
// Cannot be used in module with other export elements.
export = compatible_with_common_js; // Error!
// from client
import common_js = require("./compatible_with_common_js");

namespace NamespaceAreLikePackage {
    export function visible_outside() {
        console.log("access via `NamespaceAreLikePackage.visible_outside()`");
        console.log("Or `import alias_name = NamespaceAreLikePackage`");
        console.log("A relative import cannot resolve to an ambient module declaration.");
    }
    const non_export = "not visible outside namespace and other merging namespace";
}
// namespace can be declared in different files (declaration merging).
// By default, `tsc` will compiles separate typescript files to individual javascript files.
// So if we are using namespace, be careful the load order of `<script>` tags.
// Alternatively,  `tsc --outFile file.js file.ts` will output a concatenated file.
//
// `--outFile` cannot concatenate multiple modules.
// This is because ECMAScript 2015 modules can only be implicitly declared with their file name,
// either `module_name.js` or `module_name/index.js`.

// With `--noResolve`, `tsc` will not import modules from any file
// except those passed on the command line.
//
// Without specifying `exclude` or `files` in `tsconfig.json`,
// `tsc` will compile all files in the directory containing `tsconfig.json`
// and all files in its sub-directories.
// `exclude` and `files` will not prevent the compiler compile a file
// (not specified in `files` or specified in `exclude`) when it is imported as a module.

interface MergingInterface {
    height: number;
    weight: number;
    print(x: number): void; // dead code because of later overload
    exception_for_literal_string(s: "second"): void;
    exception_for_literal_string(s: "third"): void;
}
interface MergingInterface {
    cannot_declare_height: number;
    non_function_members_have_to_be_uniq: number;
    print(x: number): string; // overload `print(x: number): void`.
    exception_for_literal_string(s: string): void; // last
    exception_for_literal_string(s: "first"): void;
}

class MergeNamespaceWithClass {
    inner: MergeNamespaceWithClass.InnerClass;
}
namespace MergeNamespaceWithClass {
    // Without `export`, the merged class cannot see it.
    export class InnerClass {};
}

function merge_namespace_with_function() {
    console.log(merge_namespace_with_function.name);
}
namespace merge_namespace_with_function {
    export const name = "type safe";
}

namespace NonConstEnumLikesObject {
    export function print() {
        console.log("extend enum with static members");
    }
}

// Although JavaScript modules do not support merging,
// you can patch existing objects by importing and then updating them.
// An example in Handbook.
import { Observable } from "./observable";
declare module "./observable" {
    interface Observable<T> {
        map<U>(f: (x: T) => U): Observable<U>;
    }
}
Observable.prototype.map = function(f) {}
// JavaScript built-in structures are considered as a global "module".
declare global {
    interface String {
       self(): string;
    }
}
String.prototype.self = () => this;
```

### Declaration Files

```typescript
// .d.ts
// Anonymously-typed
declare var MyPoint: { x: number; y: number; };
// Interfaced-typed
interface Point { x: number; y: number; }
declare var AnotherPoint: Point;
// From the consumer side these declarations are identical,
// but the type `Point` can be extended through interface merging.

// Classes have two types: the instance type, and the constructor function type.
// We can declare them separately in one class, or separately.
//
// An example from Handbook
//
// Standard
declare class A {
    static st: string;
    inst: number;
    constructor(m: any);
}
// Decomposed
interface A_Static {
    new(m: any): A_Instance;
    st: string;
}
interface A_Instance {
    inst: number;
}
declare var AA: A_Static;
// Difference:
//
// - Standard classes can be inherited from using `extends`;
//   decomposed classes cannot.
//
//    ```typescript
//     class SubA extends A {}
//    ```
//
// - It is possible to add instance members to decomposed classes,
//   but not standard classes
declare var AAA: A_Static;
```

Since 2.0
---------

### Optional Types

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

Also, TypeScript 2.0 implements a control flow-based type analysis
for local variables and parameters,
which is particularly relevant in `--strictNullChecks`.

TypeScript 2.2 flags nullable expression operands as compile-time errors in:

- `-`, `*`, `**`, `/`
- `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^`
- `<`, `>`, `<=`, `>=`, `in`
- `+`, `-`, `~`, `++`, `--` (unary)

And,

- the right operand of `instanceof`
- either operand of `+` is nullable, and neither operand is of type `any` or `string` (to work with existing common JavaScript patterns)


### Tagged/Discriminated Union Types

TypeScript 2.0 implements support for tagged (or discriminated) union types.
So type guards can narrow union types based on tests of a discriminant property.
Currently only supports discriminant properties of string literal types.
In future, boolean and numeric literal types will be supported.

Discriminant property can also be used to prevent two types from being structurally compatible.

Alternatively, use a private or protected property.

### `never` Type

TypeScript 2.0 adds a `never` type for functions never returns (always throws).
`never` is called `Nothing` in other languages.

### `readonly` Properties

TypeScript 2.0 adds a `readonly` keyword for properties.
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

`readonly` for properties is similar to `const` for variables,
except that `readonly` is checked at compile time only,
and `const` is also checked at runtime
(provided that typescript source code is compiled to a recent versions of JavaScript).

### Optional Class Properties

Optional properties and methods can now be declared in classes,
similar to what is already permitted in interfaces.

### Explicit `this` Parameter

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

`--noImplicitThis` flags all uses of `this` in functions without an explicit type annotation.

### Abstract Properties and Accessors

An abstract class can declare abstract properties and/or accessors.

### Unused Declarations

`--noUnusedParameters` and `--noUnusedLocals`.

### `--skipLibCheck`

Skip declaration files.
Compile time may be significantly shortened by skipping declaration file type checks.

### Shorthand Ambient Module Declarations

```typescript
declare module "hot-new-module";
declare module "myLibrary/*"; // wildcard
```

All imports from a shorthand module will have the any type.

This is mainly used for working with legacy untyped code.

### Conclusion

```sh
tsc --strictNullChecks --noImplicitThis --noUnusedParameters --noUnusedLocals --skipLibCheck
```

With these enhancements, TypeScript is much less crippled than its pre 2.0 versions.
But it is still crippled by
structural typing
(thus functions with fewer parameters assignable to functions that take more parameters,
functions returning non-void assignable to function returning void,
unused generic parameter cause troubles to inferred type,
and all types are assignable to empty interfaces),
type erasure,
no explicit covariant/contravariant annotations
(thus bivariant function parameters).


Since 2.1
---------

### `keyof`, Lookup Types, and Mapped Types

These are useful in type transformation:

```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
```

Short explanation:

- `[... in ...]: ...`, **mapped types**
- `keyof T`, indexed type query, which yields the type of permitted property names for `T`. `keyof T` is considered a subtype of `string | number | symbol` (since 2.9).
- `T[P]`, **indexed access types**.

Note that `keyof (A & B)` and `keyof A | keyof B` should be equivalent.
And TypeScript has recognized this equivalence since 2.8.

Also, TypeScript 2.8 added the ability for a mapped type to either add or remove a particular modifier.

After 2.8, the above transformation is equivalent to:

```typescript
type Readonly<T> = {
    +readonly [P in keyof T]: T[P];
}
```

And its reversed form (removing `readonly` modifier) is:

```typescript
type Variable<T> = {
    -readonly [P in keyof T]: T[P];
}
```

### New targets

- `--target ES2016`
- `--target ES2017`
- `--target ESNext`

### `--noImplicitAny`

Infer types based on later assignment.

### `--alwaysStrict`

- Parses all the code in strict mode.
- Writes `"use strict";` directive atop every generated file.

Modules are parsed automatically in strict mode.

### Conclusion

```sh
tsc --strictNullChecks --noImplicitThis --noUnusedParameters --noUnusedLocals --skipLibCheck --target ES2017 --noImplicitAny --alwaysStrict
```

Since 2.3
---------

### Generic Parameter Defaults

An example from the [release note][2.3 release note]:

before (with overloading)

```typescript
declare function create(): Container<HTMLDivElement, HTMLDivElement[]>;
declare function create<T extends HTMLElement>(element: T): Container<T, T[]>;
declare function create<T extends HTMLElement, U extends HTMLElement>(element: T, children: U[]): Container<T, U[]>;
```

after (with generic parameter defaults):

```typescript
declare function create<T extends HTMLElement = HTMLDivElement, U = T[]>(element?: T, children?: U): Container<T, U>;
```

[2.3 release note]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-3.html

### `--strict` master option

With `--strict` master option, the command line of `tsc` can be shortened to:

```sh
tsc --strict --noUnusedParameters --noUnusedLocals --skipLibCheck --target ES2017 --allowJs --checkJs
```

Actually I've added two options here,
`--allowJs` and `--checkJs`.

`--allowJs` is introduced in TypeScript 1.8, which tells `tsc` to also compile JavaScript files.
Here "compile" means running a quick sanity check on JavaScript files for syntax errors but otherwise passing them directly to the output directory.

`--checkJs` is introduced in TypeScript, which enables type-checking for JavaScript files.

You can comment `// @ts-nochcek` atop JavaScript files you want to skipped, or `// @ts-ignore` on certain lines to ignore type errors.

Since TypeScript 2.6, you can place `// @ts-ignore` comments above the offending lines.

```typescript
if (false) {
    // @ts-ignore: Unreachable code error
    console.log("hello");
}
```

Alternatively, you can comment `// @ts-check` atop JavaScript files you want to check, and run `tsc` without `--checkJs`.

Since 2.7
---------

### `--pretty`

`--pretty` uses colors to make error messages easier to read.
Since 2.9, `--pretty` will be enabled by default if the output device supporting colors.

Since 2.8
---------

### Conditional Types

TypeScript 2.8 introduces **conditional types**:

```typescript
T extends U ? X : Y
```

Examples (predefined conditional types):

```typescript
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type NonNullable<T> = T extends null | undefined ? never : T;

type ReturnType<T extends (...args: any[])> =
    T extends (...args: any[]) => infer R
        ? R
        : any;
type InstanceType<T extends new (...args: any[]) => any> =
    T extends new (...args: any[]) => infer R
        ? R
        : any;
```

`infer` declarations in the above code introduce a type variable to be inferred.
The inferred type can only be referenced in the true branch of the conditional type,
since in the false branch the condition test failed and the type probably cannot be inferred.

Since 2.9
---------

### `--resolveJsonModule`

This compiler option allows for importing types from `.json` files.

An example from the [release note][2.9 release note]:

```json
// settings.json

{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
```

```typescript
import settings from "./settings.json";

settings.debug === true;  // OK
settings.dry === 2;  // Error: Operator '===' cannot be applied boolean and number
```

[2.9 release note]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-9.html

Since 3.2
---------

### `--strictBindCallApply`

TypeScript 3.2 adds the `--strictBindCallApply` (in the `--strict` family),
enabling strong and strict type checking with `bind`, `call`, `apply` methods on function objects.
But `bind`, `call`, and `apply` cannot yet fully model generic functions or overloaded functions. Used on a generic function, type parameters will be erased to empty object type (`{}`). Used on an overloaded function, TypeScript will use the last overload.

### Conclusion

`tsconfig.json`:

```json
{
    "compilerOptions": {
        "strict": true,
        "noUnusedParameters": true,
        "noUnusedLocals": true,
	    "noImplicitReturns": true,
	    "noFallthroughCasesInSwitch": true,
        "skipLibCheck": true,
        "allowJs": true,
        "checkJs": true,
        "target": "es2017"
    }
}
```

Target:

0. ES3 is the default target of TypeScript.
1. ES5 for Opera 12.10 (Opera with Presto engine).
2. ES2017 for FireFox 52 ESR (legacy add-ons) and iOS 10.3 (iPhone 5, iPhone 5C, iPad 4).
3. ES2018 for recent browsers.
