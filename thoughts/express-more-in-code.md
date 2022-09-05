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

A lot of programming languages suffer from design flaws or lack of ecosystem,
but usually these issues do not affect brief code samples.
Thus, most languages are fine.

If a language with C like syntax is chosen,
then it is recommended to use the Java style (opening braces on same line)
and an indent level of 2 spaces.
This saves space and does not harm readability for brief code samples.

The most popular choice seems Python,
which is the most used language in the [Jupyter] ecosystem.

[jupyter]: https://jupyter.org/
