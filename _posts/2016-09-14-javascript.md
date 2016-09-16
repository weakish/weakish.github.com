JavaScript Coding Style
=======================

semicolon
---------

JavaScript's ASI (auto semicolon insertion) is confusing.

If I prefer to not omit semicolon, I need to take care of semicolon auto inserted with:

1. `return`
2. `break`
3. `continue`
4. `throw`
5. `++` and `--`

However, in practice I only need to remember not breaking line after `throw`.

```javascript
// I am very unlikely to write code like this.
i
++
b

// A lot of languages do not allow this.
function f() {
    return
    2
}
```

However, if I prefer to omit semicolons, I need to remember additional rules besides above:

- `(`
- `[`
- `.`
- `,`
- `+`, `-`, `*`, `/`
- `for` and `while`

A lot of other languages allows you to omit semicolons.
And I know none has such a complex rule as JavaScript's ASI.
To work around JavaScript's poorly designed ASI,
not omitting semicolon requires you to remember one rule
(do not break after `throw`).
Omitting them forces you to remember more rules.
BTW, omitting semicolon also requires minifiers to deal with the complex ASI rules.

Reference
---------

- [JavaScript Semicolon Insertion Everything you need to know][inimino]
- [The infernal semicolon][brendaneich]

[inimino]: http://inimino.org/~inimino/blog/javascript_semicolons
[brendaneich]: https://brendaneich.com/2012/04/the-infernal-semicolon/
