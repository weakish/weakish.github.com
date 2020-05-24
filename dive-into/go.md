# Quick Introduction to Go

We're going to try to quickly show you enough of Go 1.14 to actually try it out.

A Syntax Derived from C
-----------------------

The main difference to C is type annotation after identifier.

```go
package main
import "fmt"

type Point struct {
	x float64
	y float64
}
func distance(from Point, to Point) float64 {
	return math.Pow(math.Pow(from.x-to.x, 2)+math.Pow(from.y-to.y, 2), 0.5)
}
// You can only declare a method with a receiver defined in the same package.
func (point Point) Dist(other Point) float64 {
    return math.Pow(math.Pow(point.x-other.x, 2)+math.Pow(point.y-other.y, 2), 0.5)
}

func main() {
    var point Point = Point{0.0, 0.0}
    var zero float64 = distance(Point{0.0, 0.0}, Point{2.0, 3.0}) - point.Dist(Point{2.0, 3.0})
    fmt.Println("The entry point of an executable must be a function named `main` in a package named `main`.")
```

Slice
-----

```go
names := []string{"Tom", "Dick", "Harry"} // inferred type `[]T`

// Go reuses `:=` instead of a dedicated keyword `in`.
// `_` is called blank identifier,meaning we are not interested in indices of the slice.
// BTW, if we are not interested in the loop values, we can just write `for range names`.
for _, name := range names {
    // Go does not have access modifiers.
    // Exported (public) names begin with a capital letter.
	fmt.Println("Hello, " + name + " !")
}
```

The slice uses an underlying array to store data.
The length of an array `[n]T` is part of its type, so arrays cannot be resized.
Thus slices are much more common than arrays.

```go
type slice struct {
    array unsafe.Pointer
    len   int // current length
    cap   int // capacity, the length of the underlying array
}
```

Go has a built-in `append` function to add elements to a slice, modifying the underlying array directly, or replacing the underlying array with a new one with a larger capacity.

```go
// pesudo code (pretend Go supports generics)
func append(slice []T, elements ...T) []T {
    for element := range elements {
        slice.len += 1
        if slice.len <= slice.cap {
            slice[len-1] = element
        } else {
            new_slice := make([]T, (slice.len+1)*2)
            copy(new_slice, slice)
            slice = new_slice
            slice[len-1] = element
        }
    }
    return slice
}
```

To create a new slice:

1. Use the slice expressions on an existing array: `a[n:m]`, `a[:m]`, `a[n:]`, and `a[:]`.
2. Slice expressions can also specify capacity, `a[n:m:k]` or `a[:m:k]`. `k` must be less than or equal to the capacity of the source slice or array.
3. The `make` allocates a zeroed array and returns a slice that refers to that array, e.g. `s := make([]int, 2, 5)`.
4. `var s []T` returns `nil`, the zero value of a slice. It has a length and capacity of 0 and has no underlying array.

Similarly, the zero value of a map is also `nil` (`var m map[K]T`).
And `make(map[K]T)` returns a map initialized and ready for use.

Since re-slicing a slice doesn't make a copy of the underlying array, the full underlying array will be kept in memory until it is no longer referenced.
Occasionally this can cause the program to hold all the data in memory when only a small piece of it is needed.
In that case, copy the data over to another new slice via `copy` or `append`.

### `make` and `new`

Normally Go has two ways to create a non-primitive:

1. Composite literals, e.g. `[]int{1, 2, 3}`, which creates an instance, are mostly used.
2. `new(T)` creates a zero value of `T` and returns a pointer `*T`, equivalent to `&T{}`.

However, slices are special.
As shown above, composite literals like `[]int{1, 2, 3}` work well with slices.
But `new([]int)` is rarely useful, since it only returns a pointer with zero value of a slice `nil`.
However, unlike other structures, a slice is not ready to use with its zero value.
To prepare a slice, we need to first create its underlying array.
Also, since slices are cheap and expensive as explained in next section, and modifying a slice automatically modifies its underlying array,
a pointer to a slice is rarely used.
Thus Go introduces a new built-in function `make` for this purpose.
`make([]int, 10, 100)` creates a slice ready to use, with underlying array allocated with zero values, and returns a slice, not a pointer to a slice.

Same applies to `maps` and `channels`.
And `make` applies only to slices, maps, and channels.

### Unsafe Pointer

