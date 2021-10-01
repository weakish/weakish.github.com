# Notes on A little Java, a Few Patterns

Advantages of Java
------------------

- a small core language with a simple semantic model
- gc

Design Patterns
---------------

Design patterns are used:

- to organize your code
- to communicate with others

Introductory Language
---------------------

Recommended introductory language: Scheme or ML.

Too Much Coffee
---------------

**Q:** Is it confusing that we need to connect `int` with `Integer` (e.g. `Integer(5)`)
   and `boolean` with `Boolean` (e.g. `Boolean(false)`)?

**A:** Too much coffee does that.

Note the book uses an early version of Java.
Current Java can do auto boxing and unboxing for primitive types.

Also, in this book, if the method specified its return type as `Object` in interface,
then its implementation also annotated as returning `Object`,
even when the implementation in fact always returns `Boolean`.

**Q:** There is no number `x` in the world for which

    x = x + 1

So why should we expect there to be a Java `p` such that

```java
p = new Top(new Anchovy(), p)
```

**A:** That's right. But that's what happens when you have one too many double espresso.

Semicolon on Its Own Line for Mutability
----------------------------------------

```java
class PutSemicolonOnItsOwnLineForMutability
{
    Pie p = new Crust();
    Pie p = new Top(new Anchovy(), p)
    ; // the future begins, i.e. from this line on, references to `p` reflect the change
    Pieman yy = new Bottom();
    yy.addTop(new Anchovy())
    ; // same as above
}
```

LittleJava.java
---------------

