Modules
-------

Ceylon has its own modular system, a simple `module.ceylon` to declare dependencies.
And the compiler will auto fetch modules from Internet if needed.

Kotlin does not provide this mechanism.
You need to use `maven` or `gradle`, i.e. XML or Groovy.

Standard library
----------------

Ceylon has a limited standard library (Ceylon SDK),
using modular system.
So a standard library will not increase packaged size if you not use them.
For example, on Android if your code uses `ceylon.http.client` but not `ceylon.http.server`,
the latter will not be packaged to jar file by Ceylon compiler.

Also, some modules of Ceylon are still JVM only.

Kotlin does not have its own standard library.
(`stdlib` is actually part of the language.)

Compiler and command line tools size
------------------------------------

```
23M kotlin
21M ceylon
```

Both are not very big not counting JDK itself.
FYI jruby distribution occupies 51M and scala 32M.


Packaged jar with runtime
-------------------------

Kotlin:

```sh
kotlinc -include-runtime -d output.jar file.kt
```

Ceylon:

```sh
# Only works for module
; ceylon compile
compiled com/example/hello/0.0.0
; ceylon fat-jar com/example/hello/0.0.0
```

For a very simple source file, Ceylon's jar file is about 2x large as Kotlin's.

```
788K    kotlin.jar
2.6M   com.example.hello-0.0.0.jar
```

Both are not big.
And for real projects using several modules, the language runtime occupies a
small portion of the whole jar file.
However, for small Android applications using few modules, Kotlin has less overhead.

Beside runtime, Ceylon's `fat-jar` also packs all dependencies.
For example, a simple ceylon module calling Kotlin source code result in `3.3M` jar file.
`kotlinc` does not have a `fatjar` option,
we need to package a fat jar with external tools like gradle.


Memory overhead
---------------

Kotlin has less than 200K overhead on RAM.
Ceylon has 4-5M overhead.

REPL
----

Kotlin: `kotlinc`.

Ceylon: none.

IDEs
----

Ceylon IDE is based on Eclipse.
It also provides an IntelliJ plugin.

Kotlin, also developed by JetBrains, is shipped with recent versions of IntelliJ.
Recent versions of Kotlin has better IntelliJ support, like postfix code completion.
Kotlin is also available on Eclipse.

Mutability
----------

In Ceylon, variables are by default immutable, unless annotated with
`variable`.

In Kotlin, Scala style `val` and `var` keywords are used to declare mutable and
immutable variables.

Kotlin is less verbose in declaring variables with the cost of more keywords.

Nullability
-----------

Kotlin uses `nullableString?.length ?: -1`,
and Ceylon uses `nullableString?.size else -1`.

There is no equivalent operator to `assumeNotNull!!.length` in Ceylon.
Ceylon requires an additional `assert` statement (which narrows down types).

Collection constructor
----------------------

Kotlin uses plain function call `listOf(1, 2, 3)`,
while Ceylon has more syntax sugar `[1, 2, 3]`.

Range, operator and infix function
----------------------------------

Kotlin has `10 downTo 0`.
Ceylon has no equivalence.
Just use `.reversed` in Ceylon.
It is not possible define your own `downTo` in Ceylon,
since Ceylon does not support operator overloading or infix function.

Ceylon is against operator overloading (infix function looks like operator),
because they do not work smoothly with generics,
to make your class compatible with `+`, your class need to satisfy interface `Summable` (semigroups).

Return value of assignment statement
------------------------------------

Kotlin's assignment statement is not expression.

Ceylon's assignment returns assigned value, like C and JavaScript:

```ceylon
variable Boolean b = false;
if (b = true) {
    print("a typo in the above line, should be `==` instead of `=`");
}
```

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

Omit inferred return type of short functions
---------------------------------------------

Kotlin:

```kotlin
fun shortHand(x : Int) = x + 1
```

Ceylon:

```ceylon
function shortHand(Int x) => x + 1;
```

Also note that semicolons are required in Ceylon.

Named argument
---------------

Kotlin has a common syntax:

```kotlin
shortHand(x = 1)
```

Ceylon has a different syntax:

```ceylon
shortHand { x = 1 };
shortHand { 1 };  // if order is preserved
```

Ceylon's uses braces because named argument list is close to function or class
body. Declaration of functions, objects (anonymous classes) and getter are
allowed in named argument list.

This allows to build a DSL:

```ceylon
Html {
doctype = html5;
Head {
    title = "Welcome Message";
    Link {
        rel = stylesheet;
        type = css;
        href = "/styles/screen.css";
        id = "stylesheet";
    }
};
Body {
    H2 ( "Welcome to Ceylon ``language.version``!" ),
    P ( "Now get your code on :)" )
};
```

Kotlin uses a another syntax feature to build a similar DSL: If lambda
expression is the last parameter of a function, it may be put out of parens,
and if it is the only parameter, parens may be omitted.

