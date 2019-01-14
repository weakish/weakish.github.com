Backward compatibility
----------------------

TypeScript is a strict superset of ECMAScript 2015,
which is a superset of ECMAScript 5, commonly referred to as JavaScript.

Primitive types
---------------

`number` (float point), `boolean`, `string`, and `any` (dynamically-typed).

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
TypeScript's `Object` is more similar to `Any` in other languages.


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

You can use [typings] (a npm module) to search and install declaration files.

[typings]: https://github.com/typings/typings

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

Here `: {a: number, b: number}` is a type declaration, and it can be ommitted (inferred).
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

Below is a simplification of the `BasicCaculator` and `ScientificCaculator` example in Handbook.

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
Use `this` type will produce a long chain of inherience.
For example, if we want to add `Multiple`,
returning `this` type requires `Multiple` extends `Minus`.
Then what if we have a type `SomeGroup` can do `add` and `multiple`, but not `minus`?
Refine `minus` to throw an exception?
It is only a workaround on runtime and does not help compile time type check.
If `Add`, `Minus`, and `Multiple` are all interfaces,
then `SomeGroup` can simply implements `Add` and `Multiple`, but not `Minus`.
Same applies `BasicCaculator` and `ScinetificCalulator` in the Handbook example.

Overview
--------

```typescript
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
    // - arithemetic and binary operators applied to constant enum expressions
    //   (it is a compiler error if it is evaluated to `NaN` or `Infinity`).
    //
    // All other enum members are computed.
    L = "abc".length
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
// We need an addtional constructor function.
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
// the constructor function and all static memebrs of the class.
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
// consider a class declaration as an invokation of a class constructor,
// and "object is poorman's closure".


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

// hybird interface
interface BothFunctionAndObject {
    (x: number): number;
    name: String;
    print(): void;
}
function mainly_for_interop_with_javascript(): BothFunctionAndObject {
    const hybird = <BothFunctionAndObject>function (x: number) {}
    hybird.name = "hybird";
    hybird.print = () => { console.log("name"); } // fat arrow
    return hybird;
}

// We have seen fat arrows in the above code.
// More examples:
const identity = (x: number): number => { return x };
const shortcut_of_identity = (x: number) => x; // return type inferred
// Fat arrow is not just a syntax sugar for one liners,
// it fix JavaScipt's dynamic scoping `this`.
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

// TypeScript requires invokation arguments matching declaration arguments.
function two_arguments(x: number, y: number): number {
    return x + y;
}
const call_two_arguments = two_arguments(1); // Error: too few parameters
const call_two_arguments_again = tow_arguments(1, 2, 3); // Error: too many parameters

// In JavaScript, every parameter is optional (`undefined` if not givent).
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
// `(x: number, y?: numebr) => number`.

function default_before_required(default_parameter: number = 1, required: number): number {
    return default_parameter + required;
}
// Avoid the above since invokation is confusing:
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
// and TypeScript will narrow down to:
// - the type of the function’s prototype property if its type is not any
// - the union of types returned by that type’s construct signatures

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
// There is no number literal and boolean literal.


// TypeScipt supports `symbol` if the compilation target is ECMAScript 2015.
const a_symbol: symbol = Symbol("symbols are immutable");
const an_empty_symbol = Symbol();
const another_empty_symobol = Symbol();
console.log(`symbols are unique? ${an_empty_symbol !== another_empty_symobol}`);


// In TypeScript, just as in ECMAScript 2015,
// any file containing a top-level import or export is considered a module.
export const month_regex = /([0][0-9])|([1][0-2])/;
// If a file has a single `export function` or `export class`,
// consider using `export default`.
export default function main_function() {
    console.log('client uses `import anyname_they_like from "./main_function"');
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
// For simplicity, allways use `--moduleResolution Node`.

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
// By default, `tsc` will compiles seperate typescript files to individual javascript files.
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
// `tsc` will compile all files in the directory containning `tsconfig.json`
// and all files in its sub-directories.
// `exclude` and `files` will not prevent the compiler compile a file
// (not specfied in `files` or specified in `exclude`) when it is imported as a module.

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