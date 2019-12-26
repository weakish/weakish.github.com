# Haskell: Laziness, Type Class, and Monad

## Laziness

> A function is **strict** in an argument
> if the result is undefined
> whenever an undefined value is passed to this argument.
> For instance, `(+)` is strict in both arguments,
> while (&&) is strict in its first only.
> Recall that it is defined by
>
>     True && x = x
>     False && x = False
>
> ...
>
> If a function is not strict in an argument,
> we say that it is **non-strict** or **lazy** in that argument.

-- Haskell: The Craft of Function Programming (3e):517

### Infinite List

```haskell
fibs ::[Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
take 3 fibs
```

### Mutual Recursion

Unlike OCaml, mutual recursion in Haskell does not need to use `let rec` (because of laziness).

```haskell
isEven :: Int -> Bool
isEven 0 = True
isEven n = isOdd (n - 1)

isOdd :: Int -> Bool
isOdd 0 = False
isOdd n = isEven (n - 1)
```

## Type Class

```haskell
quickSort :: Ord a => [a] -> [a]

quickSort []     = []
quickSort (x:xs) = quickSort [e|e<-xs,e<=x] ++ [x] ++ quickSort [e|e<-xs, e>x]
```

`Ord` is a type class (interface),
and `[e|e<-xs,e<=x]` is list comprehension.

Function signatures defined in type class are similar to overloading in other languages.

```haskell
class Eq a where
  (==) :: a -> a -> Bool
```

`instance` of type class is similar to classes implemented interface in other languages.

```haskell
instance Monad Maybe where
    return x = Just x
    Nothing >>= f = Nothing
    Just x >>= f  = f x
    fail _ = Nothing
```

But what is Monad? Read on.

## Monad

Monad is like a box.
It keeps tracking of some extra content and makes code cleaner (but not necessary clearer).

### Maybe Monad

The Maybe monad chains (`>>=`) sequences of operations and hides failure handling (extra context) in a monad.

Let's revisit the definition of Maybe from this perspective:
(`--` starts a comment in Haskell)

```haskell
instance Monad Maybe where
    -- `return` is a function to wrap x as `Just x`.
    return x = Just x
    -- As soon as one fails, the rest are ignored and the final result is `Nothing`.
    Nothing >>= f = Nothing
    -- Only apply `f` when x is `Just x`， not `Nothing`.
    Just x >>= f  = f x
    -- Throw a failure.
    fail _ = Nothing
```

### Monadic Classes

The type class of Monad is defined as below:

```haskell
class Monad m where
    -- core functions of Monad
    (>>=)  :: m a -> (a -> m b) -> m b
    return :: a -> m a

    -- other functions
    (>>)   :: m a -> m b -> m b
    m >> k = m >>= \_ -> k -- `\_ -> k` is a lambda

    fail   :: String -> m a
    fail s = error s
```

`fail` is like `throw` in other languages.
Haskell uses it to in pattern matching to enable failure.
We do not write them explicitly in code.

`>>` is a syntax sugar to throw away the result of `m a`.
Thus `putStr "foo" >== \_ -> putStr "bar"` can be expressed as
`putStr "foo" >> putStr "bar"`.

`>>=` chains tow computations,
passing the result of the first computation to the second computation,
by wrapping the second computation in a function,
and passing the first result as its parameter.

Unlike other languages, in Haskell, `return` wraps date in a monad.

Let's revisit the definition of Maybe monad under the perspective of monadic class.

```haskell
instance Monad Maybe where
    return :: a -> Maybe a
    return x = Just x
    >>= :: Maybe a -> (a -> Maybe b) -> Maybe b
    Nothing >>= f = Nothing
    Just x >>= f  = f x
    fail :: String -> Maybe a
    fail _ = Nothing
```

### Do Notation

```haskell
helloWorld :: IO ()
helloWorld =
    do
        putStr "Hello"
        putStr " "
        putStrLn "world!"
```

Haskell syntax is layout sensitive,
in other words, it conforms to offside rule.
Although Haskell does support braces and semicolons,
this alternative style is rare in the Haskell community.

```haskell
do { putStr "Hello"; putStr " "; putStrLn "world!"; }
```

Within a do notation, `<-` binds the result to a name.

```haskell
echo :: IO ()
echo =
    do
        line <- getLine
        putStrLn line
```

In fact, do notation is an alternative syntax for monad:

```haskell
putStr "Hello" >> putStr " " >> putStrLn "world!"

echo :: IO ()
echo = getLine >>= putStrLn
```
