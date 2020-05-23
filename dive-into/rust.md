# Dive into Rust

## Variable Shadowing

```rust
let mut guess = String::new();

io::stdin().read_line(&mut guess)
    .expect("Failed to read line");

let guess: u32 = guess.trim().parse()
    .expect("Please type a number!");

const CONSTANT: &str = "a constant expression, not the result of a function call computed at runtime";
let immutable_variable: &str = "variables are immutable by default";
let mut mutable_variable: u32 = 0;
let immutable_variable: &str = "shadowing the previous immutable_variable, which is bad";
let immutable_variable: u32 = 1;
```

## Data Types

### Scalar Types

- Integer: `i8`, `i16`, `i32`, `i64`, `i128`, `isize` and their unsigned counterpart `u8`, ..., `usize`. `isize` is `i32` on 32 bit systems and `i64` on 64 bit systems. Integer types default to `i32`. Compiling in debug mode will check for integer overflows. Relying on integer overflow’s wrapping behavior is considered an error, use the `Wrapping` type instead.
- Floats: `f32` and `f64`.
- Boolean: `bool` (values: `true` and `false`).
- Character: `char` (Unicode Scalar Value).

### Compound Types

- Tuple: tuple index must be written as a decimal literal, e.g. `(0, 1, 2).1`.
- Array: can be considered as a tuple whose elements all have the same type. Index out of bounds is a *runtime* error though.

## Control Flow

Condition *must* be a `bool`.
Nice!

## Enum

Rust's enum is actually a tagged union.

## Generics

Rust monomorphizes code that is using generics at compile time.

## Traits

Rust's traits is similar to interface in other languages.

## Memory Management

Rust does not use GC or RC.
For values on the heap, it only allow one variable "own" a value at a time.
Assignment, passing a value to function and returning a value move the "ownership".
Also, Rust allows multiple immutable pointers (`&`) but only one mutable pointer (`&mut`),
and restricts mixing immutable and mutable pointers to the same target.
The basic idea is to keep the number of reference to a value to one,
to make memory management easier for the compiler.

```rust
let s1 = String::from("A long long string");
let s2 = s1 + ".";
```

Conceptually s2 can be considered as a newly constructed immutable variable,
but since the ownership moves from s1 to s2, and s1 becomes invalid afterwards,
the compiler just need to appends `"."` to the end of the value, which is efficient.

Smart pointers can be used for reference counting.
Smart pointers are structs satisfying `Deref` and `Drop` traits.

```rust
enum List {
    Cons(i32, Box<List>),
    Nil,
}
```

In the above example, `Box<List>` is a smart pointer.
We use `Box<List>` to store the `Box<List>` data on the heap,
otherwise `Cons(i32, List)` will result in infinite size on the stack,
which causes Rust failed to construct the `List` enum.

To allow `cons` more than one lists from a same base list:

```rust
enum List {
    Cons(i32, Rc<List>),
    Nil,
}
```

`Rc` is another smart pointer for reference counting.
It increases the reference counter on `RC::clone(&l)`,
and reduce the reference counter automatically when the related variable goes out of scope.
When there are zero references, the value will be cleaned up.

Be aware that `Rc` only works in single-thread context.
In multiple-threads context, use `Arc` instead.

In Rust, functions and struts working with references need lifetime annotation.
However, Rust can infer function lifetime in simplest cases:

- If there is only one reference input parameter, then its lifetime will be the lifetime of output values.
- If there are multiple reference input parameters, but one of them is `&self` or `&mut self`, then its lifetime will be the lifetime of output values.

String literals have a `'static` lifetime, which lives for the entire duration of the program.

```rust
let b;
{
    let a = "hi";
    b = a;
}
println!("{}", b); // prints "hi"
```

Lifetime annotation tells Rust compiler the lifetime of variables,
but it cannot alter the lifetime.

## Testing

While Go use special function name `TestXxx`, Rust uses `#[test]` attribute annotation.

Unit tests are written in `mod tests`, and integration tests are put in the `test` directory.

## Documentation Comments

Three leading slashes `///` with Markdown.

Similar to Python, Rust also supports doctest:

```rust
/// # Example
///
/// ```
/// let foo = "foo";
/// assert_eq!(foo, "foo");
/// ```
```

## unsafe

In the unsafe block (`unsafe {}`), you can:

- Dereference a raw pointer which

    * can have both immutable and mutable pointers or multiple mutable pointers to the same location;
    * is not guaranteed to point to valid memory;
    * can be null;
    * does not implement any automatic cleanup.

- Call an unsafe function or method (`unsafe fn dangerous() {}`, including foreign functions such as C functions).

- Access or modify a mutable static variable (Rust call global variables as static variables).

- Implement an unsafe trait.

- Access fields of an union (the unsafe counterpart of Rust's `enum`, mainly used for FFI).