```kotlin
html {  // Not as explicit as Ceylon that there is an `HTML`/`Html` type/class.
    head {
      title {+"XML encoding with Kotlin"}
    }
    body {
      h1 {+"XML encoding with Kotlin"}
      p  {+"this format can be used as an alternative markup to XML"}

      a(href = "http://kotlinlang.org") {+"Kotlin"}
    }
}
```

Lazy delegation
---------------

Kotlin has lazy delegation:

```kotlin
val lazyValue: String by lazy {
    println("computed!")
    "hello"
}
```

Ceylon has no similar feature yet.
An ugly workaround:

```ceylon
class LazyInitialization() {
    // abuse the `variable` annotation
    variable Float? _pi = null;
    shared Float pi
        => _pi else (_pi=calculatePi());
}
```

Kotlin also provides other delegates like `observable` and `vetoable`.

Class delegation
----------------

Kotlin supports class delegation:

```kotlin
// require interface
interface Base {
  fun print()
}

class BaseImpl(val x: Int) : Base {
  override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main(args: Array<String>) {
  val b = BaseImpl(10)
  Derived(b).print() // prints 10
}
```

Ceylon has no equivalence.

Tail recursion optimization
---------------------------

Kotlin has tail recursion optimization
(requires explicitly marked with keyword `tailrec`):

```kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double
        = if (x == Math.cos(x)) x else findFixPoint(Math.cos(x))
```

Ceylon misses this feature.
Features like delegation is possible with some verbosity, but tail call should
be optimized by language. Reactor tail recursion to loop by hand is tedious.


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

Class constructor
-----------------

Kotlin

```kotlin
class ClassWithInit public constructor(val x: Int) {
    init {
        print("optional initial function")
    }
}
```

Ceylon

```ceylon
class ClassWithDefaultConstructor {
    shared Integer x;
    void new(Integer x) {
        this.x = x;
    }
}
class UsuallyDoNotNeedConstructor(shared Integer x) {}
```

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

Annotation
----------

Kotlin declares annotations with classes.

```kotlin
annotation class Special(val why: String)
@Special("example") class Foo {}
```

Ceylon declares annotations with function constructor.

```ceylon
shared annotation TodoAnnotation todo(String text) => TodoAnnotation(text);
shared final annotation class TodoAnnotation(String text)
        satisfies SequencedAnnotation<TodoAnnotation> {
    string => text;
}
// Read annotation from run time.
String[] todos = annotations(`TodoAnnotation`, `function myFunction`)*.text;
```

Ceylon's annotation supports more fine tunning.
Ceylon also uses annotation much more ofter than Kotlin,
`variable`, `shared` and `doc` are all annotations in Ceylon.
`var` and `public` are keywords in Kotlin,
and Kotlin documentation KDoc uses special `/** ... */` comment style,
generated by external tool Dokka.

`` `TodoAnnotation` `` and `` `function myFunction` `` are metemodel in Ceylon.
`function myFunction` returns the the detyped reference object for the
function, an instance of `FunctionDeclaration`. Similarly, `TodoAnnotation`
returns the metamodel object for the type TodoAnnotation, an instance of
Class<TodoAnnotation,[String]>, which captures the type of the referenced
program element.

Also, Kotlin put module documentation in separate markdown file.

Ceylon's api doc is generated by Ceylon compiler self, via `doc` annotation.
Kotlin still uses the old parsing special marked comments approach.

Data class
----------

Kotlin has `data class`, with `copy` and `componentN` methods.
Data classes cannot be abstract, open, sealed or inner;
Data classes may not extend other classes,
(but can satisfies interface).

```kotlin
data class JustHoldData (val x: Int, val y: Int)
val bar = JustHoldData(1, 2)
var (a, b) = bar
// The above destructuring declaration is syntax sugar for:
var a = bar.component1()
var b = bar.component2()
```

Ceylon does not have data class.
Ceylon supports destructing on `Tuple`
(a linked list with static types of each element captured).

```Ceylon
[Float,Float,String] point = [0.0, 0.0, "origin"];
value [x, y, label] = pointSugar;
```

enum
-----

Kotlin has `enum`:

```kotlin
enum class EnumExample {
    ExampleClass,
    JustHoldData
}
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };  // ; separates the enum constant definitions from the member definitions

    abstract fun signal(): ProtocolState
}
```

Ceylon dose not have `enum`.
In Ceylon, we can mimic `enum` with value constructor:

```ceylon
class ProtocolState of waiting | talking {
    String signal;
    shared new waiting { signal = "talking"; }
    shared new talking { signal = "waiting"; }
}
```

Kotlin's enum constants also implement the Comparable interface,
with the natural order being the order in which they are defined.

```kotlin
EnumExample.JustHoldData > EnumExample.ExampleClass  // true
```

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

