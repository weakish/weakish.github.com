JavaScript Coding Style
=======================

semicolon
---------

JavaScript's ASI (auto semicolon insertion) is confusing.

If I prefer to not omit semicolons, I need to take care of semicolon auto inserted with:

1. after `return`
2. after `break`
3. after `continue`
4. after `throw`
5. after `++` and `--`

However, in practice I only need to remember not breaking line after `return` or `throw`
`return` or `throw` is quite similar, so these two rules can be combiend into one.
Also, Python does not allow to break after `return` and `raise`.
If the Python rule is already remembered, there is no special rule to remember.

```javascript
// I am very unlikely to write code like this.
i
++
b
```

However, if I prefer to omit semicolons, I need to remember additional rules besides above:

- before `(`
- before `[`
- before `.`
- before `,`
- before `+`, `-`, `*`, `/`
- before \` (tag string as added in ES2015)

In practice, I only need to remember: `(` and `[`, which can be considered as one combiend single rule.
I am unlike to write a statement begining with \`, `,`, `+`, `-`, `*`, `/`,
(`previous_line\n/regex/.side_effect()` may be paresd as `previous_line` dividing `regex` dividing `.side_effect`,
but it is rare to only do side effects for regex),
and even `.` won't cause trouble if I always write `0.6` instead of `.6`
(some languages disallow `.6` anyway).
So this is just one additional rule,
at most two if counting `/`.

The problem is this rule is very counterintuitive.

Another issue is whenever you delete a line in source,
you have to check if the next line starts with `(` or `[` etc.
There is an workaround though: put semicolon before the line starting with `(` or `[` etc.

A lot of other languages allows you to omit semicolons.
And I know none has such a complex rule as JavaScript's ASI.
To work around JavaScript's poorly designed ASI,
not omitting semicolons requires you to remember one rule
(do not break after `return` or `throw`)
or zero rule (if you are overfamilar with Python).
Omitting them forces you to remember one extral very unintuitive rule
(append `;` if next line starts with `(` or `[`).
BTW, omitting semicolon also requires minifiers to deal with the complex ASI rules.

If you do choose to omit semicolon,
[eslint has a rule][eslint] to protect you from forgetting `;` before `(` or `[` etc.

[eslint]: https://eslint.org/docs/rules/no-unexpected-multiline

Reference
---------

- [JavaScript Semicolon Insertion Everything you need to know][inimino]
- [The infernal semicolon][brendaneich]

[inimino]: http://inimino.org/~inimino/blog/javascript_semicolons
[brendaneich]: https://brendaneich.com/2012/04/the-infernal-semicolon/
