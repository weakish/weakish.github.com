# Dive into Rust

wip

## Syntax

```rust
// macro
my_macro!("para");

my_function("para);

// shadow

let mut guess = String::new();

io::stdin().read_line(&mut guess)
    .expect("Failed to read line");

let guess: u32 = guess.trim().parse()
    .expect("Please type a number!");

// variables
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
- Character: `char` (Unicode Scalar Value). `char` can represents a lot more Unicode characters than the `char` type in a lot of programming languages (just ASCII), but it is not the true Unicode character (Unicode Extended Grapheme Cluster, the `Character` type in Swift).

### Compound Types

- Tuple: tuple index must be written as a decimal literal, e.g. `(0, 1, 2).1`.
- Array: can be considered as a tuple whose elements all have the same type. Index out of bounds is a *runtime* error though.

## Control Flow

Condition *must* be a `bool`.
Nice!

## Memory Management

Rust does not use GC or RC.
For values on the heap, it only allow one variable "own" a value at a time.
Assignment, passing a value to function and returning a value move the "ownership".
Also, Rust allows multiple immutable pointers (`&`) but only one mutable pointer (`&mut`),
and restricts mixing immutable and mutable pointers to the same target.
The basic idea is to keep the number of reference to a value to one,
replacing reference counting with reference moving.

```rust
let s1 = String::from("A long long string");
let s2 = s1 + ".";
```

Since the ownership moves from s1 to s2, .
Conceptually s2 can be considered as a newly constructed immutable variable,
but since the ownership moves from s1 to s2, and s1 becomes invalid afterwards,
Rust just need to appends `"."` to the end of the value, which is efficient.

In Rust, functions and struts working with references need lifetime annotation.
However, Rust can infer function lifetime in simplest cases:

- There is only one reference input parameter, then its lifetime will be the lifetime of output values.
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

## Enum

Rust's enum is similar to ADT in other languages.

## Generics

Rust monomorphizes code that is using generics at compile time.

## Traits

Rust's traits is similar to interface in other languages.

## Testing

While Go use special function name `TestXxx`, Rust uses `#[test]` attribute annotation.

Unit tests are written in `mod tests`, and integration tests are put in the `test` directory.

