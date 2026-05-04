# Conversation on the first koan of “Kotlin Koans”

Source: <https://github.com/weakish/weakish.github.com/issues/10>

(I find no elsewhere to comment, so I click the link for the feedback and redirected here. Correct me if it is the wrong place.)

First of all, I am not a fan of Kotlin. But I think it actually introduced some _good_ things.

Technically, the following "familiar" code is effective more complex:

```kotlin
fun start(): String {
  return "OK"
}
```

It introduces _a block scope_ and a keyword `return` for local control (which makes the control jump to the end of the function body). Both are unnecessary and redundant at this point, even considered harmful.

This is bad because in fact both block scopes and keywords like `return` are quite complicated monsters in semantics.

Canonically, a block with lexical scoping is the rewrite of a lambda abstraction (i.e. a function in most languages) with an immediate call to that abstraction. This is quite heavy and certainlly a mental burden where the local scoping is irrelevant. Note the rewrite is adopted in many functional languages (both impure ones like Scheme and pure ones like ML).

OTOH, `return`, as a simplified (restricted) version of P. Landin's J operator, is a _control operator_. This is also quite heavy and unnecessary here.

Sadly, the restricted designs have been built-in in many languages decades ago, esp. ALGOL-like ones (C, Pascal, Java, JavaScript, ...). Abuse of them have already caused many indirect but real damages to industrial programmers who learned programming with a traditional ALGOL-like language:

* Most of them have poor knowledge of many basic topics about programming (languages), e.g. how scoping works.
  * Even experts would suffer. I've seen someone who confused block scope and function scope contributed to the ISO C++ draft, and the bug was even missing by the editor.
* Most of them have little knowledge of some more advanced topics, e.g. how to compose the control operators properly in a language.
  * Lack of the knowledge effectively prevents proper designs for powerful features on concurrency and scheduling of the computing resources being adopted in the modern languages.
* As another result of lack of such knowledge, some comtemporary languages retain stupid designs with no sound reasons.
  * Why a function body must be a block in so many languages?
  * Why even a _lambda-expression_ in C++ must have a block as its body?
* Users are encouraged to think in improper (over-simplified) ways of computing with bad flavors, whatever hells of operational semantics they meet ...
  * _Why Python is that popular, then?_
* _Non-exhaustive industrial damages continue here..._

I don't think Kotlin has done much right in its design. But at the very beginning, it provides a better choice here.

— [FrankHB](https://github.com/FrankHB), Dec 3, 2020

---

Oh, I took block scope and return statement for granted. It turns out `{ return "OK" }` is not that simple as it looks like. Also thanks for mentioning J operator (never though how to express return in lambda abstractions before).

However, from a beginner's point of view, `{ return "OK" }` may be understood as this:

1. `{}` groups some statements/expressions (unaware of the concept "scope" or even the difference between statement and expression yet)
2. `return` marks the exit point (returned result/value) of the function

These vague understandings are sufficient for them to continue learning.

— [weakish](https://github.com/weakish), Dec 9, 2020

---

There can be easy understanding at the first glance, but not that easy when thought twice.

1. Each kind of braces (`{}`, `[]`, `()`, ...) can group syntactic elements in general. `{}` groups statements in ALGOL-like languages, precisely. But why the grouping should be explicit when there is only one element? And why it is `{}`, rather than other kinds of braces?
2. The key point is that "the exit point" itself sounds redundant if there is no need to do something peculiar on it (like to capture the context, to intercept the control, to do some inter-procedural static analysis, etc.). And a curious learner may naturally ask *where* the function returns to. It is subtly a headache to make the notion of the "caller" clear and correct for real beginners who have absolutely no knowledge of the implementation details. (Yes, even the concept of "control" falls into the unnecessary details here; it sounds not much different to "continuation" in this context.)

Personally I feel the mandatory of such syntactic styles often unreasonable. No one can easily clarify the necessity of the syntactic rules, because there is just no overall reasons for "why I should code like this" besides "many other languages also work like this" and "I'm not the father of that language!" This will not be a big deal for most people since the reasons can be easily ignored. But anyway, preventing beginners to ask such questions is quite a bad practice of teaching. I think something has gone wrong in the very beginning.

Even if the learner is not a real beginner of programming, more succinct styles can still make benefits. Senior programmers can ask themselves "why we need the feature here" to start thoughts on something interesting behind the tutorial. The first question can be "why we need a statement at all"?

— [FrankHB](https://github.com/FrankHB), Dec 15, 2020