```java
// `D` means this is a data class.
abstract class Numᴰ {}

class Zero extends Numᴰ {}

class OneMoreThan extends Numᴰ {
    Numᴰ predecessor;

    // Constructor
    OneMoreThan(Numᴰ _p) {
        predecessor = _p;
    }
}

/*
We did not tell you these are Peano axioms.
We din not give formal definition.
So you can form your own definition.
Try to give it a name by yourself.
This helps you to remember and understand it better.
 */





/* This book shows how to protect direct access to property without the `private` access modifier.

   Wrap it into an interface. In that interface, only expose public methods, not the "private" property.
 */

/* Visitor pattern */
abstract class Shishᴰ
{
    OnlyOnionsⱽ ooFn = new OnlyOnionsⱽ();
    abstract boolean onlyOnions();
}

class OnlyOnionsⱽ
{
    boolean forSkewer()
    {
        return true;
    }

    boolean forOnion(Shishᴰ s)
    {
        return s.onlyOnions();
    }

    boolean forLamb(Shishᴰ s)
    {
        return false;
    }

    boolean forTomato(Shishᴰ s)
    {
        return false;
    }
}

class Skewer extends Shishᴰ
{
    boolean onlyOnions()
    {
        return ooFn.forSkewer();
    }
}

class Onion extends Shishᴰ
{
    Shishᴰ s;
    Onion(Shishᴰ _s)
    {
        s = _s;
    }

    boolean onlyOnions()
    {
        return ooFn.forOnion(s);
    }
}
class Lamb extends Shishᴰ
{
    Shishᴰ s;
    Lamb(Shishᴰ _s)
    {
        s = _s;
    }

    boolean onlyOnions()
    {
        return ooFn.forLamb(s);
    }
}
class Tomato extends Shishᴰ
{
    Shishᴰ s;
    Tomato(Shishᴰ _s)
    {
        s = _s;
    }

    boolean onlyOnions()
    {
        return ooFn.forTomato(s);
    }
}
/* Before introducing visitor pattern,
   every subclass of Shishᴰ need to contain the logic of `onlyOnions()` in its definition.
   And the book asked "Wasn't this overwhelming?"
   I had thought it would introduce generics next.
   But it turned out to be the visitor pattern.
   Oh, I forgot Java's generics are not reified.

   If Java had reified generics:

       class Shishᴰ
       {
           <S: Shishᴰ> boolean onlyOnions(S s)
           {
               if (s instanceof Sewer)
               {
                   return true;
               }
               else if (s instanceof Onion)
               {
                   return onlyOnions(s.s);
               }
               else
               {
                   return false;
               }
           }
       }
 */



/* This is for the loyal Schemers and MLers. */

interface Tᴵ
{
    // It seems Java does not allow unicode arrows in identity name.
    // So we use the Chinese character `一` (one), which has a similar shape.
    o一oᴵ apply(Tᴵ x);
}

interface o一oᴵ
{
    Object apply(Object x);
}

interface oo一ooᴵ
{
    o一oᴵ apply(o一oᴵ x);
}

interface oo一oo一ooᴵ
{
    o一oᴵ apply(oo一ooᴵ x);
}

class Y implements oo一oo一ooᴵ
{
    public o一oᴵ apply(oo一ooᴵ f)
    {
        return new H(f).apply(new H(f));
    }
}

class H implements Tᴵ
{
    oo一ooᴵ f;
    H(oo一ooᴵ _f)
    {
        f = _f;
    }

    public o一oᴵ apply(Tᴵ x)
    {
        return f.apply(new G(x));
    }
}

class G implements o一oᴵ
{
    Tᴵ x;

    G(Tᴵ _x)
    {
        x = _x;
    }

    public Object apply(Object y)
    {
        return (x.apply(x)).apply(y);
    }
}

class MKFact implements oo一ooᴵ
{
    public o一oᴵ apply(o一oᴵ fact)
    {
        return new Fact(fact);
    }
}

class Fact implements o一oᴵ
{
    o一oᴵ fact;
    Fact(o一oᴵ _fact)
    {
        fact = _fact;
    }

    public Object apply(Object i)
    {
        int inti = ((Integer) i).intValue();
        if (inti == 0)
        {
            return new Integer(1);
        }
        else
        {
            return
                new Integer(
                    inti
                    *
                    ((Integer)
                        fact.apply(new Integer(inti - 1))).intValue());
        }
    }
}

// Try to figure out how the above code works.
// First the concrete one `Fact`.
// To construct a `Fact`, we need a `fact`.
// Suppose we already have `fact`, then we call `fact.apply(n - 1)`.
// To successfully continue the recursion,
// `fact.apply(n - 1)` should be equivalent to something like `New Fact(...).apply(n - 1)`.
// Oh! We need to construct a new `Fact`, which requires a `fact` again.
// But wait. We already have `fact`, so we can reuse it.
// That's it -- self reference.
class Dummy implements o一oᴵ
{
    public Object apply(Object x)
    {
        return new Fact(this).apply(x);
    }
}

// It works.
// And it also what `MKFact.apply` needs.
//
// Let's move on.
// `Fact` implements `o一oᴵ`, and `MKFact` implements `oo一ooᴵ`.
// `o一oᴵ` is like a constructor,
// and `oo一ooᴵ` is like a higher-order function taking a function and returning a function.
// Similarly, `oo一oo一ooᴵ` is like a function taking a higher-order function that takes a function and returning a function.
// Also `Tᴵ` is like a higher-order function returning a function.
//
// Now is the `Y`, `H`, `G` classes.
// Our `Dummy` class works, but it makes `MKFact` redundant.
// We need to find a way to produce `Fact` from `MKFact` without defining extra classes.
// Let's look at the types.
// `Fact` implements `o一oᴵ`, and `MKFact` implements `oo一ooᴵ`.
// So we need something that takes `oo一ooᴵ` and returns `o一oᴵ`, a.k.a `oo一ooᴵ -> o一oᴵ`.
// `Y.apply` happens to have such a signature.
// Thus probably we can get a `Fact` through `new Y().apply(new MKFact())`?
// And it works.
// Why?
// Revisit our `Dummy` class.
// In `New Fact(new Dummy())`, `(new Dummy).apply` calls back `New Fact(this)`.
// Next we demonstrate `new Y().apply(new MKFact())` is an equivalent form without `this`.
// And by the definition of `Y`, `new Y().apply(new MKFact())` is `new MKFact().apply(new G(new H(new MKFact())))`.
// Let `x = new G(new H(new MKFact()))`, we have `new MKFact().apply(x)`.
// By the definition of `MKFact`, it is `new Fact(x)`.
// Then we check what is `new Fact(x).apply(n)`.
// Fill in the value of `x`, it is `new Fact(new G(new H(new MKFact())).apply(n)`.
// By the definition of `Fact`, it is `new G(new H(new MKFact())).apply(n)`.
// By the definition of `G`, it is `new H(new MKFact()).apply(new H(new MKFact())).apply(n)`.
// By the definition of `H`, it is `new MKFact().apply(new G(new H(new MKFact()))).apply(n)`.
// By the definition of `MKFact`, it is `new Fact(x).apply(n)`.
// That is it. Self-referring to `Fact` itself without using `this`!
//
// This is the mighty Y combinator.
// The scheme version is in The Little Schemer, chapter 9.
//
// Let's walk through the reinvention of it in Java.
//
// First let's write a straightforward recursion version of `fact`.
class StaticFact
{
    static int fact(int n)
    {
        if (n == 0)
        {
            return 1;
        }
        else
        {
            return n * fact(n - 1);
        }
    }
}

// Hmm, we haven't introduced static method in this book.
// We did mention using static method like `Math.max` in footnotes,
// but we never explain how to *declare* a static method.
// Thus we changed it to a non static version.
// The definition is almost the same.
class NormalFact
{
    int fact(int n)
    {
        if (n == 0)
        {
            return 1;
        }
        else
        {
            return n * fact(n - 1);
        }
    }
}

// We refer `fact` itself in function body, which is not possible in lambda calculus.
// So we pass a function as parameter instead.
// Oh, no! Java dose not support first class function.
// Hmm, in fact we could pass a function via the reflection API, or as a lambda in Java 8.
// But none of them is available when this book is written.
// Thus we wrap the function in a class.
// Note that we do not need a separate class.
class Fact1
{
    int apply(Fact1 f, int n)
    {
        if (n == 0)
        {
            return 1;
        }
        else
        {
            return n * f.apply(f, n - 1);
        }
    }
}
// Nice!
// But lambda can only accept one parameter.
// We need to change `Fact1.apply` to return a function.
// Again in Java we return a wrapped class instead.
// To make future changes easier,
// we declare an additional interface instead of using hard-coded class.
interface Fact2ᴵ
{
    int apply(int n);
}
class NClosure implements Fact2ᴵ
{
    Fact2 f;
    NClosure(Fact2 _f)
    {
        f = _f;
    }

    public int apply(int n)
    {
        if (n == 0)
        {
            return 1;
        }
        else
        {
            return n * (f.apply(f)).apply(n - 1);
        }
    }
}
class Fact2
{
    Fact2ᴵ apply(Fact2 f)
    {
        return new NClosure(f);
    }
}
// This is the poor man's Y combinator.

// Look at this line `return n * (f.apply(f)).apply(n - 1);`,
// if it is `g.apply(n - 1)` then it would be similar to the original recursion version.
// Let's `g = f.apply(f)`:
class GG implements Fact2ᴵ
{
    Fact3 f;
    GG(Fact3 _f)
    {
        f = _f;
    }

    public int apply(int n)
    {
        return (f.apply(f)).apply(n);
    }
}
class Fact3
{
    Fact2ᴵ apply(Fact3 f)
    {
        return new GClosure(f);
    }
}

class GClosure implements Fact2ᴵ
{
    Fact3 f;
    GG g;
    GClosure(Fact3 _f)
    {
        f = _f;
        g = new GG(f);
    }

    public int apply(int n)
    {
        if (n == 0)
        {
            return 1;
        }
        else
        {
            return n * g.apply(n - 1);
        }
    }
}

// We are almost done.
// `GClosure.apply()` is the recursion definition we want.
// Let's create something that takes a `GClosure`.
class YY
{
    Fact2ᴵ f;
    YY(Fact2ᴵ _f)
    {
        f = _f;
    }

    int apply(int n)
    {
        return f.apply(n);
    }
}
// Hmm, the problem is we still need `Fact3`, whose definition hard coded reference to `GClosure`.
// We could made the constructor of `Fact3` taking `GClosure` as a parameter.
// That is, to construct a `Fact3`, we need a `GClosure`,
// and to construct a `GClosure`, we need a `Fact3`.
// Now if we make `Fact3` and `GClosure` one thing, it will be self-referral.
class Fact0 implements Fact2ᴵ
{
    Fact2ᴵ g;
    Fact0(Fact2ᴵ _g)
    {
        g = _g;
    }

    public int apply(int n)
    {
        if (n == 0)
        {
            return 1;
        }
        else
        {
            return n * g.apply(n - 1);
        }
    }
}
// Now the tricky part is constructing `Fact0(_f)`.
// Again this smells like self-reference.
// Just as we introduced an additional function as parameter before,
// to construct `Fact0(_f)` we probably need an additional function.
class MKFact0
{
    Fact2ᴵ apply(Fact2ᴵ fact2ᴵ)
    {
        return new Fact0(fact2ᴵ);
    }
}
// Now we need to define `Y0` such that `new Y0().apply(new MKFact0())` will construct a `Fact0`.
// It is hard to write the `apply` method of `Y0`.
// Let's go back to last iteration.
// `GG` is not abstract. It has `Fact3` hard coded in its definition.
// Let's refactor it.
class G0 implements Fact2ᴵ
{
    Fact2ᴵ g;
    G0(Fact2ᴵ _g)
    {
        g = _g;
    }

    public int apply(int n)
    {
        return (g.apply(g)).apply(n);
    }
}
// Oops! `g.apply(g)` is invalid.
// From here we may try to rewrite `G0`.
// Or we may try to rewrite `Fact2ᴵ`, `int -> int` is too restrictive,
// i.e. if we cannot solve a specific problem,
// try to solve its more general form.

// Rewrite `Fact2ᴵ`, substitute `int` with `Object`, we get `o一oᴵ`.
// Change `Fact0` and `MKFact0` accordingly, we get `Fact` and `MKFact`.
// `Fact` implements `o一oᴵ`, we need to define an interface for `MKFact` as well. That is `oo一ooᴵ`.
// Now we try to rewrite `G0`.
// We find that `g.apply(g)` still cause type mismatch.
// `g` cannot be an ordinary `Object`, which may no have an `apply` method defined.
// Also `g` cannot be an `o一oᴵ`, which cannot take itself (`o一oᴵ`) as a parameter.
// Thus we need a new type (interface).
// An interface whose `apply` method takes anything (an `Object`) and returns an `o一oᴵ`.
// Thus we have `Tᴵ`.
// Then we look at `Y`.
// We still dose not know how to write its `apply` method, but we know the signature of it.
// It takes `MKFact`, a.k.a. `oo一ooᴵ`, and returns `Fact`, a.k.a. `o一oᴵ`.
// Thus we have `oo一oo一ooᴵ`.
//
// We try to pass `MKFact` to `G`, `new G(new MKFact())`.
// Not possible. We need a bridge to connect `oo一ooᴵ` and `Tᴵ`,
// i.e. something takes a `MKFact` a.k.a. `oo一ooᴵ` and produces a `Tᴵ` for `G`.
class H implements Tᴵ
{
    oo一ooᴵ f;
    H(oo一ooᴵ _f)
    {
        f = _f;
    }

    public o一oᴵ apply(Tᴵ x)
    {
        return ...;
    }
}
// Now we need to fill in the missing `apply` definition for `H`.
// It returns `o一oᴵ`. Do we have something returns `o一oᴵ`?
// `f.apply` happens to produce `o一oᴵ`.
class H implements Tᴵ
{
    oo一ooᴵ f;
    H(oo一ooᴵ _f)
    {
        f = _f;
    }

    public o一oᴵ apply(Tᴵ x)
    {
        return f.apply(...);
    }
}
// `f.apply()` takes an `o一oᴵ`. Do we have something to transform `Tᴵ` to `o一oᴵ`?
// The `apply` method of `Tᴵ`.
// Do we have some class implements `Tᴵ`, except `H` itself?
// No.
// So we need to implement one?
// Wait. `G` implements `o一oᴵ` and its construction method takes `Tᴵ` as parameter.
// So `new G(x)` fills in the gap.
class H implements Tᴵ
{
    oo一ooᴵ f;
    H(oo一ooᴵ _f)
    {
        f = _f;
    }

    public o一oᴵ apply(Tᴵ x)
    {
        return f.apply(new G(x));
    }
}
// In fact, this is the very definition given in the book.
//
// At last, let's complete `Y`.
class Y implements oo一oo一ooᴵ
{
    public o一oᴵ apply(oo一ooᴵ f)
    {
        return ...;
    }
}
// We need something takes `oo一ooᴵ` and produces `o一oᴵ`.
// `H` takes `oo一ooᴵ` in its construction method, and produces `o一oᴵ` by its `apply` method.
class Y implements oo一oo一ooᴵ
{
    public o一oᴵ apply(oo一ooᴵ f)
    {
        return new H(f).apply(...);
    }
}
// The parameter of `H(f).apply()` need to be a `Tᴵ`.
// Do we have something implements `Tᴵ`?
// `H` itself.
// So
class Y implements oo一oo一ooᴵ
{
    public o一oᴵ apply(oo一ooᴵ f)
    {
        return new H(f).apply(new H(f));
    }
}
// The very definition given in the book.

// If you still have difficulties to understand it in Java,
// try use another language.
// For example,
//
// ```js
// // Poor man's Y combinator
// ((f => n => n == 0 ? 1 : n * f(f)(n - 1))
//   (f => n => n == 0 ? 1 : 0 * f(f)(n - 1))
//   3)
// ```
//
// It would be perfect if it is `f(n -1)` instead of `f(f(n)(n - 1))`.
// Let `g = f(f)`:
//
// ```js
// ((f => ((g => n => n == 0 ? 1 : n * g(n - 1)) f(f))
//   # same as above
//   3)
// ```
//
// Hmm, `(g => n => n == 0 ? 1 : n * g(n - 1)` is just what we want!
// Let `h = (g => n => n == 0 ? 1 : n * g(n - 1)`:
//
// ```js
// (((h =>
//    (f => h(f(f)))
//    (f => h(f(f))))
//      (g => n => n == 0 ? 1 : n * g(n - 1))
//      3)
// ```
//
// Look! The factorial logic is factor out: `(g => n => n == 0 ? 1 : n * g(n - 1))`.
// And this is the Y combinator.
//
// ```js
// Y =
//   (h =>
//    (f => h(f(f)))
//    (f => h(f(f))))
// ```
//
// To construct `fact` with Y combinator: `Y(g => n => n == 0 ? 1 : n * g(n - 1))`.
//
// Hope this helps to understand those `Y`, `H`, `G` classes in Java.

public class LittleJava
{
    public static void main(String[] args)
    {
        Fact fact = new Fact(new Dummy());
        System.out.println(fact.apply(new Integer(5)));
        MKFact mKFact = new MKFact();

        Fact newFact = (Fact) mKFact.apply(new Dummy());
        System.out.println(newFact.apply(new Integer(5)));

        Fact yFact = (Fact) new Y().apply(new MKFact());
        System.out.println(yFact.apply(new Integer(5)));

        System.out.println("static recursion version");
        System.out.println(StaticFact.fact(5));

        System.out.println("normal version");
        NormalFact normalFact = new NormalFact();
        System.out.println(normalFact.fact(5));

        System.out.println("Fact1");
        Fact1 fact1 = new Fact1();
        System.out.println(fact1.apply(fact1, 5));

        System.out.println("Fact2: poor man's Y combinator");
        Fact2 fact2 = new Fact2();
        System.out.println((fact2.apply(fact2)).apply(5));

        System.out.println("Fact3: g = f(f)");
        Fact3 fact3 = new Fact3();
        System.out.println((fact3.apply(fact3)).apply(5));

        System.out.println("YY");
        YY yy = new YY(new GClosure(new Fact3()));
        System.out.println(yy.apply(5));
    }
}
```