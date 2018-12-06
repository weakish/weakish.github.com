> First, generic types in Java are **invariant**, meaning that `List<String>` is **not** a subtype of `List<Object>`. 
> Why so? If List was not **invariant**, it would have been no 
> better than Java's arrays, since the following code would have compiled and caused an exception at runtime:

> ``` java
> // Java
> List<String> strs = new ArrayList<String>();
> List<Object> objs = strs; // !!! The cause of the upcoming problem sits here. Java prohibits this!
> objs.add(1); // Here we put an Integer into a list of Strings
> String s = strs.get(0); // !!! ClassCastException: Cannot cast Integer to String
```

First, if `List<Object> objs = strs;` passes `strs` as value,
like in TypedRacket, then `objs.add(1)` will not change `strs`.
Second, if generics types is not erased,
`objs.add(1)` a.k.a `strs.add(1)` will fail because `strs` is `List<String>`,
and `List<String>.add(s: String)` does not accept the integer `1`.
However, `List<String>` is erased to `List`, and `List.add(1)` succeed.
To work around this issue, Java insert type checking in `List<Object> objs = strs;`.
This makes generic types invariant.

Java dose not insert type checking for arrays, though.

```java
String[] strs = new String[5]
Object[] objs = strs  // succeed
objs[0] = "1"  // succeed, both objs and strs are `["1", null, null, null, null]`
objs[0] = 1  // java.lang.ArrayStoreException: java.lang.Integer
```

> So, Java prohibits such things in order to guarantee run-time safety. But this has some implications. For example, consider the `addAll()` method from `Collection`
> interface. What's the signature of this method? Intuitively, we'd put it this way:
>
> ``` java
> // Java
> interface Collection<E> ... {
>   void addAll(Collection<E> items);
> }
> ```
>
> But then, we would not be able to do the following simple thing (which is perfectly safe):
>
> ``` java
> // Java
> void copyAll(Collection<Object> to, Collection<String> from) {
  to.addAll(from); // !!! Would not compile with the naive declaration of addAll:
>                   //       Collection<String> is not a subtype of Collection<Object>
> }
> ```

> That's why the actual signature of `addAll()` is the following:
> 
> ``` java
> // Java
> interface Collection<E> ... {
>   void addAll(Collection<? extends E> items);
> }
> ```
>
> The **wildcard type argument** `? extends T` indicates that this method accepts a collection of objects of *some subtype of* `T`, not `T` itself.
> This means that we can safely **read** `T`'s from items (elements of this collection are instances of a subclass of T), but **cannot write** to 
> it since we do not know what objects comply to that unknown subtype of `T`. 
> In return for this limitation, we have the desired behaviour: `Collection<String>` *is* a subtype of `Collection<? extends Object>`. 
> In "clever words", the wildcard with an **extends**\-bound (**upper** bound) makes the type **covariant**.
> 
> The key to understanding why this trick works is rather simple: if you can only **take** items from a collection, then using a collection of `String`s
> and reading `Object`s from it is fine. Conversely, if you can only _put_ items into the collection, it's OK to take a collection of
> `Object`s and put `String`s into it: in Java we have `List<? super String>` a **supertype** of `List<Object>`.
> 
> The latter is called **contravariance**, and you can only call methods that take String as an argument on `List<? super String>` 
> (e.g., you can call `add(String)` or `set(int, String)`), while 
> if you call something that returns `T` in `List<T>`, you don't get a `String`, but an `Object`.
> 
> Joshua Bloch calls those objects you only **read** from **Producers**, and those you only **write** to **Consumers**. He recommends: "*For maximum flexibility, use wildcard types on input parameters that represent producers or consumers*", and proposes the following mnemonic:
> 
> *PECS stands for Producer-Extends, Consumer-Super.*
> 
> *NOTE*: if you use a producer-object, say, `List<? extends Foo>`, you are not allowed to call `add()` or `set()` on this object, but this does not mean 
> that this object is **immutable**: for example, nothing prevents you from calling `clear()` to remove all items from the list, since `clear()` 
> does not take any parameters at all. The only thing guaranteed by wildcards (or other types of variance) is **type safety**. Immutability is a completely different story.

