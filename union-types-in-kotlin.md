Kotlin does not support union typing.

`T?` can be considered as a union of `T|Null`.

`(J|K) -> T` can be expressed as overloads.

If `T -> (J|K)` is required:

- Re think if this function only do one thing?
  If not, split it into `T -> J` and `T -> K`.

- Use sealed class (verbose).

