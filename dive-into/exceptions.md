Exceptions
------------

Java has checked exception, essentially union type.

Kotlin dislikes Java's checked exception, and just removes it.

Ceylon also does not have checked exception, but it has union types.

Swift has something like semi-checked exception.
Unlike Java, a Swift function can only declare if it may throw an exception or not.
(Specifying `throws` in function signature.)
But it cannot specify types of exception.
Thus if the caller of the function tries to catch the exception,
it must have a default catch all clause in the end.
And since Swift only distinguish functions may throw and may not throw,
it is straightforward to map a function's throwability to optional type
(via `try?`).