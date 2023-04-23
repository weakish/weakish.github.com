Ceylon coding style
===================

## Avoid `... then ... else ...`

I feel `A then B else C` confusing.

Readers may think `A then B else C` means `A ? B : C` in other languages, but they are **not the same**:

1. `A then B else C` is actually `(A then B) else C`:

	 * `A then B` evaluates to `B` if `A` is not `null`, otherwise evaluates to `null`.
	 * `X else Y` evaluates to `X` if `X` is not `null`, otherwise evaluates to `Y`.

2. Thus the type of `B` is `T given T satisfies Object`, i.e. requires to not be `null`.

## Avoid `foo { "bar"; }`

In Ceylon, `foo { "bar"; }` and `foo { "bar" }` are semantically different,
which may be confusing.

Either write `foo("bar")` or `foo { parameter = "bar"; }`, never write `foo { "bar"; }`.

Occasionally, `foo {"bar"}` may be used. But `foo({"bar"})` is often preferred.

## Prefer switch case over if else.

Cases in `switch` need to be both disjoint and exhausted.
Using a strict form helps to reduce chances to miss corner cases.

For example, suppose we have the following code:

```ceylon
Path path = current;
if (is Directory path) { // typo, should be `path.resource`.
    // ...
} else { // dead code
    // ...
}
```

There is a typo in the above code, `path` should be `path.resource`.
So the above code will never go into the else branch,
since a Path is always not a Directory.

However, if we use switch with explicit cases:

```ceylon
switch (path)
case (is Directory) {
    // ...
}
case (is File|Link|Nil) {
    // ...
}
```
The compiler will refuse to compile, saying cases are not exhausted.

`switch` can also be used as a workaround of Ceylon's assignment returnning assigned value:

```ceylon
variable Boolean b = false;
if (b = true) {
    print("typo in the above line: `=` should be `==`");
} else {
    print("Use switch to avoid this mistake.");
}

switch (b)
case (true) {
    print("Avoid typo of `==`.");
}
case (false) {
    print("assignment should not return a value in Ceylon.");
}
```

## Pay attention to compiler warnings

If necessary, use annotation to suppress false positive warnings.

For example:

```ceylon
"The ultimate exception handler."
suppressWarnings("expressionTypeNothing")
shared void run() {
    try {
        main();
    } catch (UsageError e) {
        process.writeErrorLine(e.message);
        process.exit(e.exit_code);
    }
}
```

## Failures

Use exceptions for failures that are unrecoverable by immediate calling code,
like bugs in program logic, network failure, and so on.
So they can be handled by some centric infrastructure code.

Use return values (union types) for recoverable failures.

Be careful with side-effect functions.
They are not type safe as side-effect functions with checked exceptions in Java.
The ceylon compiler does not force you to check function's return value
when invoking functions as side-effects.
For example, when getting return value from `result = f();`
where `f` is `Result?()`,
Ceylon does force you to check whether `result` is `null` or not.
However, invoking `f` as side-effects `f();` will silently ignore its return value,
without checking for failures.