# OCaml Basic

## Types

- **unit** `()`
- **bool** `true`, `false`
- **int** `min_int ... -1 0 1 2 ... max_int` (63-bit signed integers on a 64-bit machine)
- **char** `'c' ...` (8-bit byte)
- **string** `"a sequence of char"`
- **float** `min_float ... 0.0 ... max_float` (`double` in C)
- **option** `type 'a option = None | Some of 'a`
- **io** `in_channel`, `out_channel`

## Operators

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

## Names

- `let name = expression`
- `let name1 = expression1 in let name2 = expression2 in ...`

## Pattern Matching

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

## Functions

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

## Types

- type definition: `type name = type expression`
- with parameters: `type 'a name = type expression`
- records: `type name = { field: type }`
- sum type: `type name = | S | T of ...`

Unlike functions, type declaration is recursive by default.

## Exception

- `exception ExceptionName`
- `exception ExceptionWithExtraInfo of type`
- `raise ExceptionName`: type of `raise` is `exn -> 'a` which seems impossible because it never returns at all. Returning `'a` allows throwing an exception anywhere in a program.
- `try ... with ...`
- `failwith "string"`: `raise (Failure "string")` (predefined)
- `Invalid_argument` is like `Failure` but mainly used for programming bugs
- `assert (boolean)`:  `boolean || raise (Assert_failure ...)`
- `assert false` is similar to `raise Invalid_argument`

## Mutability

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

## Lazy

- Construct a lazy value: `let name = lazy expression`
- Returns the value (calculated on demand): `Lazy.force name`

## Module


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

## Get Started

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

## Code Example

