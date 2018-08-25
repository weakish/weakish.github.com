Quick Introduction to Go
========================

We're going to try to quickly show you enough of Go 1.10 to actually try it out.

Hello World
-----------

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, 世界")
}
```

The entry point of an executable must be a function named `main` in a package named `main`.

Go source code is encoded in UTF-8.

A syntax derived from C
-----------------------

The main difference to C is type annotation after identifier.

Here's what it looks like to define and call a simple function,
and define and initialize a struct.

```go
type Point struct {
	x float64
	y float64
}

func distance(from Point, to Point) float64 {
	return math.Pow(
		math.Pow(from.x-to.x, 2)+math.Pow(from.y-to.y, 2),
		0.5)
}

var dist float64 = distance(Point{0.0, 0.0}, Point{2.0, 3.0})
```

Go does not have classes.
But you can define methods on types.
That is, defining a function with a receiver argument.

```go
func (point Point) Dist(other Point) float64 {
    return math.Pow(
        math.Pow(point.x-other.x, 2)+math.Pow(point.y-other.y, 2),
        0.5
    )
}

var point Point = Point{0.0, 0.0}
fmt.Println(point.Dist(Point{2.0, 3.0}))
```

You can only declare a method with a receiver whose type is defined in the same package as the method. You cannot declare a method with a receiver whose type is defined in another package (including the built-in types such as `int`).

Here's how we create and iterate a sequence:

```go
// The type of `names` (a slice of strings)
// is inferred by the compiler automatically.
names := []string{"Tom", "Dick", "Harry"}

// Go reuses `:=` instead of a dedicated keyword `in`.
// `_` is called blank identifier,
// meaning we are not interested in indecies of the slice.
// BTW, if we are not interested in the loop values,
// only the iteration itself, we can just write `for range names`.
for _, name := range names {
    // Go does not have access modifiers.
    // Exported (public) names begin with a capital letter.
	fmt.Println("Hello, " + name + " !")
}
```

The type `[]T` is a slice of values of type `T`.
The slice uses an underlying array to store data.
The length of an array `[n]T` is part of its type,
so arrays cannot be resized.
Thus slices are much more common than arrays.

More on slice
-------------

According to [golang.org/src/runtime/slice.go](https://golang.org/src/runtime/slice.go):

```go
type slice struct {
  	array unsafe.Pointer
  	len   int
  	cap   int
}
```

### Length and capacity

`len` is the current length of the slice.

`cap` is the capacity of the slice, i.e. the length of the underlying array.

Go has a built-in `append` function to add elements to a slice,
modifying the underlying array directly,
or replacing the underlying array with a new one with a larger capacity.

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

Since re-slicing a slice doesn't make a copy of the underlying array,
the full underlying array will be kept in memory until it is no longer referenced.
Occasionally this can cause the program to hold all the data in memory
when only a small piece of it is needed.
In that case, copy the data over to another new slice
via `copy` or `append`.

### `make` and `new`

Normally Go has two ways to create a non-primitive:

1. Composite literals, e.g. `[]int{1, 2, 3}`, which creates an instance, are mostly used.
2. `new(T)` creates a zero value of `T` and returns a pointer `*T`, equivalent to `&T{}`.

However, slices are special.
As shown above, composite literals like `[]int{1, 2, 3}` work well with slices.
But `new([]int)` is rarely useful,
since it only returns a pointer with zero value of a slice `nil`.
However, unlike other structures, a slice is not ready to use with its zero value.
To prepare a slice, we need to first create its underlying array.
Also, since slices are cheap and expensive as explained in next section,
and modifying a slice automatically modifies its underlying array,
a pointer to a slice is rarely used.
Thus Go introduces a new built-in function `make` for this purpose.
`make([]int, 10, 100)` creates a slice ready to use,
with underlying array allocated with zero values,
and returns a slice, not a pointer to a slice.

Same applies to `maps` and `channels`.
And `make` applies only to slices, maps, and channels.

### Unsafe pointer

The `array` field of the slice does not point to the underlying array.
Instead, it points to the first element of the underlying array.
This makes slicing as cheap and efficient as passing around explicit indexes.

However, this also means slice cannot utilize array's compile time bound checks.
Index out of range error with slices can only be checked at runtime.

Strings have the same issue
since strings in Go are effectively slices of bytes.

Note that [Go Slices: usage and internals][go-slice] on [The Go Blog][blog]
mentioned slice consists of a pointer to the **array**,
the length of the segment, and its capacity.
Instead slice contains a pointer to the **first element of the array**.
The illusion below is correct (`ptr *Elem`).
In C, a pointer to an array is actually a pointer to the first element of an array.

So a pointer to an array and a pointer to the first element of an array are equivalent in C.

But this does not applies to Go.

[go-slice]: https://blog.golang.org/go-slices-usage-and-internals
[blog]: https://blog.golang.org

### Variadic Functions

Go supports variadic functions (splats arguments):

```django
func sum(ns ...int) int {
    total := 0
	for _, n := range ns {
		total += n
	}
	return total
}