The `array` field of the slice does not point to the underlying array.
Instead, it points to the first element of the underlying array.
This makes slicing as cheap and efficient as passing around explicit indexes.

However, this also means slice cannot utilize array's compile time bound checks.
Index out of range error with slices can only be checked at runtime.

Strings have the same issue since strings in Go are effectively slices of bytes.

Note that [Go Slices: usage and internals][go-slice] on [The Go Blog][blog] mentioned slice consists of a pointer to the **array**, the length of the segment, and its capacity.
Instead slice contains a pointer to the **first element of the array**.
The illusion below is correct (`ptr *Elem`).
In C, a pointer to an array is actually a pointer to the first element of an array.
So a pointer to an array and a pointer to the first element of an array are equivalent in C.
But this does not applies to Go.

[go-slice]: https://blog.golang.org/go-slices-usage-and-internals
[blog]: https://blog.golang.org

### Variadic Functions

Go supports variadic functions (splats arguments): `(ns ...int)`.

Flow Control
------------

### `for`

`for` is the only looping construct in Go.

```go
sum := 0
for i := 0; i < 10; i++ { // `i++` is a statement, not an expression.
	sum += i
}
for sum < 1000 {
	sum += sum
}
for {
    sum += sum
    if sum >= 1000 {
        break
    }
}
```

### `if` and `switch`

Like `for`, `if` and `switch` statements can start with a short statement to execute before the condition.
This is mainly used to declare variables to limit their scope until the end of the `if` (including `else` blocks).

```go
if v := math.Pow(x, n); v < lim {
	return v
}
switch os := runtime.GOOS; os {
    case "darwin":
        fmt.Println("macOS.")
    case "linux":
        fmt.Println("Linux.")
    default:
        fmt.Printf("%s.", os)
}
```

### `defer`

A `defer` statement defers the execution of a function until the surrounding function returns.

```go
file, _ := os.Open(path)
defer file.Close()
```

The deferred call's arguments are evaluated immediately, though.

Multiple deferred function calls are pushed onto a stack.
When a function returns, its deferred calls are executed in last-in-first-out order.

`defer` breaks the rule of natural order of execution.
Thus it should be restricted for cleanup operations.
Abusing `defer` disturbs the execution flow thus harming readability.

Basic Types
-----------

- `bool`
- `string`
- `int8`, `int16`, `int32`, `int64`
- `uint8`, `uint16`, `uint32`, `uint64`
- `int`, `uint`, `uintptr`: 32/64 bits wide on 32/64-bit systems
- `byte`: alias for uint8
- `rune`: alias for int32, represents a Unicode code point
- `float32`, `float64`
- `complex64`, `complex128`

The expression `T(v)` converts the value `v` to the type `T`.

Constants are declared with the `const` keyword, they can be character, string, boolean, or numeric values.
Numeric constants are high-precision values.
An untyped constant takes the type needed by its context.

```go
const Pi = 3.14
```

Type Aliases and Defined Type
-----------------------------

```go
type Boolean = bool
```

Now `Boolean` is an alternative spelling of `bool`.
They both denote the same type.

Be aware the difference between type aliasing and type declaration.
For example, these are type declarations:

```go
type IsPositive bool
type IsNegative bool
```

`IsPositive` and `IsNegative` are *named types* or *defined types*, with `bool` as their *underlying type*.
`IsPositive` and `IsNegative` are new types, different from any other type, including their underlying type `bool`.
Also, `IsPositive` and `IsNegative` are not assignable to each other,
because both of them are defined types.

> A value x is assignable to a variable of type T ("x is assignable to T") if one of the following conditions applies:
> ...
> x's type V and T have identical underlying types and at least one of V or T is not a defined type.

This is a great feature.
In many programming languages, it is best practice to name a boolean type with its "direction":

```go
var sex bool // bad
var isMale bool // good
```

In Go, I can go further:

```go
type IsMale bool
var isMale IsMale
```

And if I accidentally assign an unrelated boolean value or opposite directed boolean value to IsMale, the compiler will refuse to compile it.

Multiple Return Values
----------------------

A function can return any number of results, which is mostly used in error handling:

```go
val, err := someFunction()
if err != nil {
    return err
}
codeUsing(val)
```

To handle errors with multiple return values conveniently,
Go introduces two hacky features:

First, when `err` is not `nil`, `val` is assigned to the zero value of its type.
For problems on zero values, see next section.

