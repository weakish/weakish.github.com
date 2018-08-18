Basic OCaml
===========

Types
-----

- **unit** `()`
- **bool** `true`, `false`
- **int** `min_int ... -1 0 1 2 ... max_int` (63-bit signed integers on a 64-bit machine)
- **char** `'c' ...` (8-bit byte)
- **string** `"a sequence of char"`
- **float** `min_float ... 0.0 ... max_float` (`double` in C)
- **option** `type 'a option = None | Some of 'a`
- **io** `in_channel`, `out_channel`

Operators
---------

- arithmetic operators for integers: `+ - * / mod`
- arithmetic operators for floats: `+. -. *. /. **`
- comparison: `= < <= > >= <>` and `== !=`
- logical operators: `&&`, `||`, `not`, `if ... then ... else ...`, `if ... then ...`
- tuples: `(a, b)`
- cons: `a :: (b :: [])` (`[a; b; c]`)
- concat: `string1 ^ string2`, `[a; b] @ [c; d]`

Wrapping an operator in parentheses to form a function:

```ocaml
(+) 1 2;;
```

Names
-----

- `let name = expression`
- `let name1 = expression1 in let name2 = expression2 in ...`

Pattern Matching
----------------

```ocaml
match x with
  | 0 | 1 -> 1
  | _ -> x
```

Pattern matching multiple values:

```ocaml
match x, y with
  | 0, 0 -> true
  | _, _ -> false
```

Nested pattern matching:

```ocaml
match x with
  | 0 ->
    begin match y with
      | 0 -> 0
      | _ -> x
    end
  | 1 -> 1
```

`begin ... end` is a syntax sugar for `( ... )`.

Guarded patterns:

```ocaml
match x with
  | x when x <= 0 -> 1
  | _ -> x * f (x - 1);;
```

Alias patterns (`as`):

```ocaml
let rec fib = function
  | (0 | 1) as i -> i
  | i -> fib(i-2) + fib(i-1);;
```

Matching character intervals:

```ocaml
let alphanum c = match c with
  | 'a'..'z' | 'A'..'Z' -> "letter"
  | '0'..'9' -> "number"
  | _ -> "other";;
```

Matches should be exhaustive and reachable,
otherwise the compiler will emit a warning.

Matching against floating-point values is rarely used
because of numerical issues.

Also, name binding (`let`) uses pattern matching under the hood.

```ocaml
let (a,b,c) = (1, true, 'A');;
```



Functions
---------

- Anonymous function: `fun parameter -> body`
- Shortcut for pattern matching: `function [] -> 0 | _::rest -> 1 + length t`
- Named function: `let name parametr1 paremeter2 -> body`
- Recursive function: `let rec name parameter -> body`
- Recursive value: `let rec infinite_list = 1 :: 1`
- Mutually recursive function: `let rec f x = ... and g y = ...`
- Type constraining: `let id (x: int): int = x`
- Define void functions: `let void_function () = body`
- Call void functions: `print_newline ()`
- No main function, `let () = body` ensures body is side-effect only
- Labelled parameters: `let f ~x ~y = x - y;; f ~y:2 ~x:1;;`
- Optional parameters: `let f ?(x=1) y = x - y;; f ~x:3 2;;`

Optional parameters use pattern match under the hood:

```ocaml
let f ?x y =
  let x = match x with None -> 1 | Some n -> n in
    x - y;;

f ?x:(Some 3) 2;;
```

This 'raw' syntax can be used to delegate default behavior
from a wrapper function to the wrapped function:

```ocaml
let f' ?x y = f ?x y
```

Optional parameters are always called as named parameters.
To support partial application (currying),
optional parameters should always be followed by not-optional parameters in declaration.

Because optional parameters applications reuse
the syntax of named parameters,
the type of a higher-order function may be ambiguous.
The compiler will always prefer to infer that a parameter is labeled, not optional.
If optional parameter is wanted, type need to be specified explicitly.

Types
-----

- type definition: `type name = type expression`
- with parameters: `type 'a name = type expression`
- records: `type name = { field: type }`
- sum type: `type name = | S | T of ...`

Unlike functions, type declaration is recursive by default.


Exception
---------