sum(1)
sum(1, 2)
sum(1, 2, 3)
s := []int{1, 2, 3}
sum(s...)
sum(nil...) // -> 0
```

Flow control
------------

### `for`

`for` is the only looping construct in Go.

A traditional for loop:

```go
sum := 0
for i := 0; i < 10; i++ { // `i++` is a statement, not an expression.
	sum += i
}

for ; sum < 1000; {
    sum += sum
}
```

C's `while` is also spelled `for` in Go:

```go
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

### `if`

Like `for`, the `if` statement can start with a short statement to execute before the condition.

This is mainly used to declare variables to limit their scope until the end of the `if` (including `else` blocks).

```go
if v := math.Pow(x, n); v < lim {
	return v
}
```

### `switch`

Similarly, `switch` can start with a short statement:

```go
switch os := runtime.GOOS; os {
    case "darwin":
		fmt.Println("macOS.")
	case "linux":
		fmt.Println("Linux.")
	default:
    	fmt.Printf("%s.", os)
```

### `defer`

A `defer` statement defers the execution of a function until the surrounding function returns.

```go
file, _ := os.Open(path)
defer file.Close()
```

The deferred call's arguments are evaluated immediately, though.

Multiple deferred function calls are pushed onto a stack.
When a function returns,
its deferred calls are executed in last-in-first-out order.

`defer` breaks the rule of natural order of execution.
Thus it should be restricted for cleanup operations.
Abusing `defer` disturbs the execution flow thus harming readability.

Basic types
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

Constants are declared with the `const` keyword,
they can be character, string, boolean, or numeric values.

Numeric constants are high-precision values.
An untyped constant takes the type needed by its context.

```go
const Pi = 3.14
```

Type aliases
------------

```go
type Boolean = bool
```

Now `Boolean` is an alternative spelling of `bool`.
They both denote the same type.

Named return values
-------------------

Go's return values may be named.
If so, they are treated as variables defined at the top of the function.

These names should be used to document the meaning of the return values.

```go
func sum(x int, y int) (total int) {
	total = x + y
	return total
}
```


Multiple return values
----------------------

A function can return any number of results.

```go
func swap(x string, y string) (string, string) {
	return y, x
}

a, b := swap("hello", "world")
```

This is mostly used in error handling:

```go
val err := someFunction()
if err != nil {
    return err
}
codeUsing(val)
```

To handle errors with multiple return values conveniently,
Go introduces two hacky features:

First, when `err` is not `nil`, `val` is assigned to the zero value of its type. For problems on zero values, see next section.

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

Because in a `:=` declaration a variable `v` may appear
even if it has already been declared, provided:

- this declaration is in the same scope as the existing declaration of `v`,
- the corresponding value in the initialization is assignable to `v`, and
- there is at least one other variable in the declaration that is being declared anew.

Introducing an unusual, inconsistent rule to support one use case is doubtful.
Together with other problems of using multiple return values
to model exceptions, this implies a poor design of error handling.

Note some built-in structures can produce one or multiple value.
We have seen `range slice` returns two values (index and element) before.
If you only want the index, just write `for i := range names`.