Second, instead of writing

```go
val, err := f()
var newVal T
newVal, err = g()
```

Go allows us to 'reuse' the `err` variable:

```go
val, err := f()
newVal, err := g() // `err` is **re-assigned** here
```

Because in a `:=` declaration a variable `v` may appear even if it has already been declared, provided:

- this declaration is in the same scope as the existing declaration of `v`,
- the corresponding value in the initialization is assignable to `v`, and
- there is at least one other variable in the declaration that is being declared anew.

Introducing an unusual, inconsistent rule to support one use case is doubtful.
Together with other problems of using multiple return values to model exceptions, this implies a poor design of error handling.

Note some built-in structures can produce one or multiple value.
We have seen `range slice` returns two values (index and element) before.
If you only want the index, just write `for i := range names`.

Similarly, we have `element := m[key]` and `element, present := m[key]`.
In both cases, `element` is the zero value for the map's element type if `key` is not present in the map (`present` is false in the later case).

Similar to the issue with errors, the zero value `element` may be a valid value, making missing a key undistinguishable.

Also note that the evaluation order of multiple return values is uncertain.
Never assume the evaluation order of multiple return values is from left to right.

Another issue is Go functions can only consume multiple values returned by another function in a whole.
For example, given three functions `f() (int, int)`, `g(int, int)`, `h(int, int, int)`,
`g(f())` compiles while `h(f(), 1)` and `h(1, f())` do not.

Zero Values
-----------

Variables declared without an explicit initial value are given their zero value:

- `0` for numeric types
- `false` for the boolean type
- `""` (empty string) for strings
- `nil` for pointers, functions, interfaces, slices, channels, and maps.
- The above zero values are applied recursively for arrays and structs.

Using `0`, `fales`, and `""` for numbers, bools, and strings is confusing.
And the compiler cannot check declaration without assignment errors.

Using `nil` as zero values has the same problem with nullability in other languages.

To make things worse:

- `nil` for functions and interfaces requires any function taking a function or an interface check whether the argument is null or not.
- `nil` for pointers requires any function taking a pointer, and any method, a.k.a. functions with a receiver argument, check whether the argument is null or not.
- `nil` for slices, maps, and channels requires introducing a special `make` function to create their instances.

Functions as Values
-------------------

Functions are values too.
They can be passed around just like other values.

```go
func sortStringsByLength(s []string) {
    sort.Slice(
            s,
            // Anonymous functions are closures.
            func(i int, j int) bool { return len(s[i]) < len(s[j]) })
}
```

However, it only matches exact function signature.
It does not support subtyping of functions, since Go does not support covariance and contravariance.
Even covariant return type is not supported, which is supported by Java.

Pointers
--------

Unlike C, Go has no pointer arithmetic.
And accessing the field via a struct pointer will derefer the pointer implicitly.
Also, methods with a pointer/value receiver also accept its value/pointer as the receiver when they are called.

```go
func (point *Point) Scale(f float64) { /* ... */ }
point := Point{x: 1.0, y: 2.0}
pointer := &point // the `&` operator generates a pointer
fmt.Println(pointer.x) // same as (*pointer).x, where the `*` operator denotes the underlying value
point.Scale(10) // same as pointer.Scale(10)
```

We are cheating in the definition of `Scale`.
The definition of `Scale` does not check nil value of `*Point`.
As mentioned before, `nil` is zero value of a pointer, in other words, all pointers are nullable in Go.
The compiler accepts `nil` as a valid receiver of `Scale`, which is in fact invalid.

```go
var n *Point // nil
n.Scale(10) // The compiler does not check nullability.
```

`n.Scale(10)` compiles, but triggers a **runtime** error: `invalid memory address or nil pointer dereference`.
Due to the auto indirection of a value receiver, even a method accepting a value of a type not accepting `nil` may take a `nil` receiver argument.

Thus I prefer to declare a function instead.
Methods are only used to implement interfaces.

Interfaces
----------

### Implicitness

Interfaces are implemented implicitly.

```go
type I interface {
	M()
}
// Type T implements the interface I, without explicit declaration.
func (t T) M() {
	fmt.Println(t.S)
}
```

### Empty Interface

Because Go does not have generics,
you are forced to use empty interface `interface{}` for generic code.
`interface{}` is similar to `void*` in C, breaking type safety.

