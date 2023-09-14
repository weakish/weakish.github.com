Markdown Markdown
=================

A Bit of History
----------------

Setext (Structure Enhanced Text) aims to be easily readable
without any parsing or special software.
This inspires both ReStrucuterdText and Markdown.

The idea of Markdown is

> to make writing simple web pages, and especially weblog entries,
> as easy as writing an email
>
> -- [Aaron Swartz](http://www.aaronsw.com/weblog/001189)

At that time, ReStrucuterdText seems too complex:

> Is there a Perl implementation of reST, or a Movable Type single-file plug-in wrapper?
> As far as I’m aware, no.
> So, even without any arguments about reST’s syntax,
> I just don’t see how one could argue that I could have just used reST.
>
> And if I was going to write my own code,
> there was no way I was going to write code to re-implement reST’s rather large feature set.
> I’m much too lazy.
>
> -- [John Gruber](http://www.aaronsw.com/weblog/001189#c755)

What Gruber and Swartz could have done was to implement a subset of ReStrucuterdText.
But they decided to "develop the perfect format".

Partly due to its simplicity, Markdown became popular.
Then, people want more and add more.
Today Markdown turns out to be as complex, if not more complex than, ReStrucuterdText.
And unlike ReStrucuterdText, Markdown is inconsistent among applications and platforms.

Maybe I should not get surprised.
After all, HTML was extremely simple at the time of Setext. 

Common Markup Among Setext, ReStrucuterdText, and Markdown
----------------------------------------------------------

> To me, the best parts of reST are the parts it borrowed from Setext.
>
> -- [John Gruber](http://www.aaronsw.com/weblog/001189#c755)

However, there are few common markup among Setext, ReStrucuterdText, and Markdown.

```markdown
Heading
=======

Sub-heading
-----------

**bold**

* bullet list
* another item
```

And the bullet list markup seems to be the most pervasive one.
It is the only common markup among Setext, ReStrucuterdText, Markdown, [Usemod wiki],
and [godoc comment].

[Usemod wiki]: http://www.usemod.com/cgi-bin/wiki.pl?TextFormattingRules
[godoc comment]: https://go.dev/doc/comment