Similarly, we have `element := m[key]` and `element, present := m[key]`.
In both cases, `element` is the zero value for the map's element type
if `key` is not present in the map (`present` is false in the later case).

Similar to the issue with errors, the zero value `element` may be a valid value, making missing a key undistinguishable.

Also note that the evaluation order of multiple return values is uncertain.
Never assume the evaluation order of multiple return values is from left to right.

Zero values
-----------

Variables declared without an explicit initial value are given their zero value:

- `0` for numeric types
- `false` for the boolean type
- `""` (empty string) for strings
- `nil` for pointers, functions, interfaces, slices, channels, and maps.
- The above zero values are applied recursively for arrays and structs.

Using `0`, `fales`, and `""` for numbers, bools, and strings is confusing.
And the compiler cannot check declaration without assignment errors.

Using `nil` as zero values has the same problem with nullability
in other languages.

To make things worse:

- `nil` for functions and interfaces requires any function taking a function or an interface check whether the argument is null or not.
- `nil` for pointers requires any function taking a pointer, and any method, a.k.a. functions with a receiver argument, check whether the argument is null or not.
- `nil` for slices, maps, and channels requires introducing a special `make` function to create their instances.

Functions as values
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

Pointers
--------

The type `*T` is a pointer to a `T` value.
The `&` operator generates a pointer to its operand.

The `*` operator denotes the pointer's underlying value (dereference).
Accessing the field via a struct pointer will derefer the pointer implicitly.
```go
point := Point{x: 1.0, y: 2.0}
pointer := &point
fmt.Println(pointer.x) // same as (*pointer).x
```

Unlike C, Go has no pointer arithmetic.

You can declare methods with pointer receivers `*T`,
where `T` itself cannot be a pointer.
This allows Go to indirect and derefer the receiver automatically.
In other words, functions with a pointer argument must take a pointer,
and functions with a value argument must take a value.
However, methods with pointer receivers take either a value or a pointer as the receiver when they are called,
and methods with value receivers take either a value or a pointer as the receiver when they are called.
But Go only automatically insert a single dereference,
thus given a method defined on `T`,
calling it on a receiver `**T` is disallowed.

```go
func (point *Point) Scale(f float64) {
	point.x = point.x * f
	point.y = point.y * f
}

func main() {
    p := Point{1.0, 2.0}
    pp := &p
    p.Scale(10) // same as
    pp.Scale(10)
}
```

We are cheating in the definition of `Scale`.
The definition of `Scale` does not check nil value of `*Point`.
As mentioned before, `nil` is zero value of a pointer,
in other words, all pointers are nullable in Go.
The compiler accepts `nil` as a valid receiver of `Scale`,
which is in fact invalid.

```go
var n *Point // nil
n.Scale(10) // The compiler does not check nullability.
```

`n.Scale(10)` compiles, but triggers a **runtime** error:
`invalid memory address or nil pointer dereference`.

Since the compiler dose not check nullability for us,
we have to check it ourselves.

```go
func (point *Point) Scale(f float64) {
    if point == nil {
        panic("(*Point).Scale() does not accept nil as its receiver!")
    }
	point.x = point.x * f
	point.y = point.y * f
}
```

Due to the auto indirection of a value receiver,
even a method accepting a value of a type not accepting `nil` may take a `nil` receiver argument.

```go
func (point Point) Dist(other Point) float64 {
    if point == nil {
        panic("(*Point).Scale() does not accept nil as its receiver!")
    }
    return math.Pow(
        math.Pow(point.x-other.x, 2)+math.Pow(point.y-other.y, 2),
        0.5
    )
}

var np *Point
np.Dist(Point{1.0, 2.0})
```

Interfaces
----------

### Implicitness

Interfaces are implemented implicitly.

```go
type I interface {
	M()
}
// Type T implements the interface I,
// without explicit declaration.
func (t T) M() {
	fmt.Println(t.S)
}
```

### Nullability

Just as pointers, a function taking an interface should check its nullability,
to avoid runtime error.

```go
func describe(i I) {
    if i == nil {
        panic("describe() does not accept nil argument.")
    }
	fmt.Printf("(%v, %T)\n", i, i)
}
```