`t := i.(T)` asserts `i` holding `T` and assigns the underlying `T` value, triggering a panic if `i` does not hold `T`.
`t, ok := i.(T)` avoids triggering a panic if `i` does not hold `T`.
`switch t := i.(type)` permits several type assertions in series.

An interface can be considered as a pair of `(ConcreteType, Value)`.
Thus while an interface can be nil (for example, zero value), an interface holding a nil concrete value is itself non-nil.

```go
var i interface{} = nil // i == nil
var j []string = nil
i = j // i != nil
```

### Check Implementation

To check if a value satisfies an interface at **run time**, use type assertion:

```go
m, ok := val.(json.Marshaler)
```

To get the type and underlying value of an interface value at rut time, use `reflect.TypeOf(x)` and `reflect.ValueOf(x)`.
Both `reflect.Type` and `reflect.Value` have a `Kind` method that returns a constant indicating what sort of item is stored:
`reflect.Uint`, `reflect.Float64`, `reflect.Slice`, and so on.
`reflect.Value` also has an `Interface` method, which packs the type and value information back into an interface representation and returns the result.

To change the underlying value of `reflect.Value`, we can use `reflect.SetT`.

```go
var x float64 = 3.4
v := reflect.ValueOf(&x)
v.SetFloat(7.1)
```

Note that we pass `&x` instead of `x` to `reflect.ValueOf`.
Otherwise `v` would store a copy of `x`, and `v.SetFloat` would be illegal.
The `CanSet` method of `reflect.Value` reports the settability of it.

Be careful with reflections.
Reflections involves type assertion and value copying.
Thus it may cause performance issues.

To make sure that a type implementing the required interface at **compile time**:

```go
var _ json.Marshaler = (*RawMessage)(nil)
```

Here we use a pointer instead of `new(RawMessage)` because if RawMessage is a big array or struct, calling `new` may allocate unnecessary memory.

### Embedded Interfaces

Interface type name can be used in place of a method specification.

```go
type ComplexInterface interface {
    EmbeddedInterface
    AnotherEmbeddedInterface
    AMethod() int
}
```

The method set of `ComplexInterface` is the union of its embedded interfaces and its explicitly declared methods.
If there are interface methods have identical names, they must have identical signatures.

### Struct

Structs can embed interfaces.

```go
// Job has all the methods of `*log.Logger`.
type Job struct {
    Command string
    *log.Logger // same as Logger *log.Logger
}
```

### Stringer

One of the most ubiquitous interfaces is `Stringer`
defined by the `fmt` package.

```go
type Stringer interface {
    String() string
}
```

The print functions from `fmt` utilizes the `Stringer` interface.

### error

The other ubiquitous interface is the built-in `error` interface:

```go
type NullPointerException struct {
    Message string
}

// satisfies `error` interface
func (e *NullPointerException) Error() string {
    return e.Message
}
```

If we do not want to declare our own error type, we just use a general error with a string via `errors.New` or `fmt.Errorf`.

#### error.Is and error.As

Besides `New`, `errors` also provides two functions: `Is` and `As`.

`errors.Is` compares an error to a value.
There are two differences between using `errors.Is(err, value)` and comparing via `err == value` directly:

1. `errors.Is` will invoke the `Is` method of the error if available.
2. `errors.Is` will examine all the wrapped errors on the chain.

For example:

```go
type NonExistError struct {
    Code int
    Err error
}
func (e *NonExistError) Error() string { return strconv.Itoa(e.Code) }
// If e1.Unwrap() returns e2, then e1 wraps e2, and we can unwrap e1 to get e2.
// e2 itself may implement an Unwrap method returning its underlying error (error chain).
func (e *NonExistError) Unwrap() error { return e.Err }
func (e *NonExistError) Is(target error) bool {
    t, ok := target.(*NonExistError)
    if ok {
        return e.Code == t.Code
    } else {
        return false
    }
}
```

Similarly, there is an `errors.As` method, examining all the wrapped errors on the chain, using `As` method defined on errors when available.

```go
var err *NonExistError
var ok bool = errors.As(e, &err)
```

#### %w

Besides defining the `Unwrap` method explicitly, `fmt.Errorf` with `%w` verb present returns an error with an `Unwrap` method returning the argument of `%w`.
Thus the argument of `%w` must be an error.
In other aspects, `%w` is identical to `%v`.

