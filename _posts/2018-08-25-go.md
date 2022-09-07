# Go Coding Style

Be careful when indexing slice
------------------------------

Index out of bounds are not checked at compile time
for slices (including strings, a.k.a. slices of bytes).

You may consider using the [indexing functions][gosugar-slice] from the gosugar package instead,
which will automatically check slice length for you.

[gosugar-slice]: https://github.com/weakish/gosugar/blob/master/slice.go

Functions, interfaces, pointers may be `nil`
--------------------------------------------

The compiler does not check nullability for functions, interfaces, and pointers.

Thus, any function taking a function, an interface, or a pointer,
need to check whether input is `nil` itself.
Since all methods implicitly accepts a pointer,
all methods should check whether its receiver is `nil` or not.
Though, if you are careful enough, you may omit checking nullability in unexported functions.

You can use the [RequireNonNull] function from goaround package
to check every not nullable parameters,
which will panic if the parameter passed in is `nil`.

[RequireNonNull]: https://github.com/weakish/goaround/blob/master/null.go

Explicitly check type implementing interface at compile time
---------------------------------------------------------------

Use the `var _ Interface = (*Type)(nil)` trick.


Stay clear. Stay explicit.
--------------------------

- Use naked return sparingly, e.g. in very short functions with single exit point. Alternatively, always use explicit return. 
- Do not omit top level type names in map literals.

Only use head statement in `if` to declare variables
---------------------------------------------------

Like `for`, the `if` statement can start with a short statement to execute before the condition.
This often harms readability thus it should only be used to declare variables to limit their scope.

The same applies to `switch`.

Only use switch for cases
-------------------------

In Go, `switch` can be used for both `case` and `cond`.
To avoid confusion, I always use `switch` for `case`.
I use `if ... else if` instead of `switch` for `cond`.

Only use defer for cleanups
---------------------------

Use `defer` carefully.

Do not rely on zero values
--------------------------

Do not rely on Go's default initialized value.
Initialize it explicitly instead if the value is intended to be used later.

The program should be semantically equivalent if Go changed zero values of default initialization.

Similarly, always check presentence when retrieving elements from a map.
For example, if you want to retrieve an integer from a map,
and use `0` if the key is missing:

```go
element := m["id"]
```

The above code utilizes the zero value of missing keys.
This makes the code shorter,
but less clear (The value is absent? The value happens to be zero?)

Verbose and explicit code is preferred:

```go
element, present := m["id"]
if present {
    return element
} else {
    return 0
}
```

Since Go will always initialize zero value on declaration,
the compiler will not complain declaration without initialization.
Thus, we should initialize variable on declaration whenever possible.

For example:

```go
var s string
if x < 0 {
    s = "0"
} else {
    s = "1"
}
```

We can extract it as a function:

```go
func f(x int) {
    if x < 0 {
        return "0"
    } else {
        return "1"
    }
}

var s string = f(5)
```

The compiler will check the function returns on all branches.

Do not use `%#q` in `printf`
----------------------------

There are more good things to remember than the special rules of `%#q`.
 
