# Learn Rust

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

- Tuple
- Array: can be considered as a tuple whose elements all have the same type. Index out of bounds is a *runtime* error though.

## Control Flow

Condition *must* be a `bool`.
Nice!