```go
e2 := errors.New("wrap me")
e1 := fmt.Errorf("wraps %w", e2)
```

Wrapping an error will expose the underlying error, thus making the wrapped error part of the API.
Therefore abusing wrapping will break abstraction and expose implementation details unnecessarily.

#### panic and recover

As an alternative to return an error, we can `panic` instead.

To regain control of a panicking execution, we can use the built-in `recover` function.

```go
func f(v interface{}) {
    // anonymous function
    defer func() {
        if r: = recover(); r != nil {
            log.Fatal("Recovered in f", r)
        }
    }()
    func() {
        panic("panic")
    }()
    fmt.Println(v)
}
```

Goroutines
----------

Goroutines are user level continuation, more lightweight than system level continuation (threads).

```go
func sum(s []int, c chan<- int) { // `chan<-` only receive values; `<-chan` only send values
	sum := 0
	for _, v := range s {
		sum += v
	}
	c <- sum // send sum to c
}
func calc(s []int, c chan int) int { // `chan` has no direction (can receive and send values)
	go sum(s[:len(s)/2], c)
    go sum(s[len(s)/2:], c)
    return <-c + <-c
}
func main() {
	s := []int{7, 2, 8, -9, 4, 0}
	c := make(chan int, 2) // no race conditions, thus we create a buffered channel
    fmt.Println(calc(s, c))
}
```

### Closing a Channel

A sender can close a channel to indicate that no more values will be sent: `close(c)`.
Sending on a closed channel will cause a panic.
Thus only the sender should close a channel, never the receiver.

Channels aren't like files; you don't usually need to close them.
Closing is only necessary when the receiver must be told there are no more values coming, such as to terminate a range loop.

```go
func fibonacci(n int, c chan<- int) {
	x, y := 0, 1
	for i := 0; i <= n; i++ {
		c <- x
		x, y = y, x+y
	}
	close(c)
}

func main() {
	c := make(chan int) // unbuffered channel
	go fibonacci(10, c)
	for i := range c {
		fmt.Println(i)
	}
}
```

Receivers can test whether a channel has been closed by assigning a second parameter to the receive expression `v, ok := <-c`.

### Select

The `select` statement lets a goroutine wait on multiple communication operations.

A select blocks until one of its cases can run, then it executes that case.
It chooses one **at random** if multiple are ready。

```go
func fibonacci(c chan<- int, end <-chan bool) {
	x, y := 0, 1
	for {
		select {
		case c <- x:
			x, y = y, x+y
		case <-end:
			return
		}
	}
}

func main() {
	c := make(chan int)
	end := make(chan bool)
	go func() {
		for i := 0; i < 10; i++ {
			fmt.Println(<-c)
		}
		end <- true
	}()
	fibonacci(c, end)
}
```

The `default` case in a select is run if no other case is ready.

Name Conventions
----------------

### Package

By convention, packages are given lower case, single-word names; there should be no need for underscores or mixedCaps.
Another convention is that the package name is the base name of its source directory, for example `encoding/base64`.

By the way, to import a package only for its side effect (`init()`), use a blank identifier `import _ packageName`.

### Getter

It's neither idiomatic nor necessary to put `Get` into the getter's name.
If you have a field called `owner` (lower case, unexported), the getter method should be called `Owner` (upper case, exported), not `GetOwner`.
The use of upper-case names for export provides the hook to discriminate the field from the method.
A setter function, if needed, will likely be called `SetOwner`.

### Interface

By convention, one-method interfaces are named by the method name plus an -er suffix or similar modification to construct an agent noun: `Reader`, `Writer`, `Formatter`, `CloseNotifier` etc.

### MixedCaps

The convention in Go is to use `MixedCaps` or `mixedCaps` rather than underscores to write multiword names.

Why?

First, `set_owner` (unexported names in Go) is easier to read because we are already familiar with `set owner` in natural languages.
We Are not Familiar with Compound words and Similar structures Like this.
Thus `Set_owner` (exported names in Go) does not feel nature.

Second, Go prefers brevity ~~over~~ for clarity.
*Effective Go* suggested that:

> Long names don't automatically make things more readable.
> A helpful doc comment can often be more valuable than an extra long name.

Thus mixedCaps will probably not get long enough to reduce readability, e.g. [`isSomeoneElseJustFinishedWriting`][dhh].

[dhh]: https://signalvnoise.com/posts/3250-clarity-over-brevity-in-variable-and-method-names