- `exception ExceptionName`
- `exception ExceptionWithExtraInfo of type`
- `raise ExceptionName`: type of `raise` is `exn -> 'a` which seems impossible because it never returns at all. Returning `'a` allows throwing an exception anywhere in a program.
- `try ... with ...`
- `failwith "string"`: `raise (Failure "string")` (predefined)
- `Invalid_argument` is like `Failure` but mainly used for programming bugs
- `assert (boolean)`:  `boolean || raise (Assert_failure ...)`
- `assert false` is similar to `raise Invalid_argument`

Mutability
----------

### Reference

- `'a ref`: `type 'a ref = { mutable contents: 'a }`
- `let p = ref 0`
- `p := 1`: `p.contents <- 1`
- `!p`: `p.contents`
- `let np = ref 1`: `let np = {p with contents=1}`

### Array

- `[|1; 2; 3|]`
- `Array.make length init`, `Array.length`
- `arr.(i)`, `arr.(i) <- e`

### Loop

- `while condition do expression done`
- `for name = start to/downto end do expression done`

Lazy
----

- Construct a lazy value: `let name = lazy expression`
- Returns the value (calculated on demand): `Lazy.force name`

Module
------

- `Module.function` or `open Module` to use unqualified names
- access record field wrapped in module: `t.Module.field`
- module file: normal OCaml files `.ml`
- interface: `val f : int -> int` in `.mli` files

Example: `set.mli`

```ocaml
(* Abstract type *)
type 'a set
(* Concrete type to make it explicit what is a choice,
since simply writing

    type 'a choice

is not informative.
Also, exposing concrete implementation allows client code
to pattern match against choice.

`set.ml` must repeat this definition.
*)
type 'a choice =
  | Element of 'a
  | Empty
(* declare types for public values *)
val empty : 'a set
val contains : 'a set -> 'a -> bool
(* optional and labeled parameters *)
val add : ?elem:'a -> a_set:'a set -> 'a set
val choose : 'a set -> 'a choice
```

Or embed modules in a file:

```ocaml
module Set : sig
  type t
  val ...
end = struct
  type t = ...
  let ...
end
```

Or separate signature and implementation (allow different implementations):

```ocaml
module type Set = sig
  include (module type of OtherModule)
  type ...
  val ...
end

module type ListBackend = struct
  include OtherModule
  type ...
  let ...
end

module SetOnList : Set = ListBackend
```

By convention, the primary type of a given module `M` is called `t`.
And functions in `M` that take a value of `M.t` takes it as their first argument.

Get Started
-----------

### Install

    sudo apt-get install ocaml-nox opam curl build-essential m4

### Compile

For a single file:

    ocamlopt -strict-sequence -o x x.ml

`-strict-sequence` forces the left-hand part of each sequence to have type unit,
thus `a; b; c` is equivalent to:

```ocaml
let () = a in
let () = b in
c
```

For debugging, compile to byte-code,
which is also faster to compile,
also turning on all warnings
and adding debug information
(required to run `ocamldebug` and to print stack backtraces)

    ocamlc -wA -g -o x x.ml
    ocamldebug ./x

For a project (automatically finding modules, etc.):

    ocamlbuild -strict-sequence x.native

### OPAM

Initialize (run once):

    opam init

### Standard Library

OCaml's Standard Library is developed for use in bootstrapping the compiler,
and is purposefully kept small and simple.

The general-purpose 'standard' library is
the Core distribution provided by Jane Street.

    opam install core

### REPL

The built-in repl `opam` lacks features such as history and completion.
Use `utop` instead (shipped with `core`):

    utop

### Editors

Merlin is an editor service that provides modern IDE features:

- context-sensitive auto-completion
- interactive type-querying
- highlight parts of code that don't compile on the go
- goto definition

Install it via opam:

    opam install merlin
    # Auto configure Emacs and Vim
    opam user-setup install

Supported editors:

- Emacs
- Vim
- Acme
- Atom
- VS Code
- Sublime Text 3

`ocp-indent` can indent opam code automatically
(available via `opam`).

References
----------

1. Xavier Leroy. [Polymorphism by name for references and continuations][call-by-name]. In _20th symposium Principles of Programming Languages_, pages 220-231. ACM Press, 1993.

[call-by-name]: http://gallium.inria.fr/~xleroy/publi/polymorphism-by-name.pdf
