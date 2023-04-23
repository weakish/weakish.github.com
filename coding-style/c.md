C coding style
==============

Include files
-------------

> Simple rule: include files should never include include files.
> If instead they state (in comments or implicitly)
> what files they need to have included first,
> the problem of deciding which files to include is pushed to the user
> (programmer) but in a way that's easy to handle and that, by construction,
> avoids multiple inclusions.
>
> There's a little dance involving `#ifdef`'s
> that can prevent a file being read twice,
> but it's usually done wrong in practice -
> the `#ifdef`'s are in the file itself,
> not the file that includes it.
> The result is often thousands of needless lines of code
> passing through the lexical analyzer,
> which is (in good compilers) the most expensive phase.

-- Rob Pike [Notes on Programming in C](http://doc.cat-v.org/bell_labs/pikestyle)

The real problem is C does not have a proper package or module system.
Leaving the user to manually composite include file list is a workaround.

Reduce macros
-------------

> As a general rule,
> `#ifdef` use should be confined to header files whenever possible.
> Conditionally-compiled code can be confined to functions
> which, if the code is not to be present, simply become empty.
> The compiler will then quietly optimize out the call to the empty function.

> C preprocessor macros present a number of hazards,
> including possible multiple evaluation of expressions with side effects
> and no type safety.
> If you are tempted to define a macro,
> consider creating an inline function instead.
> The code which results will be the same,
> but inline functions are easier to read,
> do not evaluate their arguments multiple times,
> and allow the compiler to perform type checking on the arguments and return value.

-- [Linux kernel coding style](https://www.kernel.org/doc/Documentation/process/4.Coding.rst)

Reduce inline functions
-----------------------

> Since their code is replicated at each call site,
> they end up bloating the size of the compiled kernel.
> That, in turn, creates pressure on the processor's memory caches,
> which can slow execution dramatically.
>
> More recent compilers take an increasingly active role in deciding
> whether a given function should actually be inlined or not.

-- [Linux kernel coding style](https://www.kernel.org/doc/Documentation/process/4.Coding.rst)

Prototypes should have parameter names
--------------------------------------

Prototypes do not require parameter names.
But writing them out helps to understand the usage of functions.

Do omit parameter names when it is obvious, for example,

```c
int plus(int, int);
```

not

```c
int plus(int adder, int addee);
```

Comment `FALLTHROUGH` in cases
------------------------------

Non default cases in switch statements should end with
either `break` or `FALLTHROUGH` comment.

Mark non-return
---------------

Mark a function never returns (always abort) with `__dead`.

For compatibilities with different operation systems, use a shim:

```c
/*
 * Public domain
 * sys/cdefs.h compatibility shim
 */

#include_next <sys/cdefs.h>

#if !defined(HAVE_ATTRIBUTE__DEAD) && !defined(__dead)
#define __dead          __attribute__((__noreturn__))
#endif
```

This is based on the code at [openntpd][], with `#ifndef` and `__pure` removed.

[openntpd]: https://github.com/openntpd-portable/openntpd-portable/blob/master/include/sys/cdefs.h

Standards
---------

- Use C11 without extension, `-std=c11 -pedantic`.
- Use POSIX.1-2008, `#define _XOPEN_SOURCE 700`.