Testing
-------

To test Go code, write testing functions as `TestXxx(*testing.T)`.

```go
package main

import "testing"

func TestSum(t *testing.T) {
    total := Sum(1, 1)
    if total != 2 {
       t.Errorf("Sum(1, 1) got: %d, expected: %d.", total, 2)
    }
}
```

Put those testing functions in a file whose name ends with `_test.go` within the package.
The file will be excluded from regular package builds but will be included when the `go test` command is run.

### Benchmark

Functions of the form `BenchmarkXxx(*testing.B)` are benchmarks, which will be executed by `go test -bench`.

```go
func BenchmarkHello(b *testing.B) {
    doSomeExpensiveSetup()
    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        fmt.Sprintf("hello")
    }
}
```

The output

    BenchmarkHello    10000000    282 ns/op

means that the loop ran 10000000 times at a speed of 282 ns per loop.

The times are adjusted until the benchmark function lasts long enough to be timed reliably.


If a benchmark needs to test performance in a parallel setting, it may use the `RunParallel` helper function; such benchmarks are intended to be used with the go test `-cpu` flag:

```go
func BenchmarkTemplateParallel(b *testing.B) {
    templ := template.Must(template.New("test").Parse("Hello, {.}!"))
    b.RunParallel(func(pb *testing.PB) {
        var buf bytes.Buffer
        for pb.Next() {
            buf.Reset()
            templ.Execute(&buf, "World")
        }
    })
}
```

### Examples

Example functions may include a concluding line comment that begins with `Output:` and is compared with the standard output of the function when the tests are run.
The comparison ignores leading and trailing space.

```go
func ExampleHello() {
        fmt.Println("hello")
        // Output: hello
}

func ExampleSalutations() {
        fmt.Println("hello, and")
        fmt.Println("goodbye")
        // Output:
        // hello, and
        // goodbye
}
```

Example functions without output comments are compiled but not executed.

### Subtests and Sub-benchmarks

The `Run` method allows defining subtests and sub-benchmarks,
without having to define separate functions for each.
This enables uses like table-driven benchmarks and creating hierarchical tests.
It also provides a way to share common setup and tear-down code:

```go
func TestFoo(t *testing.T) {
    // <setup code>
    t.Run("one", func(t *testing.T) { ... })
    t.Run("two", func(t *testing.T) { ... })
    t.Run("B=1", func(t *testing.T) { ... })
    // <tear-down code>
}
```

The argument to the `-run` and `-bench` command-line flags
is an unanchored regular expression that matches the test's name.

```sh
go test -run Foo     # Run top-level tests matching "Foo", such as "TestFooBar".
go test -run Foo/B=  # For top-level tests matching "Foo", run subtests matching "B=".
go test -run /B=1    # For all top-level tests, run subtests matching "B=1".
```

Subtests can also be used to control parallelism.
A parent test will only complete once all of its subtests complete.

```go
func TestGroupedParallel(t *testing.T) {
    for _, tc := range tests {
        tc := tc // capture range variable
        t.Run(tc.Name, func(t *testing.T) {
            t.Parallel()
        })
    }
}
```

### Main

It is sometimes necessary for a test program to do extra setup or teardown before or after testing.
It is also sometimes necessary for a test to control which code runs on the main thread.
To support these and other cases, if a test file contains a function:

```go
func TestMain(m *testing.M)
```

then the generated test will call `TestMain(m)` instead of running the tests directly.
`TestMain` runs in the main goroutine and can do whatever setup and teardown is necessary around a call to `m.Run`.
It should then call `os.Exit` with the result of `m.Run`.
When `TestMain` is called, `flag.Parse` has not been run.
If `TestMain` depends on command-line flags, it should call `flag.Parse` explicitly.

A simple implementation of `TestMain` is:

```go
func TestMain(m *testing.M) {
	// flag.Parse()
	os.Exit(m.Run())
}
```

### Helper functions

When testing, to print location of a call to the helper function,
instead of a line in the definition of the helper function, invoke `Helper` method in the definition of the helper function.

For example:

```go
func assertTrue(t *testing.T condition bool) {
    // This marks assertTrue a helper function.
    // Without it, if something is wrong,
    // `go test` will always print the line number of `t.Fail()` below.
    t.Helper()
    if !condition {
        t.Fail()
    }
}

func TestFoo(t *testing.T) {
    // Since assertTrue is marked as a helper function,
    // `go test` will print the line number of the following line.
    assertTrue(t, 1 + 1 == 1)
}
```

