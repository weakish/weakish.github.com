# Ceylon v.s. Kotlin

void function
-------------

Kotlin uses `Unit` for functions returning nothing, like many functional languages,
while Ceylon uses `void` keyword.
void functions in Ceylon actually returns `Anything`.
This allows to use other non-void functions when void functions are expected,
and other non-void functions to accept void function as parameter.

Ceylon's `Anything` approach is flexible,
but it may not fit in a more disciplined coding style.
If non-void functions are used when void functions are expected,
then we are using side effects with non-void functions.
But a non-void function should avoid exposing side effects.

We can declare our own `Unit` class in Ceylon:

```ceylon
abstract class Unit() of unit {}
object unit extends Unit() {}

Unit f() {
    print("hi");
    return unit;
}

shared void run() {
    f();
}
```

Like assignment returning a value, Ceylon's behavior may also be influenced by C.
In C, any function can be converted to `void` via `(void) f`, discarding its return value.

Variadic arguments
------------------

Kotlin uses `vararg` keyword to mark variadic argument, while Ceylon just types
them with `T*` or `T+` (at least have an argument).  This is an example of
Ceylon's regularity of type system. Kotlin uses `Array<T>` for `vararg p: T`
underhood but special array types for basic types, e.g. `IntArray` for `vararg
p: Int`. However, `p: Array<T>` and `vararg p: T` behaves differently. In other
words, given a function `Array<T> -> Unit`, we do not know how to invoke it
just from its signature.


Function reference
------------------

Kotlin's function reference syntax is strange:

```kotlin
fun gf(x: Double, f: (Double) -> Double): Double {
    return f(x)
}
gf(2.0, ::findFixPoint)
```

Without `::` it will not work.

Languages using special function reference syntax usually saves `f` for `f()`.
But that is not allowed in Kotlin, either.
Instead, Kotlin saves `f` for a variable/property `f` with the same name!

```kotlin
val i = 2
fun i(): Int { return 2 };
print(i)
print(i())
```

Still Kotlin compiler cannot resolve the function reference
if there is a property which has the same name:

```kotlin
fun h(f: () -> Int) {
    print(f())
}
h(::i) // error: overload resolution ambiguity
```

Also, Kotlin only allows reference to `Foo::bar`
[not `foo::bar`][bound-callable-references].

[bound-callable-reference]: https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md

For anonymous function, there is no ambiguity.
Thus the function reference is normal.

```kotlin
val f = fun(): Int { return 1 }
h(i)
```

Ceylon's function reference is normal.

Ceylon does not support overloading. And function reference will not work for
Java overloading functions.

Inline functions
----------------

Kotlin supports inline functions.

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) {}
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        // body is called in another context `object: Runnable`,
        // thus we need the `crossinline` keyword.
        override fun run() = body()
    }
    // ...
}
```

Kotlin's inline function supports reified generics:

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p?.parent
    }
    return p as T
}
```

Ceylon does not support inline functions, and all generics are reified, except
interoperation with Java code.

IMO, languages should make function calls cheap, instead of bring in confusing
inline features.


Object
-------

Kotlin's object looks like class, and provides an `invoke` method to mimic
function call with object initialization.

```kotlin
object SingletonExample {
   fun singletonMethod() {
        return "We cannot initialize a singleton."
   }
   operator fun invoke() {
        return "`invoke` will be called when we write `SingletonExample()`."
   }
}
```

I dislike this feature.
Now every time I see `CapsName(something)`
I am not sure it returns an instance of `CapsName`.
It may return anything!

Ceylon's object does not have a `invoke` method.

```ceylon
shared object consoleWriter satisfies Writer {
    formatter = StringFormatter();
    write(String string) => process.write(string);
}
```

The downside of object (anonymous class) in Ceylon is if we ever need to write
code that refers to the concrete type consoleWriter, we must use the very ugly
syntax `\IconsoleWriter` as the type name.
A toplevel object in Ceylon is a singleton.

Object (anonymous class) in Ceylon is actually a value constructor:

```ceylon
// object thing {}
class \Ithing {
    shared new thing {}
}
\Ithing thing => \Ithing.thing;
```

Kotlin also has object expression.

```kotlin
val adHoc = object {
    var x: Int = 0
    var y: Int = 0
}
open class A(x: Int) {
    public open val y: Int = x
}

interface B

val ab = object : A(1), B {
    override val y = 15
}
```

Object expression in Ceylon:

```ceylon
return object extends Foo() satisfies Bar {
    // ...
};
```

An object expression is basically a shorthand for a local object declaration.

```ceylon
object foo extends Foo() satisfies Bar {
    // ...
};
return foo;
```

Kotlin uses component object to mimic Java static methods:

```kotlin
class ExampleClass(val x: Int) {
    companion object {
        // still a real object at runtime
        fun aMethodLooksLikeStaticButNot() = println("not static")
        @JvmStatic fun aMethodToBeCompiledToStaticMethodOnJVM() {
            println("compiled to static methods on JVM")
        }
    }
}
ExampleClass.aMethodLooksLikeStaticButNot()
ExampleClass.aMethodToBeCompiledToStaticMethodOnJVM()
```

