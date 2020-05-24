# Express more in code

Code tends to be clearer and more precise.

## Math formula

The traditional math language has a lot of issues:

- Variables may be used before or without declaration.
- Variables do not have scoping.
- Prone to typos and untestable.

Instead of writing `E = mc^2`, I'd rather just write `e = m * (c ** 2)`.

## Tables

Most tables can be converted to code in a clear way. For example:

| Strength | Dexterity | Constitution |
| -------- | --------- | ------------ |
| 9 (-1)   | 11 (+0)   | 10 (+0)      |

Via direct variable declaration:

```c
strength = 9;
strength_modifier = -1;
dexterity = 11;
dexterity_modifier = 0;
constitution = 10;
constitutito_modifier = 0;
```

Or via a data structure:

```ceylon
class AbilityScore(Integer score) {
  assert(score >= 1 && score <= 30);
  shared Integer modifier => floor((score - 10) / 2.0).integer;
}
value strength = AbilityScore(9);
value dexterity = AbilityScore(11);
value constitution = AbilityScore(10);
```

In fact, the later form reveals the relationship between ability and modifier.

## Choices of language

- Avoid layout sensitive languages such as Haskell, Python, and CoffeeScript, because copying from web page may break layouts.
- Avoid low level, machine oriented languages such as C.
- Avoid dirty languages such as JavaScript, PHP, and Ruby.
- Avoid complicated languages such as C++, Scala, and Rust.
- Avoid verbose languages such as Java, C#, Objective-C.

Examples of suitable languages:

- Scheme
- TypedRacket
- Lua
- Go
- Groovy
- Swift
- Kotlin
- Ceylon

Some of the above languages have pitfalls in practical projects,
such as design flaws (Go),
dynamic typing (Scheme, Lua, Groovy),
lack of libraries (Scheme, TypedRacket, Lua, Swift),
less powerful IDE and debugging support (Scheme, TypedRacket, Lua),
and restrict to certain platforms (Swift).
These issue does not affect brief code samples though.

If a language with C like syntax is chosen,
then it is recommended to use the Java style (opening braces on same line)
and a indent level of 2 spaces.
This saves space and does not harm readability for brief code samples.
