// Anonymously-typed
declare var MyPoint: { x: number; y: number; };
// Interfaced-typed
interface Point { x: number; y: number; }
declare var AnotherPoint: Point;
// From a consumption side these declarations are identical,
// but the type `Point` can be extended through interface merging.

// Classes have two types: the instance type, and the constructor function type.
// We can declare them seperately in one class, or seperately.
//
// An example from Handbook
//
// Standrad
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

