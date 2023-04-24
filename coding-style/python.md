Coding Style for Python
=======================

The design of Python is well considered.
Also, the community tends to adhere PEP 8.

Python doss have some flaws, but most of them are fixed by type hints.
For example, Python does not have the capability to define a constant variable,
but PEP 591 introduces `Final`.

Personally I put a semicolon at the end of a mutation, e.g. `a.append(1)`.
This is inspired by the distinguished coding style used by "A Little Java, A Few Patterns".

```java
Pie p = new Crust();
Pie p = new Top(new Anchovy(), p)
; // the future begins, i.e. from this line on, references to `p` reflect the change
```

However, this does not work with popular auto formatting tools such as [black].
Therefore, I do not adhere to this rule in some projects.

[black]: https://black.readthedocs.io/en/stable/