```ocaml
(* FUNCTIONS *)

(* Floats use different operators. *)
let pi = 4.0 *. atan 1.0

(* Global type inference. *)
let square = fun x -> x *. x

(* Functions are by default non-recursive.
Recursion need to be explicit (with `rec`).
*)
let rec fact = fun n ->
  match n with (* pattern matching *)
  | 0 | 1 -> 1
  | _ -> n * fact (n - 1)
(* The compiler will emit a warning if
pattern matching is not exhaustive,
or contains unreachable matches.
*)

(* Mutually recursion with function declaration shortcuts. *)
let rec sort = function
  | [] -> []
  | first :: rest -> insert first (sort rest)
and insert element a_list = match a_list with
  | [] -> [element]
  | first :: rest ->
    if element <= first then
      element :: a_list
    else (* the else clause has the same type as the then clause *)
      first :: insert element rest
(* `sort` and `insert` is polymorphic.
They can be applied to lists of any type,
and returns a list with the same type.

`sort` and `insert` does not modify their input list.
Lists are immutable, like most data structures in OCaml.
*)

(* OCaml provides the `|>` operator to flip function and its parameter.*)
let rec fact' = function
  | 0 | 1 -> 1
  | n ->
    n
    |> (-) 1 (* Convert infix operator to prefix function call. *)
    |> fact
    |> ( * ) n (* Spaces to avoided be recognized as comments. *)
(* It can easily be defined as a higher-order function. *)
let (|>) f x = x f

(* `|>` operator makes refactoring (changing numbers and order of argument) harder,
thus intemediate variables are often preferred. *)

(* TYPES *)

(* Type Aliases *)
type boolean = bool
type integer = int
type double = float
type character = char
type sequence_of_bytes = string

(* Records *)
type point = {x: float; y: float}
let new_point x y = {x; y}

(* Here type annotations can be omitted.
However, it is a good practice to annotate types for records in real projects,
because OCaml infer record types from field names.

In real projects, declaration of the distance function may be far from
the declaration of the point type.
And later declaration of a new record with the same field names may be added
between the declaration of type point and function distance,
which will cause type error of the distance function
if the fields of the new record have different types,
or change the semantics of function distance silently
if the fields of the new record have same types as type point.
*)
let distance (from: point) (target: point) =
  ((from.x -. target.x) ** 2.0 +. (from.y -. target.y) ** 2.0) ** 0.5

(* We cannot make function new_point also accepts integer values (will be converted to floats.
OCaml's type system does not allow this.
However, types can be wrapped/tagged with a type constructor,
and the wrapped/tagged types can be combined to disjoint unions.
This is called polymorphic variants.
*)
type number = [`Integer of int | `Float of float]
let new_point_polymorphic (x: [< number]) (y: [< number]): point =
  match x, y with
    | `Integer m, `Integer n -> {x = float_of_int m; y = float_of_int n}
    | `Integer m, `Float n -> {x = float_of_int m; y = n}
    | `Float m, `Integer n -> {x = m; y = float_of_int n}
    | `Float m, `Float n -> {x = m; y = n}

(* Unlike the closed [< `A | `B], [> `A | `B] is structural typing,
opening to any type that can at least match `A and `B.
Both of them can only be denoted directly, not be given a name via `type`.
And [`A | `B] is fixed type.

- [< `A | `B | `C]: [< `B | `A | `C], [< `C | `A], [`A | `B | `C], [`B]
- [> `A | `B ]: [> `A | `C | `B], [`A | `B | `C], [> `A | `B], [`B | `A]
- [`A | `B]: [`B | `A]

A | B is normal variant type:

- It cannot be denoted directly. To use it, it has to been given a name.
- Once the name is given, A and B is assigned to a unique type. In other words,
  `type one_name = A | B` and `type another_name = A | B` are not compatible.

Normal variants are slightly lighter than polymorphic variants,
since static information allows for more optimizations.
However noticeable differences would only appear on huge data structures.
*)

(* Recursive Types *)
type 'a binary_tree = (* 'a is a type variable, and stands for any given type. *)
  | Leaf
  | Node of 'a * 'a binary_tree * 'a binary_tree
  (* The `*` character is used
  because the set of all pairs of type `t * s`
  corresponds to the Cartesian product of
  the set of elements of type `t` and the set of elements of type `s`.
  *)

(* IMPERATIVE FEATURES *)

let increse_array arr =
  let length = min (Array.length arr) 3 in
  let incresements = [|1; 2; 3|] in
  let result = Array.make length 0 in (* 0.0 is initial value *)
  for i = 0 to length - 1 do
    result.(i) <- arr.(i) + incresements.(i)
  done; (* `a ; b` returns `b` *)
  result

type mutable_point = { mutable x: float; mutable y: float }
let translate p dx dy =
  p.x <- p.x +. dx; p.y <- p.y +. dy;;

(* OCaml standard library provides references, which mimics mutable variables. *)
type 'a reference = { mutable contents: 'a }
let ref initial_value = { contents = initial_value }
let (:=) r new_value = r.contents <- new_value
let (!) r = r.contents

(* Store a polymorphic function as a mutable field in a record. *)
type idref = { mutable id: 'a. 'a -> 'a }


(* MODULE *)

(* OBJECT *)
class point_1d init =
  object (self)
    val mutable x = init
    method get_x = x
    method move d = x <- x + d
    (* Private methods can only be invoked from other methods of the same object. *)
    method private move_one = self#move 1
    (* Initializer is an anonymous hidden method
    Initializers cannot be overridden.
    On the contrary, all initializers are evaluated sequentially.
    *)
    initializer print_string "new 1d point at "; print_int x; print_newline ()
  end

class positive_1d_point init =
  object (self)
    inherit point_1d init
    (* Private methods are inherited (they are by default visible in subclasses),
    unless they are hidden by signature matching.
    *)
    method virtual move_one : _
    (* Private methods can be made public in a subclass. *)
    method is_positive = self#get_x > 0
  end

let strings = ref []

(* Immediate objects are like anonymous classes in Java. *)
let immediate_object =
  object (self) (* `self` could be any identifier. It is a convention to use `self`. *)
    val mutable x = "Immediate objects are like anonymous classes in Java."
    method get_x = x
    method set_x new_value = x <- new_value
    method print = print_string self#get_x
    method register = strings := self :: !strings
    (* Putting self into an external reference is not allowed,
    as it would forbid extending the class through inheritance.
    However, since immediate objects are not extensible,
    there is no such restriction for immediate objects.
    *)
  end

(* Virtual classes are like abstract classes in Java.
Virtual classes cannot be instantiated.
*)
class virtual abstract_number init =
  object (self)
    val mutable virtual x : int
    method virtual get_x : int
    method virtual move : int -> unit
    method print = print_int self#get_x
  end

(* Multiple Inheritance *)
class painter (name: string) = object
  val mutable name = name
  method get_name = name
  method draw = print_string "I am painting."
end

class cowboy (name: string) = object
  val mutable name = name
  method get_name = name
  method draw = print_string "I am fighting."
end

class painter_and_cowboy (init: string) = object
  inherit painter (init ^ " as a painter") as painter
  (* cowboy overrides variable name and method draw of painter.
  Thus `inherit!` is used instead of `inherit`.
  *)
  inherit! cowboy (init ^ " as a cowboy") as cowboy
  method dual_draws =
    painter#draw;
    cowboy#draw
end

(* Parameterized Classes *)

(* Classes stores its value as a reference under the hood,
thus it should be monomorphic or parametric.
The painter and cowboy classes above are monomorphic.
*)

class ['a] (* Class type parameters are listed between [ and ]. *) parametric_class
  (init: 'a) = object
    val mutable x = init
    method get_x = x
    method set_x new_value = x <- new_value
  end

(* Constraints *)
class ['a] circle (c: 'a) (r: float) = object
  constraint 'a = #point_1d
  val mutable center = c
  method move = center#move
  method perimeter = 2.0 *. pi *. r
end

(* Polymorphic Methods *)

class ['a] intlist (l : int list) =
    object
      method empty = (l = [])
      method fold f (accu : 'a) = List.fold_left f accu l
    end

(* Objects themselves are not polymorphic,
so first use of `fold` fixes its type.
*)

(* To make `fold` polymorphic, annotate its type explicitly: *)
class intlist' (l : int list) =
    object
      method empty = (l = [])
      method fold : 'a. ('a -> int -> 'a) -> 'a -> 'a =
        fun f accu -> List.fold_left f accu l
    end

(* However, type annotation can be omitted if it is already known,
for example, through type constraints on self.*)
class type ['a] iterator = object
  method fold : ('b -> 'a -> 'b) -> 'b -> 'b
end

class intlist'' l =
    object (self : int #iterator) (* implements iterator interface *)
      method empty = (l = [])
      method fold f accu = List.fold_left f accu l
    end

(* Another example of interfaces. *)

class type point0 = object
  method get_x : int
end

class distance_point x =
    object
      inherit point_1d x
      (* Unlike Java, the type of `other` cannot be `#point0` directly,
      since the HM type system OCaml uses has difficult to infer subtypes.
      Just like using parametric types to mark subtyping expilicitly,
      here `'a. (... as 'a)` is used to mark the extensible part of `#point0`.
      *)
      method distance : 'a. (#point0 as 'a) -> int =
        fun other -> abs (other#get_x - x)
    end

(* Credit: this section uses code examples from OCaml manual. *)

(* In Ocaml, inheritance does not imply subtyping.
Coercions are required for inherited types,
as for uninherited types.
*)


(* Labeled Arguments *)

let named_arguments ~x ~y = x + y

(* Functions with labeled arguments are nominal, not structral.
Thus `2 |> (fun ~x -> x)` does not work.
Same applies to functions with optional arugments (see below),
except that OCaml can auto transform them
by passing `None` for all optional arguments.
*)

(* Optional Arguments *)

let inc_multiple_times ?(times=1) x = x + 1 * times

(* To avoid ambigulity with partital application,
optional arguments must be followed by at least one non optional argument.
*)

let dummy_argument ?(x=1) () = x


let () = (* To ensure the body is side-effect only, i.e. returning unit. *)
  let a_point = new point_1d 42 in
  print_int a_point#get_x; print_newline ();
  a_point#move 1;

  let john = new painter_and_cowboy "john" in
  print_string john#get_name (* cowboy *); print_newline ();
  john#draw (* cowboy *); print_newline ();
  john#dual_draws; print_newline ();

  (* Labeled arguments must always be applied with its name. *)
  let four = named_argumests ~y:2 ~x:2

  (* Optional arguments must be either omitted or applied with its name. *)
  let two = inc_multiple_times 1;
  let five = inc_multiple_times ~times:5 1;
  let one = dummy_argument ();
  let three = dummy_argument ~x:3 ();

  exit 0
```