Complains on  languages
-----------------------------

We have complains. And we also have workarounds since some programming languages have huge amount of libraries or particular use case.

## Forth

- Not straightforward.
- Outdated.

## C

- Manual memory management.
- Verbose type declaration.
- Null pointer.

Workaround: short and simple programs only.

## C++

- Manual memory management.
- Too complex, not straightforward.

## Java

- Not straightforward.
- Too many classes.
- Design patterns.
- Generics erasure.

Workaround: short and simple programs only. Use Ceylon/Kotlin.

## ML/OCaml/Rust/Scala

- HM style type system.

Workaround: Rust is still very young. Scala is still young. We may need workaround for them in future, but not now.

## Haskell

- Hide side effects.
- Lazy evaluation by default.
- HM style type system.

## Go

- Implicit implemented interface.
- Nil pointer and empty interface.
- Interfaces to pass functions (well, at least better than pass function as pointers).
- Multiple return values for error handling.
- No generics.
- Immature GC.

Workaround: no need yet.

## PHP

- No comment.

## Perl

- Too complex.
- Mixed arbitrarily with designs from different periods.

## Python

- Python 2 and Python 3.
- Quality of standard library is low. Fortunately there are often better alternatives.
- No tail recursion.
- Literal `lambda` is too limited. Fortunately every `def` functions can be used as closure.
- Multiple inheritance of classes.
- Whitespace sensitive.

Workaround:

- Stick to Python 2 now. Use `python-modernize` or `six` for compatibility with Python 3.
- Use third party libraries, e.g. `requests` instead of `urllib`.
- Use `reduce` etc.
- Avoid multiple inheritance of classes.
- Use [Hy](hylang.org).

## Ruby

- Complex. For example, for functions there are methods, procs and blocks:
  for methods there are `def` and `define_method`; for procs there are `proc`,
  `Proc.new` and `lambda`; and blocks are neither methods nor procs -- they
  are even not objects! Another example is `begin "code executed" end while
  false`  and `"code not executed" while false`.

Workaround: Stick on strict code style, only use some parts of Ruby.

## JavaScript

- A lot of bad parts.

Workaround: use CoffeeScript and so on instead.

## CoffeeScript

- Still few quirks from JavaScript.
- Whitespace sensitive.

## TypedScript

- Being a superset of JavaScript, it has all the quirks of JavaScript.
- Facebook's flow also offers type checking, and it [supports annotation in
  comments][flow-comments-annotation]. So a lot of languages which compiled to
  JavaScript will be supported. (Though both TypeScript and flow supports
  writing header files for existing JavaScript files.)

[flow-comments-annotation]: http://flowtype.org/blog/2015/02/20/Flow-Comments.html

## Node/io

- Verbose call backs everywhere.

## Lua

Nice.

## Erlang

- Generally good. A few quirks cannot be removed because of backward compatibility.
- Its use case is somehow limited to scalable real time applications.

Workaround: use elixir.

## Elixir

- Share Erlang's use case.

Workaround: Use it as its intended.

## Racket

Nice.

## Hy

Nice.

## Clojure

- Somehow too much emphasis on immutability and laziness.









