Ceylon coding style
===================

## Prefer `if ... then ... else ...` to `... then ... else ...`

I feel `A then B else C` confusing.

Readers may think `A then B else C` is `A ? B : C` in other languages, but they are **not the same**:

1. `A then B else C` is actually `(A then B) else C`:

	 * `A then B` evaluates to `B` if `A` is not `null`, otherwise evaluates to `null`.
	 * `X else Y` evaluates to `X` if `X` is not `null`, otherwise evaluates to `Y`.

2. Thus the type of `B` is `T given T satisfies Object`, i.e. requires to not be `null`.

I think `if (A) then B else C` is much cleaner.

## Only use `i++` to increase `i`.

`y=i++` and `y=++i` is really confusing to me.

So I prefer to only uses `i++` to increase `i`, i.e. just the statement `i++;`.
I think a meaningful evaluated value of `i++` should be `void`
if a programming language allows `++`.

Same applies to `i--` and `--i`.

## Prefer small commits.

Small commits make review, cherry-pick, and rebase easier. Bonus: measure how many lines of code deleted more accurately. 

## Prefer functions to classes

We prefer to declare classes for new types.

## Prefer small functions

- Extract small functions from a complex function.
- One function should only do one thing.

## Avoid top level variables

- Prefer passing parameter to function.
- Local variable is fine.
- Top level immutable value is fine.

## Reduce commenting.

Programming languages are clearer than natural languages.
So in most cases try to express as much as possible in programming language itself.

- Use meaningful function and variable/value name.
- Declare local variable near its usage.
- Avoid deep nested function call expression. Extract meaningful immediate value declaration.

Here 'commenting' mainly refers to inline comments,
i.e. comments explaining implementation details.
Doc annotation of public modules and functions on their usage is fine.
## Break long line of parameters logically.
  
A simple approach is break for one, break for all.
To save lines, related parameters may be grouped in one line.

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

Similarly, if `if else` is necessary, prefer explicit else branch over fall through flow.

For example:

```ceylon
Boolean if_else(Integer x) {
    if (x > 0) {
        if (x < 10) {
            return false;
        }
    } else if (x < -10) {
        return false;
    }
    return true;
}
```

It is short, but difficult to figure out the control flow.

Rewrite it more explicitly, without omitting else branch:

```ceylon
Boolean if_else(Integer x) {
    if (x > 0) {
        // This is for demostration only.
        // `if (x > 0, x < 10)` is clearer.
        // Pretend there were more complex branching here.
        if (x < 10) {
            return false;
        } else {
            return true;
        }
    } else if (x < -10) {
        return false;
    } else {
        return true;
    }
}
```

Also, avoid using `variable` to save else branch.

For example:

```ceylon
variable Integer x = 0;
if (condition) {
    x = 1;
}
```

can be rewritten to

```ceylon
Integer x;
if (condition) {
    x = 1;
} else {
    x = 0;
}
```

## Prefer readability over testability

The main audience of code is human beings, not tests.

Improving testability should not harm readability.


## Pay attention to compiler warnings

Also use annotation to suppress false positive warnings.

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

## Prefer `under_line`

`camelCaseAreHardToReadIfThereAreMoreThanThreeWords`

`under_line_is_much_easier_to_read`

Exceptions:

- `TypeName` since `TypeNamesWithMoreThanThreeWords` should be avoided.
- `FooBar fooBar` so wherever we see `fooBar`, we know it is of type `FooBar`.

## Other

If you disagree the above, file an issue.