### Empty Interface

Because Go does not have generics,
you are forced to use empty interface `interface{}` for generic code.
`interface{}` is similar to `void*` in C, breaking type safety.

`t := i.(T)` asserts `i` holding `T` and assigns the underlying `T` value, triggering a panic if `i` does not hold `T`.
`t, ok := i.(T)` avoids triggering a panic if `i` does not hold `T`.
`switch t := i.(type)` permits several type assertions in series.

### Check implementation

To check if a value satisfies an interface at **run time**, use type assertion:

```go
m, ok := val.(json.Marshaler)
```

To get the type and underlying value of an interface value at rut time,
use `reflect.TypeOf(x)` and `reflect.ValueOf(x)`.
Both `reflect.Type` and `reflect.Value` have a `Kind` method
that returns a constant indicating what sort of item is stored:
`reflect.Uint`, `reflect.Float64`, `reflect.Slice`, and so on.
`reflect.Value` also has an `Interface` method,
which packs the type and value information back into an interface representation and returns the result.

To change the underlying value of `reflect.Value`,
we can use `reflect.SetT`.
For example:

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
var _ json.Marshaler = new(RawMessage)
```

If RawMessage is a big array or struct,
calling `new` may allocate unnecessary memory.
Thus using a pointer instead may be better:

```go
var _ json.Marshaler = (*RawMessage)(nil)
```

First we convert nil to a pointer to `*RawMessage`,
(nil can always be converted to a pointer,
since the pointer uses nil as its zero value).
Then we convert a pointer the interface `json.Marshaler`,
i.e. checking if `*RawMessage` implements all required methods of `json.Marshaler`.

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

The print functions from `fmt` utilizes the `Stringer` interface:

```go
func (point Point) String() string {
	return fmt.Sprintf("Foo(x: %.2f, y: %.2f)", foo.x, foo.y)
}

func main() {
	foo := Foo{1.0, 2.0}
	fmt.Println(foo) // same as
	fmt.Println(foo.String())
}
```

In the `Point.String()` function, we uses `fmt.Sprintf`,
which uses a formatting string similar to `printf` in C.
Main differences are:

1. The catchall `%v` results in exactly what `Print` and `Println` would produce, and prints any value.
2. For any value, `%#v` prints the value in full Go syntax.
3. `%+v` annotates the fields with their names for structs.
4. `%i` is not supported, using `%d` instead.
5. `%d` does not take flags for signedness or size.
6. `%q` prints a quoted string for `string` and `[]byte`, and a single-quoted rune constant for integers and runes.
7. `%x` works on strings, byte arrays and byte slices as well as on integers, generating a long hexadecimal string, and with a space in the format (`% x`) it puts spaces between the bytes.
8. `%T` prints the type of a value.

Since the print functions from `fmt` utilizes the `Stringer` interface,
calling `Sprintf` on the type implementing `Stringer` directly
will recur into the `String` method indefinitely.
For example:

```go
type MyString string

func (m MyString) String() string {
    return fmt.Sprintf("MyString=%s", m) // Error: will recur forever.
}
```

`string(m)` fix the above example.

### error

The other ubiquitous interface is the built-in `error` interface:

```go
type NullPointerException struct {
    message string
}

// satisfies `error` interface
func (e *NullPointerException) Error() string {
    return e.message
}
```

If multiple errors may return, returns an `error` instead.
The caller can handle the error specially after checking its type via a type assertion,
or just pass the error to `log.Fatal` directly.
Unfortunately, in the former case,
the Go compiler does not guarantee that you have checked all possible cases of the error.
To enforce checking all possible errors, return them as multiple values,
one return value for one error.

If we do not want to declare our own error type,
we just use a general error with a string
via `errors.New("message")` or `fmt.Errorf("Printf formatted message")`.

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

Goroutines are user level continuation,
more lightweight than system level continuation (threads).

Using goroutines is easy:

- The function definition takes an additional channel parameter,
  and passes the result to a channel instead of returning it.