`testing/iotest` implements Readers and Writers useful mainly for testing.

Tooling
-------

### Formatting

`go fmt` formats your code.
It has no line length limit.

### Documentation

`go doc` processes Go source files to extract documentation.
Comments that appear before top-level declarations, with no intervening newlines, are extracted along with the declaration.

Every package should have a *package comment*, a block comment preceding the package clause.
For multi-file packages, the package comment only needs to be present in one file, and any one will do.

Comments do not need extra formatting such as banners of stars.
The comments are uninterpreted plain text, except that indented text will be display in a fixed-width font, suitable for program snippets.

`godoc` does not support cross reference.

Inside a package, every exported (capitalized) name in a program should have a *doc comment*.

The first sentence of a doc comment should be a one-sentence summary that starts with the name being declared.
This is because `godoc` is stupid.
It does not offer a `search` function.
To search for a function, we have to use `grep`:

    go doc regexp | grep parse

*Effective Go* pointed out:

> If all the doc comments in the package began, "This function...",
> `grep` wouldn't help you remember the name.

This approach has three issues:

First, beginning a comment with `"This function...` may be redundant, but just omitting the function name like `Returns the source text used to compile the regular expression.` is more succinct.

Second, although this approach does support a hacky way to search for function names, it does not provide an important information, the function signature, which is crucial for a static typed language.

Third, in fact neither `godoc` nor `grep` has a concept of sentence.
Thus the "first sentence" is actually the "first line".
The `go doc regexp | grep parse` example given in the *Effective Go* demonstrates how ineffective this approach.
`go doc regexp | grep parse` finds `Compile`, but fails to find `MustCompile` and `MustCompilePOSIX`:

    MustCompile is like Compile but panics if the expression cannot be
    parsed.

    MustCompilePOSIX is like CompilePOSIX but panics if the expression
    cannot be parsed.

Because "parsed" does not fit into the first line,
`go doc regexp | grep parse` fails to find these two related functions.

This is a typical example of a poor design that roots in the unix philosophy "pass everything as text".

`godoc` should have parsed the comments into structures consist of signature, summary, description, etc., and either provided a built-in search command, or produced an AST for other tools to consume.

Unsupported
-----------

Go does not has generics.

Go does not distinguish reassignable and irreassignable variables, even function parameters and method receiver are reassignable (just like a local variable).

Go does not have immutable collection types in its standard library.

Go does not support optional parameters or overloading, except for some built-in functions like `append` and `make`.

Style and Conventions
---------------------

1. Error strings should not be capitalized (unless beginning with proper nouns or acronyms) or end with punctuation, since they are usually printed following other context.
2. Avoid renaming imports except to avoid a name collision; good package names should not require renaming. In the event of collision, prefer to rename the most local or project-specific import.
3. Words in names that are initialisms or acronyms have a consistent case. For example, `xmlHTTPRequest` or `XMLHTTPRequest`. Code generated by the protocol buffer compiler is exempt from this rule.
4. Go interfaces generally belong in the package that uses values of the interface type, not the package that implements those values. The implementing package should return concrete (usually pointer or struct) types: that way, new methods can be added to implementations without requiring extensive refactoring.
5.  Prefer synchronous functions over asynchronous ones. If callers need more concurrency, they can add it easily by calling the function from a separate goroutine. But it is quite difficult - sometimes impossible - to remove unnecessary concurrency at the caller side.
6.  In tests, the order is `actual != expected`, and the message uses that order too. For example, `if got != tt.want {t.Errorf("Foo(%q) = %d; want %d", tt.in, got, tt.want)}` Some test frameworks encourage writing these backwards: `0 != x, "expected 0, got x"`, and so on. Go does not.

See <https://github.com/golang/go/wiki/CodeReviewComments> for more information.

References
----------

This introduction is based on the following materials:

1. [A Tour of Go](https://tour.golang.org)
2. [Effective Go](https://golang.org/doc/effective_go.html)
3. [Go by Example](https://gobyexample.com/timeouts)
4. [Go Slices: usage and internals](https://blog.golang.org/go-slices-usage-and-internals)
5. [Defer, Panic, and Recover](https://blog.golang.org/defer-panic-and-recover)