Ceylon dose not support this.

Both Kotlin and Ceylon support top level function declaration,
something like package level static method.

Ceylon 1.3.1 introduces static member.

Also, Kotlin supports extension method.
Extension method on Kotlin is resolved statically,
only providing a way to call with `Class.method` syntax,
not actually modifying the extended class.

Similarly to functions, Kotlin supports extension properties. Again, Ceylon
does not support this.

Final class
-----------

Classes in Kotlin are `final` by default.
Also, Kotlin requires explicit `open` modifier for overridable members.
And a member marked override is itself open.
Also, properties declared in Interface are open.

```kotlin
open class OpenClass(x: Int) {
    open fun overridableMember() {}
}
open class ChildOfOpenClass(x: Int) : OpenClass(x) {
    override fun overridableMember() {}
}
```

Ceylon classes are by default open, unless annotated with `final`.
However, Ceylon also requires explicit annotation for overridable members:
- `formal` for declaration without implementation,
- `default` for `open` in Kotlin,
- `actual` for `override` in Kotlin (no `default` unless denoted).

Also, attributes in interface are not open by default in Kotlin.
You need to explicitly annotate it as `formal`.

`super` ambiguity
-----------------

Kotlin uses `super<A>.f()`.

```kotlin
open class A() {
    open fun f() { print("A") }
}

interface B {
    // Interface members are open by default.
    fun f() { print("B") }  // Allowing method implementations, like Java 8.
}

class ChildOfAB() : A(), B {
    // The compiler requires `f()` to be overridden.
    // So you do not need to remember rules of priorities
    // and check super class definitions for possible conflicts.
    override fun f() {
        super<A>.f()
        super<B>.f()
    }
}
```

Ceylon uses `(super of A).f()`.

```ceylon
class SelfReference() {
    // Ceylon has keywords `this` and `super`.
    // To deal with ambiguity of what `super` refers to, use the widening operator.
    class Impl() extends Class() satisfies Interface {
    // Suppose Impl inherits two different implementations of `ambiguous`
    // from Class and Interface.
        (super of Interface).ambiguous()
    }
}
```

getter and setter
-----------------

Kotlin uses `get()` and `set()` functions with optional backing field:

```kotlin
class GettersAndSetters(val x: Int) {
    var isEmpty: Boolean = null
        get() = this.x == 0
        // By convention, the name of the setter parameter is value,
        // but you can choose a different name if you prefer.
        set(value) {
            if (value == null) {
                // Kotlin provides an automatic backing `field`.
                field = false
            } else {
                // The field identifier can only be used in the accessors of the property.
                field = value
            }
        }
}
```

Ceylon uses anonymous setter and `assign` for getter,
without backing field.

```Ceylon
class GetterSetterExample() {
    variable String? rank = null;  // Ceylon never auto initializes to null.
    variable String? comment = null;
    shared String review => "``rank``: ``comment``";
    assign review {
        value tokens = review.split(":").iterator();
        if (is String first = tokens.next()) {  // narrowing down types
            rank = first;
        }
        if (is String second = tokens.next()) {
            comment = second;
        }
    }
}
```

In Kotlin, immutable variable `val` does not allow setter.
Ceylon's getter and setter are more flexible.
In the above example, we have a setter for immutable `review`.
The setter is valid, since it actually changes value of mutable `rank` and `comment`.

const
-----

Kotlin has compile time `const`:

```kotlin
const val VERSION: String = "alpha"
```

`const` only allows `String` or a primitive type.

Ceylon does not have this.

I have no idea why this need to be explicitly marked in Kotlin.
The compiler cannot automatically optimize this?

late init
---------

Kotlin has `lateinit` and Ceylon has `late` annotation.
But they are two different things.

Kotlin only allows non-nullable, not-primitive types to use `lateinit`. Kotlin
uses the `null` value to mark that a `lateinit` property has not been
initialized and to throw the appropriate exception when the property is
accessed. But primitive Java types can't have a 'null' value. In other words,
the property must be not nullable in Kotlin level, but nullable in Java level.

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()
    }
}
```

Ceylon uses `late` to suppress definite initialization checks.
In Ceylon, all declaration is done after initialization,
which may cause problems on circular reference.

```ceylon
class Child(parent) {
    shared late Parent parent;
}

class Parent() {
    // This won't work,
    // because `this` refers to an instance of Parent in its own initializer section,
    // where Parent has not been initialized yet.
    // shared Child child = Child(this);
    shared Child child = Child();
    child.parent = this; // ok, since parent is late
}
```

declaration-site variance
-------------------------

Both Kotlin and Ceylon uses declaration-site variance `<out Bar>`.

Ceylon also support use-site variance for interoperation with Java code.
So does Kotlin, with a slightly different syntax `<out Bar!>!`.



Generics constrains
-------------------

Kotlin uses common `T : Upper` syntax:

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {}
```