- Create a channel with `make(chan T)`.
- Invoke the function with `go`, starting a new goroutine.
- Receive the result from the channel.

```go
func sum(s []int, c chan int) {
	sum := 0
	for _, v := range s {
		sum += v
	}
	c <- sum // send sum to c
}

func main() {
	s := []int{7, 2, 8, -9, 4, 0}

	c := make(chan int)
	go sum(s[:len(s)/2], c)
	go sum(s[len(s)/2:], c)
	x, y := <-c, <-c
	total := x + y
}
```

In the above example, `c` is an unbuffered channel (holding only one value).
In other words, Go will not fill new value to the channel
until existing value in the channel has been received,
and receiving an value blocks until the channel has been filled a value.
Thus although the two `sum` add numbers up in parallel,
the `sum` finished the adding up later cannot send the result
until the `sum` finished early sends the result and the result has been fetched.

### Buffered Channels

In the code above, two `sum` functions does not have race conditions,
thus we can create a buffered channel via `make(chan, 2)` instead.
Sends to a buffered channel block only when the buffer is full.
Receives block when the buffer is empty.

### Channel Directions

When using channels as function parameters, you can specify
if a channel is meant to only send or receive values.
This specificity increases the type-safety of the program.

```go
func ping(pings chan<- string, msg string) {
    pings <- msg
}
func pong(pings <-chan string, pongs chan<- string) {
    msg := <-pings
    pongs <- msg
}
```

### Closing a Channel

A sender can close a channel to indicate that no more values will be sent:
`close(c)`.
Sending on a closed channel will cause a panic.
Thus only the sender should close a channel, never the receiver.

Channels aren't like files; you don't usually need to close them.
Closing is only necessary when the receiver must be told
there are no more values coming, such as to terminate a range loop.

```go
func fibonacci(n int, c chan int) {
	x, y := 0, 1
	for i := 0; i <= n; i++ {
		c <- x
		x, y = y, x+y
	}
	close(c)
}

func main() {
	c := make(chan int)
	go fibonacci(10, c)
	for i := range c {
		fmt.Println(i)
	}
}
```

Receivers can test whether a channel has been closed
by assigning a second parameter to the receive expression
`v, ok := <-c`.

### Select

The `select` statement lets a goroutine wait on multiple communication operations.

A select blocks until one of its cases can run, then it executes that case.
It chooses one **at random** if multiple are ready。

```go
func fibonacci(c chan int, end chan bool) {
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

```go
tick := time.Tick(100 * time.Millisecond)
boom := time.After(500 * time.Millisecond)
for {
	select {
	case <-tick:
		fmt.Println("tick.")
	case <-boom:
		fmt.Println("BOOM!")
		return
	default:
		fmt.Println("    .")
		time.Sleep(50 * time.Millisecond)
	}
}
```

`time.After` is frequently used in select cases
to either receiving results from other channel, or timeout.

If you just want to wait, you can use `time.Sleep`.

### Examples

#### Worker Pools

```go
package main

import "fmt"
import "time"

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Println("worker", id, "started  job", j)
        // We'll sleep a second per job to
        // simulate an expensive task.
        time.Sleep(time.Second)
        fmt.Println("worker", id, "finished job", j)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // This starts up 3 workers, initially blocked
    // because there are no jobs yet.
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Here we send 5 `jobs` and then `close` that
    // channel to indicate that's all the work we have.
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    // Finally we collect all the results of the work.
    for a := 1; a <= 5; a++ {
        <-results
    }
```

#### Rate Limiting

```go
package main

import "time"
import "fmt"

