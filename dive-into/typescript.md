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

Example
-------

```typescript
class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = new Student("Jane", "M.", "User");
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

https://github.com/HerringtonDarkholme/typescript-repl