### Declaration-site variance

> Suppose we have a generic interface `Source<T>` that does not have any methods that take `T` as a parameter, only methods that return `T`:
>
> ``` java
> // Java
> interface Source<T> {
>   T nextT();
> }
> ```
>
> Then, it would be perfectly safe to store a reference to an instance of `Source<String>` in a variable of type `Source<Object>` -- there are no consumer-methods to call. But Java does not know this, and still prohibits it:
>
> ``` java
> // Java
> void demo(Source<String> strs) {
>   Source<Object> objects = strs; // !!! Not allowed in Java
>   // ...
> }
> ```
>
> To fix this, we have to declare objects of type `Source<? extends Object>`, > which is sort of meaningless, because we can call all the same methods on such a variable as before, so there's no value added by the more complex type. But the compiler does not know that.

> In Kotlin, there is a way to explain this sort of thing to the compiler. This is called **declaration-site variance**: we can annotate the **type parameter** `T` of Source to make sure that it is only **returned** (produced) from members of `Source<T>`, and never consumed.
> To do this we provide the **out** modifier:
>
> ``` kotlin
> abstract class Source<out T> {
>   abstract fun nextT(): T
> }
>
> fun demo(strs: Source<String>) {
>   val objects: Source<Any> = strs // This is OK, since T is an out-parameter
>   // ...
> }
> ```
>
> The general rule is: when a type parameter `T` of a class `C` is declared **out**, it may occur only in **out**\-position in the members of `C`, but in return `C<Base>` can safely be a supertype 
> of `C<Derived>`.
>
> In "clever words" they say that the class `C` is **covariant** in the parameter `T`, or that `T` is a **covariant** type parameter. 
> You can think of `C` as being a **producer** of `T`'s, and NOT a **consumer** of `T`'s.
>
> The **out** modifier is called a **variance annotation**, and  since it is provided at the type parameter declaration site, we talk about **declaration-site variance**. 
> This is in contrast with Java's **use-site variance** where wildcards in the type usages make the types covariant.
>
> In addition to **out**, Kotlin provides a complementary variance annotation: **in**. It makes a type parameter **contravariant**: it can only be consumed and never 
produced. A good example of a contravariant class is `Comparable`:
>
> ``` kotlin
> abstract class Comparable<in T> {
>   abstract fun compareTo(other: T): Int
> }
>
> fun demo(x: Comparable<Number>) {
>   x.compareTo(1.0) // 1.0 has type Double, which is a subtype of Number
>  // Thus, we can assign x to a variable of type Comparable<Double> >
>   val y: Comparable<Double> = x // OK!
> }
> ```
>
> We believe that the words **in** and **out** are self-explaining (as they were successfully used in C# for quite some time already), 
> thus the mnemonic mentioned above is not really needed, and one can rephrase it for a higher purpose:
>
> **[The Existential](http://en.wikipedia.org/wiki/Existentialism) Transformation: Consumer in, Producer out\!** :-)

I'd like to try another (I hope it is simpler) way to understand this.

From

1. Given a function `T -> R`, its subtype is `supT -> subR`.
    (supT means T or superclass of T. Same as subR.)
2. `C<T>.f: R` is actually `f: C<T> -> R`.

we can conclude that:

Given a type `T`, `supT -> subT` is a subtype of `T -> T`.
In other words, it is safe to read from `supT`, and write to `subT`.
Thus given a type `C<T>`,
if a function body only reads from `C<T>`, and never writes to `C<T>`,
then in the function body, we can safely use `C<supT>` when `C<T>` is expected.
The above function accepts `C<T>` and only reads from `C<supT>` in its body,
we mark this function as accepting `C<out T>`.
Similarly, we mark the function accepting `C<T>`
and only writes to `C<subT>` in its body as accepting `C<in T>`.

Memorization:

- read-out, write-in
- deep in (<in T> { <subT> }, <out T> { <sup> T })

> ### Use-site variance: Type projections
>
> It is very convenient to declare a type parameter T as *out* and have no trouble with subtyping on the use site. Yes, it is, when the class in question **can** actually be restricted to only return `T`'s, but what if it can't?
> A good example of this is Array:
>
> ``` kotlin
> class Array<T>(val size: Int) {
>   fun get(index: Int): T { /* ... */ }
>   fun set(index: Int, value: T) { /* ... */ }
> }
> ```
>
> This class cannot be either co\- or contravariant in `T`. And this imposes certain inflexibilities. Consider the following function:
>
> ``` kotlin
> fun copy(from: Array<Any>, to: Array<Any>) {
>   assert(from.size == to.size)
>   for (i in from.indices)
>     to[i] = from[i]
> }
> ```
>
> This function is supposed to copy items from one array to another. Let's try to apply it in practice:
>
> ``` kotlin
> val ints: Array<Int> = arrayOf(1, 2, 3)
> val any = Array<Any>(3)
> copy(ints, any) // Error: expects (Array<Any>, Array<Any>)
> ```
>
> Here we run into the same familiar problem: `Array<T>` is **invariant** in `T`, thus neither of `Array<Int>` and `Array<Any>`
> is a subtype of the other. Why? Again, because copy **might** be doing bad things, i.e. it might attempt to **write**, say, a String to `from`,
> and if we actually passed an array of `Int` there, a `ClassCastException` would have been thrown sometime later.
>
> Then, the only thing we want to ensure is that `copy()` does not do any bad things. We want to prohibit it from **writing** to `from`, and we can:
>
> ``` kotlin
> fun copy(from: Array<out Any>, to: Array<Any>) {
>  // ...
> }
> ```
>
> What has happened here is called **type projection**: we said that `from` is not simply an array, but a restricted (**projected**) one: we can only call those methods that return the type parameter
> `T`, in this case it means that we can only call `get()`. This is our approach to **use-site variance**, and corresponds to Java's `Array<? extends Object>`,
> but in a slightly simpler way.

The root clause is in Kotlin `C<SubT>` (`SubT` denoted a subtype of `T`)
is *not* a subtype of `C<T>`.
Thus a function accepting `C<Any>` will not accept `C<Int>`.
However, if a function accepting `C<out Any>`,
it will only reads from `C<Any>` (`supAny` is `Any` itself),
thus it is safe to accept `C<Int>` since it is safe to read `C<Int>` as `C<any>`.


> ### Star-projections

> Kotlin provides so called **star-projection** syntax for this:
>
> - For `Foo<out T>`, where `T` is a covariant type parameter with the upper bound `TUpper`, `Foo<*>` is equivalent to `Foo<out TUpper>`. It means that when the `T` is unknown you can safely *read* values of `TUpper` from `Foo<*>`.
> - For `Foo<in T>`, where `T` is a contravariant type parameter, `Foo<*>` is equivalent to `Foo<in Nothing>`. It means there is nothing you can *write* to `Foo<*>` in a safe way when `T` is unknown.
> - For `Foo<T>`, where `T` is an invariant type parameter with the upper bound `TUpper`, `Foo<*>` is equivalent to `Foo<out TUpper>` for reading values and to `Foo<in Nothing>` for writing values.

Just ignore those `covariant`, `contravariant` and `invariant` concepts:

Given `C<out T>`, we can safely read `C<T>` as `C<supT>`.
Assume `T` is unknown, the only safe-guaranteed choice for `supT` is `Any?`.
If we know `T` has an upper bound `U` of `T`, then `U` is safe for `supT`.
Thus `C<*>` is equivalent to `C<out T>`
Similarly, given `C<in T>`, `C<*>` is equivalent to `C<in Nothing>`.
Since the definition of `Nothing` is `public class Nothing private () {}`,
in which the private constructor invisible to anyone outside prevents constructing an instance,
we cannot write anything to `C<T>` if `T` is unknown.
Also, given `C<T: U>`, we can safely read it as `C<U>` and write it as `C<Nothing>` if `T` is unknown.
Thus `C<*>` is equivalent to `C<out U, in Nothing>`.