func main() {
    // First we'll look at basic rate limiting. Suppose
    // we want to limit our handling of incoming requests.
    // We'll serve these requests off a channel of the
    // same name.
    requests := make(chan int, 5)
    for i := 1; i <= 5; i++ {
        requests <- i
    }
    close(requests)

    // This `limiter` channel will receive a value
    // every 200 milliseconds. This is the regulator in
    // our rate limiting scheme.
    limiter := time.Tick(time.Millisecond * 200)

    // By blocking on a receive from the `limiter` channel
    // before serving each request, we limit ourselves to
    // 1 request every 200 milliseconds.
    for req := range requests {
        <-limiter
        fmt.Println("request", req, time.Now())
    }

    // We may want to allow short bursts of requests in
    // our rate limiting scheme while preserving the
    // overall rate limit. We can accomplish this by
    // buffering our limiter channel. This `burstyLimiter`
    // channel will allow bursts of up to 3 events.
    burstyLimiter := make(chan time.Time, 3)

    // Fill up the channel to represent allowed bursting.
    for i := 0; i < 3; i++ {
        burstyLimiter <- time.Now()
    }

    // Every 200 milliseconds we'll try to add a new
    // value to `burstyLimiter`, up to its limit of 3.
    go func() {
        for t := range time.Tick(time.Millisecond * 200) {
            burstyLimiter <- t
        }
    }()

    // Now simulate 5 more incoming requests. The first
    // 3 of these will benefit from the burst capability
    // of `burstyLimiter`.
    burstyRequests := make(chan int, 5)
    for i := 1; i <= 5; i++ {
        burstyRequests <- i
    }
    close(burstyRequests)
    for req := range burstyRequests {
        <-burstyLimiter
        fmt.Println("request", req, time.Now())
    }
}
```

### Mutex

To make sure only one goroutine can access a variable at a time
(mutual exclusion), use `sync.Mutex`.

```go
type SafeCounter struct {
	v   map[string]int
	mux sync.Mutex
}

// Inc increments the counter for the given key.
func (c *SafeCounter) Inc(key string) {
  	// Lock so only one goroutine at a time can access the map `c.v`.
	c.mux.Lock()
	defer c.mux.Unlock()
	c.v[key]++
}

// Value returns the current value of the counter for the given key.
func (c *SafeCounter) Value(key string) int {
	c.mux.Lock()
	defer c.mux.Unlock()
	return c.v[key]
}
```

Alternatively, we can use `sync/atomic` instead, without explicit locking.

```go
import "sync/atomic"
import "time"

func main() {
    var safeCounter uint64 = 0
}

    // To simulate concurrent updates, we'll start 50
    // goroutines that each increment the counter about
    // once a millisecond.
    for i := 0; i < 50; i++ {
        go func() {
            for {
                atomic.AddUint64(&ops, 1)
                time.Sleep(time.Millisecond)
            }
        }()
    }

    // Wait a second to allow some ops to accumulate.
    time.Sleep(time.Second)

    opsFinal := atomic.LoadUint64(&ops)
    fmt.Println("ops:", opsFinal)
}
```

If we want to implement the counter solely via comminuting with channels,
we can use a counter goroutine to manage reading and writing counts.
To comminute with this counter, we use channels.
One for writing, and the other for reading.

```go
func counter(writer <-chan int, reader chan<- int) {
    c := 0
    for {
        select {
        case w := <-writer:
            c += w
        case reader <- c:
            // pass
        }
    }
}
```

The problem of the above code is that
the counter cannot send updated value to the reader channel,
until other goroutine receives value from the reader channel.

To fix this problems, the counter does not offer a channel for reading.
Instead, the counter offers a channel for sending read and write operations.
To read the counter, other goroutines pass a channel to the reading channel,
saying "I want to read the counter, and I have created a channel.
Please put the result in this channel."
Similarly, goroutines to write can also create a channel,
saying "I want to write to the counter, and I have created a channel.
After you updated the counter, please tell me success via the channel."

```go
type Writing struct {
    val int
    res chan bool
}
type Reading struct {
    res chan int
}

func counter(writing <-chan Writing, reading chan<- Reading) {
    c := 0
    for {
        select {
        case w := <-writing:
            c += w.int
            w.res <- true
        }
        case r := <-reading:
            r.res <- c
    }
}
```

Cgo
---

Cgo lets Go packages call C code.

```go
package rand

/*
#include <stdlib.h>
*/
import "C"

func Random() int {
    var r C.long = C.random()
    return int(r)
}

func Seed(i int) {
    C.srandom(C.uint(i))
}
```

Conversion between Go and C strings is done with the
`C.CString`, `C.GoString`, and `C.GoStringN` (length specified) functions.
These conversions make a copy of the string data.

```go
import "C"
import "unsafe"

