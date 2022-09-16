# Long Live ASCII

After overwhelmed by the complexity of Unicode,
I wrote this instead of going to therapy.

## ASCII v.s. Unicode

Personally, I prefer the Bemer-Ross Code (ASCII) over Unicode.

UTF-8 only superseded [ASCII] *on the Web* [around 2008],
less than two decades from now,
while ASCII is the de facto standard for four decades.
And UTF-8 is backward compatible with ASCII.

Most programs support Unicode, *to some extent*.
All programs *fully* support ASCII.

Printable characters of ASCII can be easily input on the most popular keyboard layout.

Unicode is much much more complex than ASCII.
And different versions of Unicode bring in even more complexity.

Someone may consider this as going back,
and suggest going back further,
to predecessor [ITA2].
My answer is, ITA2 has no advantage over ASCII,
among the 64-bit machines today.

Conclusion: ASCII is better than Unicode.

## GitHub v.s. Twitter

GitHub still displays the username instead of the display name.
The username only contain ASCII characters.
On the contrary, Twitter displays the display name,
sometimes containing emojis.
I do not know how Twitter looks like on an old terminal without proper emoji support,
or how long those fancy names with emojis under a screen reader.

Also, if you do want to use emoji, GitHub allows you to use emoji code, such as `:tada:`,
while Twitter forces you to search from an embedded emoji sets.

Conclusion: GitHub is a better social media platform than Twitter.

## Dumb Marks v.s. Smart Marks

LaTeX uses a pair of consecutive backticks (U+0060) as a smart left quote (“ U+201C),
and a pair of consecutive single quotes (U+0027) as a smart right quote (” U+201D).
The [smart extension of pandoc][pandoc] does not support this.
I think the reason behind this decision is to avoid ambiguity.
In [Markdown],
a pair of consecutive backticks can be used to denote the start of an inline code span,
allowing for include a literal backtick character within the code span.
[Go doc comment syntax], which does not use backticks for inline code spans,
supports this syntax for smart quotes,
converting them in Unicode left quote and right quote characters.

The LaTeX also use a single backtick and a single quote
for a smart left single quote and a smart right single quote accordingly.
Neither the smart extension of pandoc nor the go doc comment syntax supports it.

And LaTeX uses `--` as en-dashes and `---` as em-dashes, and `...` for ellipses,
which are supported by the smart extension of pandoc.

Then comes the fourth kind of dashes, the mathematical minus sign.
LaTeX uses `$-$` for it,
which is supported by the [`tex_math_dollars` extension of pandoc][tex-math-dollars].
I think the corresponding part in vanilla Markdown is `-`,
since minus signs are so commonly used in code
that most programming languages does not allow hyphen in variable names,
to avoid an ambiguity between hyphen and minus sign in parsing.


Since my preference of ASCII to Unicode,
I prefer to use `"`, `'`, `--`, and `...`. 

[Lover of Structure] wrote a great summary
on the differences among hyphen (`-`), en-dash (`--`), and em-dash (`---`).
As [Lover of Structure] pointed out, em-dash is irrelevant in these days.
I just use parentheses instead.
[Lover of Structure] also pointed out that en-dash is preferred in words like pre--World War I,
because pre-World War I may be interpreted as `((pre World) War I)`,
pre-- indicates "World War I" is more closely bounded.
Based from this, [Lover of Structure] is against the conventional usage of en-dash
to represent the range between numbers.
For example, in "20-30 ml", "20" and "30" is closer to each other than "ml".

I agree with [Lover of Structure].
While the convention to use en-dash `--` is popularized by TeX,
I am more familiar with command line programs and programming than typesetting,
such as in Regex, hyphens (`-`) is used for ranges (`[0-9]`).

Again since I prefer ASCII, it is natural for me to use `--` sparingly.
In cases such as "pre-World War I", I consider `--` as  an optimization to avoid ambiguity.
In cases of ranges, although `--` does help to avoid ambiguity,
in most case, replace `--` with `-` is fine.
For example, hyphen in `pp. 34-38` represents ranges,
and hyphen in `phone: 123-4567` does not represent ranges.  
I think a similar example is some programs use `--opt` for multi-character option,
and `-o` for single-character option,
which avoid the ambiguity that `-long` may mean `-l long`.
However, in most case, there is no ambiguity.
If both `l` and `long` are valid options,
then specifying `-long` should be interpreted as specifying the `long` option. 
Otherwise, users can input an extra space to avoid this ambiguity.
Alternatively, programs may forbid to omit the space between the argument of an option.

To be clear, I consider both `pre--World War I` and `pp. 2--3`,
are optimizations to avoid ambiguity, similar to oxford commas.
I personally prefer to apply the former but not the latter.
However, I am fine with people who prefer applying both or neither.

Conclusion: Dumb marks are better.

## References

- [LaTeX Text Formatting] on Wikibook
- [ASCII] Wikipedia page

[pandoc]: https://pandoc.org/MANUAL.html#typography
[Markdown]: https://daringfireball.net/projects/markdown/syntax#code
[Go doc comment syntax]: https://pkg.go.dev/go/doc/comment
[tex-math-dollars]: https://pandoc.org/MANUAL.html#math
[ASCII]: https://en.wikipedia.org/wiki/ASCII "ASCII wikipedia page"
[around 2008]: http://www.w3.org/QA/2008/05/utf8-web-growth.html "UTF-8 Growth on the Web. W3C Blog."
[ITA2]: https://en.wikipedia.org/wiki/International_Telegraph_Alphabet_No._2 "ITA2 wikipedia"
[LaTeX Text Formatting]: https://en.wikibooks.org/wiki/LaTeX/Text_Formatting
[Lover of Structure]: https://tex.stackexchange.com/a/60038/