Union types
-----------

Ceylon features union types.
`String?` is in fact a union type `String|Null`.

Kotlin has sealed class to mimic union types with verbosity and complexity.

```Kotlin
sealed class Alphanum {
  open class Alphabet(val x: String) : Alphanum()  // a subclass of sealed class
  class Number(val x: Int) : Alphanum()  // must be nested in sealed class declaration
}

fun bar(x: Int): Alphanum {
  if (x > 1) {
    val two = Alphanum.Number(2)
    return two
  } else {
    val bad = Alphanum.Alphabet("bad")
    return bad
  }
}

fun baz(x: Int): Any {
  val res = bar(x)
  // We cannot just return `res.x`,
  // because Kotlin only knows `res` is `AlphaNum`,
  // and is not smart enough to know all subclasses of `AlphaNum`
  // has property `x`.
  when (res) {
    is Alphanum.Alphabet -> return res.x
    is Alphanum.Number -> return res.x
  }
}
```

Sealed class in Ceylon is a totally different thing. Ceylon uses `sealed`
annotation to prevent certain kinds of use of the declaration outside the
module containing the declaration.

A sealed interface cannot be satisfied by a class or interface outside the
module in which it is defined.

A sealed class cannot be extended or instantiated outside the module in which
it is defined.

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

Type information about Java object
----------------------------------

Kotlin uses `Foo::class.java` and `foo.javaClass`.

Ceylon uses `javaClass<Foo>` and `javaClassFromInstance(foo)`.

JNI
----

Kotlin uses the `external` keyword to mark a native (C/C++) function:

```kotlin
external fun foo(x: Int): Double
```

Ceylon dose [not support native libraries yet][#3743]. You need to first write a
Java JNI methods, then call it from Ceylon.

[#3743]: https://github.com/ceylon/ceylon/issues/3743

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

In Ceylon, `switch` can declare a local variable whose scope is cases:

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

Nullability annotations
-----------------------

In Kotlin, Java types which have nullability annotations are represented as
actual nullable or non-null Kotlin types, without inserting null checks at
runtime.

Ceylon [supports this in 1.3](https://github.com/ceylon/ceylon/issues/4584)

Call Kotlin/Ceylon toplevel functions from Java
-----------------------------------------------

Kotlin wraps top level functions in `FilenameExtension` class:

```kotlin
// example.kt
package demo

fun bar() {
}
```

```java
demo.ExampleKt.bar();
```

You can change the name of the wrapper class with `@file:JvmName("DemoUtils")`.
This is necessary if you want to move top level functions between source files
without breaking Java code calling them.


Ceylon automatically converts toplevel function `f` to `f_.f` (one class per function).

```ceylon
shared Boolean foo(Boolean b) => !b;
```

```java
boolean value = foo_.foo(false);
```

Call functions with default parameter from Java
-----------------------------------------------

Ceylon automatically generates all overloaded versions.

In Kotlin, only functions annotated `@JvmOverloads` will generates overloaded
versions. Otherwise it will be visible in Java only as a full signature, with
all parameters present.

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

Java Bean accessors
-------------------

Both Ceylon and Kotlin maps Java Bean style accessors to attributes/properties.

Kotlin will not convert static `get*` method.

For example:

```java
// java & kotlin
Runtime.getRuntime()

// ceylon
Runtime.runtime
```

Reassignment of function parameters
-----------------------------------

Kotlin does not allows reassignment of function parameters,
i.e. function parameters are always implicitly `val`,
like function parameters are always implicitly `let` in Swift.

Ceylon disallows this unless the function parameter is annotated as `variable`.
This is consistent with variable declaration.

avian
-----

[avian] jvm runtime is small (6.8M on my machine).
However, avian only provides a subset of Java APIs.
Both Kotlin and Ceylon requires Java APIs not implemented in avian.
Kotlin requires `java.nio.charset`,
and Ceylon requires `java.lang.invoke`, `java.nio.charset`,
`java.nio.file`, `java.nio.file.attribute`, `java.security.spec`,
none of which is implemented in avian.
So avian will not run Ceylon compiled file except for trivial programs.
Kotlin uses `java.nio.charset` in `FileReadWrite`, `IOStream`,
and conversion between `String` and `ByteArray`.
If your Kotlin programs does not use these, avian may be able to run them.

[avian]: https://readytalk.github.io/avian/

Conclusion
----------

I prefer Kotlin if:

- targeted Android (plenty Android frameworks available in Kotlin)
- uses tail recursions heavily
  (I can call Kotlin from Ceylon, though)
- targeted Avian (I may use Java directly though.)

and Ceylon if:

- need a more powerful type system
- do not want to mess up with maven or gradle for modules and fat jar

Ceylon was quirky to interoperate with Java,
but Ceylon 1.2.1 improved interoperability greatly.