func Print(s string) {
    cs := C.CString(s)
    defer C.free(unsafe.Pointer(cs))
    C.fputs(cs, (*C.FILE)(C.stdout))
}
```

Name Conventions
----------------

### Package

By convention, packages are given lower case, single-word names;
there should be no need for underscores or mixedCaps.

Another convention is that the package name is the base name of its source directory,
for example `encoding/base64`.

By the way, to import a package only for its side effect (`init()`),
use a blank identifier `import _ packageName`.

### Getter

It's neither idiomatic nor necessary to put `Get` into the getter's name.
If you have a field called `owner` (lower case, unexported),
the getter method should be called `Owner` (upper case, exported),
not `GetOwner`.
The use of upper-case names for export provides the hook to discriminate the field from the method.
A setter function, if needed, will likely be called `SetOwner`.

### Interface

By convention, one-method interfaces are named
by the method name plus an -er suffix or similar modification
to construct an agent noun: `Reader`, `Writer`, `Formatter`,
`CloseNotifier` etc.

### MixedCaps

The convention in Go is to use `MixedCaps` or `mixedCaps`
rather than underscores to write multiword names.

Why?

First, `set_owner` (unexported names in Go) is easier to read
because we are already familiar with `set owner` in natural languages.
We Are not Familiar with Compound words and Similar structures Like this.
Thus `Set_owner` (exported names in Go) does not feel nature.

Second, Go prefers brevity ~~over~~ for clarity.
*Effective Go* suggested that:

> Long names don't automatically make things more readable.
> A helpful doc comment can often be more valuable than an extra long name.

Thus mixedCaps will probably not get long enough to reduce readability,
e.g. [`isSomeoneElseJustFinishedWriting`][dhh].

[dhh]: https://signalvnoise.com/posts/3250-clarity-over-brevity-in-variable-and-method-names

Testing
-------

To test Go code, write testing functions as:

```go
func TestXxx(*testing.T)
```

where Xxx can be any alphanumeric string
(but the first letter must not be in [a-z])
and serves to identify the test routine.

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

Methods:

- `Log` analogous to `Println`, and records the text in the error log.
- `Logf` analogous to `Printf`, and records the text in the error log.
- `Fail` marks the function as having failed but continues execution.
- `FailNow` marks the function as having failed and stops its execution. Execution will continue at the next test or benchmark.
- `Error` equivalent to `Log` then `Fail`.
- `Errorf` equivalent to `Logf` then `Fail`.
- `Fatal` equivalent to `Log` then `FailNow`.
- `Fatalf` equivalent to `Logf` then `FailNow`.

Put those testing functions in a file whose name ends with `_test.go`
within the package.
The file will be excluded from regular package builds
but will be included when the `go test` command is run.

### Benchmark

Functions of the form

```go
func BenchmarkXxx(*testing.B)
```

are considered benchmarks,
and are executed by `go test -bench`.

```go
func BenchmarkHello(b *testing.B) {
    for i := 0; i < b.N; i++ {
        fmt.Sprintf("hello")
    }
}
```

The output

    BenchmarkHello    10000000    282 ns/op

means that the loop ran 10000000 times at a speed of 282 ns per loop.

The times are adjusted until the benchmark function lasts long enough
to be timed reliably.

If a benchmark needs some expensive setup before running,
the timer may be reset via `b.ResetTimer()`.

If a benchmark needs to test performance in a parallel setting,
it may use the `RunParallel` helper function;
such benchmarks are intended to be used with the go test `-cpu` flag:

```go
func BenchmarkTemplateParallel(b *testing.B) {
    templ := template.Must(template.New("test").Parse("Hello, {{.}}!"))
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

The package also runs and verifies example code.
Example functions may include a concluding line comment that begins with `Output:`
and is compared with the standard output of the function when the tests are run.
(The comparison ignores leading and trailing space.)

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

Run does not return until parallel subtests have completed,
providing a way to clean up after a group of parallel tests:

```go
func TestTeardownParallel(t *testing.T) {
    // This Run will not return until the parallel tests finish.
    t.Run("group", func(t *testing.T) {
        t.Run("Test1", parallelTest1)
        t.Run("Test2", parallelTest2)
        t.Run("Test3", parallelTest3)
    })
    // <tear-down code>
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
`TestMain` runs in the main goroutine
and can do whatever setup and teardown is necessary around a call to `m.Run`.
It should then call `os.Exit` with the result of `m.Run`.
When `TestMain` is called, `flag.Parse` has not been run.
If `TestMain` depends on command-line flags,
it should call `flag.Parse` explicitly.

A simple implementation of `TestMain` is:

```go
func TestMain(m *testing.M) {
	// flag.Parse()
	os.Exit(m.Run())
}
```

### Helper functions

When testing, to print location of a call to the helper function,
instead of a line in the definition of the helper function,
invoke `Helper` method in the definition of the helper function.

For example:

```go
func assertTrue(t *testing.T condition bool) {
    // This marks assertTrue is a helper function.
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

### iotest

`testing/iotest` implements Readers and Writers useful mainly for testing.

Tooling
-------

### Formatting

`go fmt` formats your code.
It has no line length limit.
As *Effective Go* suggests:

> If a line feels too long, wrap it and indent with an extra tab.

You may set a commit hook of git for it.

### Documentation

`go doc` processes Go source files to extract documentation.
Comments that appear before top-level declarations,
with no intervening newlines,
are extracted along with the declaration.

Every package should have a *package comment*,
a block comment preceding the package clause.
For multi-file packages,
the package comment only needs to be present in one file, and any one will do.

Comments do not need extra formatting such as banners of stars.
The comments are uninterpreted plain text,
except that indented text will be display in a fixed-width font,
suitable for program snippets.

`godoc` does not support cross reference.

Inside a package, every exported (capitalized) name in a program
should have a *doc comment*.

The first sentence of a doc comment
should be a one-sentence summary that starts with the name being declared,
as *Effective Go* suggested.

This is because `godoc` is stupid.
It does not offer a `search` function.
To search for a function, we have to use `grep`:

    godoc regexp | grep parse

*Effective Go* pointed out:

> If all the doc comments in the package began, "This function...",
> `grep` wouldn't help you remember the name.

This approach has three issues:

First, beginning a comment with `"This function...` may be redundant, but just omitting the function name like `Returns the source text used to compile the regular expression.` is more succinct.

Second, although this approach does support a hacky way to search for function names, it does not provide an important information, the function signature, which is crucial for a static typed language.

Third, in fact neither `godoc` nor `grep` has a concept of sentence.
Thus the "first sentence" is actually the "first line".
The `godoc regexp | grep parse` example given in the *Effective Go*
demonstrates how ineffective this approach.
`godoc regexp | grep parse` finds `Compile`,
but fails to find `MustCompile` and `MustCompilePOSIX`:

    MustCompile is like Compile but panics if the expression cannot be
    parsed.
    
    MustCompilePOSIX is like CompilePOSIX but panics if the expression
    cannot be parsed.

Because "parsed" does not fit into the first line,
`godoc regexp | grep parse` fails to find these two related functions.

This is a typical example of a poor design that roots in the unix philosophy
"pass everything as text".

`godoc` should have parsed the comments into structures consist of
signature, summary, description, etc.,
and either provided a built-in search command,
or produced an AST for other tools to consume.

Unsupported
-----------

Go does not has generics.

Go does not distinguish reassignable and irreassignable variables.

Go does not have immutable collection types in its standard library.

Go does not support optional parameters or overloading,
except for some built-in functions like `append` and `make`.

References
----------

This introduction is based on the following materials:

1. [A Tour of Go](https://tour.golang.org)
2. [Effective Go](https://golang.org/doc/effective_go.html)
3. [Go by Example](https://gobyexample.com/timeouts)
4. [Go Slices: usage and internals](https://blog.golang.org/go-slices-usage-and-internals)
5. [Defer, Panic, and Recover](https://blog.golang.org/defer-panic-and-recover)