More than one upper bounds need to be specify in a where clause:

```kotlin
fun <T> cloneWhenGretter(list: List<T>, threshold: T): List<T>
        where T : Cloneable, T : Comparable {
    return list.filter{it > threshold}.map{it.clone()}
}
```

Ceylon has a more consistent syntax,
and uses intersection type for more than one upper bounds.

```
Value genericFunction<Value>(Value num, Value denom)
        given Value satisfies Comparable<Value> & Summable<Value>
        => if num > denom then num else num + denom;
```

Both Kotlin and Ceylon does not support raw type.
Kotlin has a similar star projection syntax:

Given `interface Function<in S, out T>`, `Function<*, *>` is a shortcut for
`Function<in Nothing, out Any?>`

Ceylon just supports explicit `Function<in Nothing, out Anything>`.

Also note that Ceylon uses `Anything` instead of `Any?` in Kotlin.
`Any` in Kotlin is not truly `Any` because it does not hold `null`.
Ceylon's `Anything` is an enumerated type:

```ceylon
shared abstract class Anything()
        of Object | Null {}
```

`of Object | Null` can be used in generics as enumerated constrain.

Anonymous function
------------------

Kotlin has both anonymous function and lambda:

```kotlin
// anonymous function
fun(): Unit { println(numbers.size) }
// lambda
{ n: Int -> n <= 0 }
// one parameter lambda can be abbreviated,
// also parameter type can be omitted if it can be inferred by compiler
{ it <= 0 }
```

The difference between lambda and anonymous function is:

- lambda cannot specify a return type
- control flow `return` in lambda returns the outer function

Ceylon just have anonymous function.

```ceylon
// Same as lambda in Kotlin, an anonymous function cannot specify return type.
(Integer n) => n <= 0
// Except `void`.
void (Integer n, Integer m) => print(m + n)
// Mark it with `function`
function (Integer n) => n <= 0
// Like `function`, `void` can be omitted.
() => print("Hi!")
// Same as above, with block
() { print("Hi!"); }
// Similar to Kotlin's anonymus function
function () { print("Hi!"); }
```

case
-----

Kotlin uses `when` for both `case` and `cond` in Scheme.

```kotlin
when {
    i == 0 -> false
    else -> true
}
when (i) {
    0 -> false
    else -> true
}
```

Ceylon just uses `switch` for `case`:

```ceylon
  void printID(String|Integer id) {
      switch (id)
      case (is String) {
          println(id);
      }
      case (is Integer) {
          switch (id)
          case (0) {
            println("Error");
          }
          else {
            println("id number: ``id``");
          }
      }
      // No `else` clause since all cases of a union type is exhausted.
}
```

Ceylon uses `switch` as statements,
while Kotlin uses `when` as both statements and expressions.

`case` must be both disjoint and exhausted in Ceylon.

```ceylon
shared abstract class Comparison(shared actual String string)
        of larger | smaller | equal {}
switch (x<=>y)  //  `<=>`  produces an instance of `Comparison`.
case (equal) {
    print("same same");
}
case (smaller) {
    print("x smaller");
}
case (larger) {
    print("y smaller");
}
```

Cases must be exhausted in Kotlin only in `when` expression.

In Ceylon, `switch` can declare a scoped local variable:

```ceylon
switch (name = process.arguments.first)
case (null) {
    print("Hello world!");
}
else {
    print("Hello ``name``!");
}
```

This is frequently used in Ceylon,
because Ceylon's case condition does not allow arbitrary expressions.
Only conditions like `exists`, `is Type`, `nonempty`
and literal values of basic types are allowed.

Catch checked exceptions from Java
----------------------------------

Kotlin does not have checked exceptions. So, normally, the Java signatures of
Kotlin functions do not declare exceptions thrown. If you want to call them in
try catch clause from Java, you need to annotate functions with
`@Throws(IOException::class)`.

The root of the exception hierarchy in Ceylon is `ceylon.language::Throwable`,
Unlike Java's `Throwable`, `ceylon.language::Throwable` is sealed and the only
subclasses available to users are `ceylon.language::Exception` and
`ceylon.language::AssertionError`.

The JVM implementation of `ceylon.language::Exception` is a
`java.lang.RuntimeException`. On the other hand,
`ceylon.language::AssertionError` is a `java.lang.Error` at runtime. This means
that pure Ceylon code compiled for the JVM can only generate unchecked
exceptions.

Impure Ceylon (that is, Ceylon code which access Java code) may throw any
exception that is thrown by that Java code, including checked exceptions. If a
Ceylon function may throw checked exceptions, you need to call it in a try
catch clause in Java.

Reassignment of function parameters
-----------------------------------

Kotlin does not allow reassignment of function parameters,
i.e. function parameters are always implicitly `val`,
like function parameters are always implicitly `let` in Swift.

Ceylon disallows this unless the function parameter is annotated as `variable`.
This is consistent with variable declaration.
