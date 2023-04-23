Kotlin coding style
===================

## Use `when` expressions for cases, avoid other usage of `when`

Avoid use `when` statement, which is not exhausted.
Just use `if ... else if ...`.

Kotlin uses `when` for both `case` and `cond`, which is confusing.
Thus avoid use `when` expression for `cond`.

## Avoid variadic functions

Kotlin uses `Array<T>` for `vararg p: T` underhood
but special array types for basic types, e.g. `IntArray` for `vararg p: Int`.

However, `p: Array<T>` and `vararg p: T` behaves differently.
In other words, given a function `Array<T> -> Unit`,
we do not know how to invoke it just from its signature.

`Array<T> -> Unit` may be an infix function,
but all infix functions can be invoked as normal functions.

## Avoid `object.invoke`

Without define `invoke` method for objects,
every time I see `CapsName(something)`,
I am sure it will return an instance of `CapsName`,
nothing else.

If we use lower case for object name,
then once we see `lowerCase(something)`,
we may think it is a function.
But we can pass neither `lowerCase` nor `::lowerCase` to a higher-order function.

## Avoid `return` in lambda.

Control flow `return` in lambda returns the outer function.
This is confusing.

## Reduce using component object

Kotlin supports top level functions, often cleaner than component objects.

## Reduce using normal function

They are not first-class:

- They have to be referred as `::f`.
- And invoking them requires intermediate variable (`::f()` won't walk).
- Only `Foo::bar` is referable. [`foo:bar` is not supported.][#5]

[#5]: https://github.com/Kotlin/KEEP/issues/5

Use `val f = fun()...` except for:

- `main`
- `inline` for reified generics
- `tailrec`

## Annotate `@Throws`

- for documentation
- for calling in try catch clause from Java

## Overload operators consistently

Overloading an operator should be consistent to all types supporting the operator.

## Reduce using infix functions

Infix functions provides a new syntax of function call, similar to operators.

Only use infix functions when they are obviously cleaner than non infix form.