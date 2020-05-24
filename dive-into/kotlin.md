# On Design of Kotlin

Good parts
-------------

### Assignments are not expressions

```kotlin
if (a = 1) { println(2) }
error: assignments are not expressions, and only expressions are allowed in this context
```

### Not nullable by default

By default values are not nullable. Nullable values are declared as `T?`.

Bad parts
-----------

### Type erasure

> Like Java’s, Kotlin’s generics are not retained at runtime,
> i.e. objects do not carry information about actual type arguments
> passed to their constructors, i.e.
> `ArrayList<Integer>()` is indistinguishable from `ArrayList<Character>()`.
> This makes it impossible to perform is-checks
> that take generics into account.
> Kotlin only allows is-checks for star-projected generic types.

-- [Kotlin Reference](https://kotlinlang.org/docs/reference/java-interop.html)

Because they thought reified generics are expensive on JVM:

> on the JVM reified generics are expensive

-- [Kotlin Blog: M10 is out](http://blog.jetbrains.com/kotlin/2014/12/m10-is-out/)

But

> FTR I am not sure I believe that explanation.
> I was with Gavin a few years ago
> when Andrey Breslav asked us
> if we were going to implement reified generics
> (we had not yet at the time)
> because they were having trouble implementing it
> and so if we were not going to implement it, they would not bother.
>
> My guess is they tried and failed, strictly based on this conversation.
> It's possible that they really considered it too expensive,
> but I since that's not backed by public experiments
> and our own experiments tell us
> it's not that expensive for the benefits it gives us,
> I don't _have_ to believe them ;)

-- [UnFroMage commented on HackerNews](https://news.ycombinator.com/item?id=10466643)

### No union types

No union types yet. ([547])

[547]: https://discuss.kotlinlang.org/t/any-thoughts-on-ceylon-style-union-and-intersection-types/547

### No checked exceptions

Kotlin does not support checked exceptions.

I think the good part of checked exception is
to force you think about corner cases,
and the bad part is increasing verbosity.

Ceylon does not support checked exceptions either.
But Ceylon supports union types.
In fact, Java's checked exception mimics union types.

Kotlin supports neither checked exception, nor union types.
Thus its type system cannot check whether a function may raise an exception
(unless the exception is representable as null)
and what exceptions it may raise.

However, throwing one exception is a good practice in common situations.

> The reason that you would, ideally, want to only throw one type of exception
> is because doing otherwise likely violates the Single Responsibility and
> Dependency Inversion principles.
>
> ...
>
> ```java
> public String getData(int id) throws FileNotFoundException
> ```
>
> Now, we have a change in requirements, and our data comes from a database.
>
> ...
>
> ```java
> public String getData(int id) throws SQLException
> ```
>
> We would now have to go through all code that uses our method
> and change the exception we have to check for, else the code won't compile.
>
> Dependency inversion says that we really shouldn't throw either
> of these exceptions
> because they expose internal implementation details
> we are working to encapsulate.
> ...
> Instead we should throw an exception
> that conveys the error at the same level of abstraction
> as we are exposing through our API.

-- [cbojar, 2014-11-29](http://programmers.stackexchange.com/a/264068/65620)

For a similar reason, Swift just uses `throws` in function signature,
to declare a function which may throw exceptions,
without specifying types of exception.

Another reason to throw only one exception is Single Responsibility:

> As for Single Responsibility, we need to think about code
> that throws multiple, unrelated exceptions.
> Let's say we have the following method:
>
> ```java
> public Record parseFile(String filename) throws IOException, ParseException
> ```
>
> What can we say about this method? We can tell just from the signature
> that it opens a file **and** parses it.
> When we see a conjunction, like "and" or "or"
> in the description of a method,
> we know that it is doing more than one thing;
> it has more than one **responsibility**.
> Methods with more than one responsibility are hard to manage
> as they can change if any of the responsibilities change.
> Instead, we should break methods up so they have a single responsibility:
>
> ```java
> public String readFile(String filename) throws IOException
> public Record parse(String data) throws ParseException
> ```

-- [cbojar, 2014-11-29](http://programmers.stackexchange.com/a/264068/65620)


Mixed feelings
----------------

### `return` behaves differently in lambda and anonymous function

Kotlin distinguishes lambda expression and anonymous function.
In lambda, `return` returns from the outer function.

This reminds me of the dark side of Ruby.
Ruby also distinguishes `proc` created by lambda expression and `Proc.new`.
In Ruby,the `return` statement in `proc` created by `Proc.new`
will not only returns control just from itself,
but also from the method enclosing it.

To be fair, Kotlin is more reasonable than Ruby.
In Kotlin, lambda does not allow explicit return result expression.

### Use `when` for both `case` and `cond` in Scheme

Kotlin uses `when` for both `case` (pattern matching)
and `cond` (conditional expression) in Scheme.

```kotlin
when {
    f(i) -> false  // f = { it == 0}
    else -> true
}
when (i) {
    g(i) -> false  // g = { if (it == 0) 0 else 1 }
    else -> true
}
```

Unless you remember the definition of `f` or `g`,
you does not know whether it is pattern matching or conditional expressions
until you go back to the beginning of the `when` expression.

A workaround is to make it explicit using the full expression of condition:

```kotlin
when {
    f(i) == true -> false  // f = { it == 0}
    else -> true
}
when (i) {
    g(i) -> false  // g = { if (it == 0) 0 else 1 }
    else -> true
}
```

Or use an explicit function name:

```kotlin
when {
    isZero(i) -> false  // isZero = { it == 0}
    else -> true
}
when (i) {
    matchesZero(i) -> false  // matchesZero = { if (it == 0) 0 else 1 }
    else -> true
}
```

This workaround does not work when `i` itself is a `Boolean`.

However, if `i` is a `Boolean`, usually we will use `when` as:

```kotlin
when (i) {
    true -> ...
    false -> ...
}
```

Ambiguity does exist
when we match `i` against `Boolean` value returned by other functions.

### Boxed types in Java

Some types are boxed in Java, which does not preserve identity, and often preserve equality.

```kotlin
val a: Int = 10000
print(a === a) // Prints 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA === anotherBoxedA) // !!!Prints 'false'!!!
print(boxedA == anotherBoxedA) // Prints 'true'
```

This confuses me.
I understood that interoperability is important, though.

### String templates

String templates are supported both inside raw strings and inside escaped strings. If you need to represent a literal `$` character in a raw string (which does't support backslash escaping), you can use the following syntax):

```koltin
val price = """
${'$'}9.99
"""
```

`${'$'}` looks ugly to me.
And dollar signs are common in text for prices.
And I wonder whether raw strings with templates are truly raw.
Even if we did need templates in raw string,
I think restricting it to `${var}` is better.
Put this under "mixed feeling" rather than "bad parts",
because I think this is trivial after all.


Conclusion
-------------

Kotlin is an improved Java, featuring interoperability.
Most features are already in Java as "best practices".

On other side, it lost checked exception.

Read more on my opinions on the design of Kotlin in [Ceylon v.s. Kotlin](/dive-into/ceylon-kotlin/)
