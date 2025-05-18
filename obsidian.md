# My Obsidian Journal

I started using [Obsidian][] in a somehow unusual use case:
I want to browse my personal website (this site) on my phone.

[Obsidian]: https://obsidian.md

I cloned the source repository of my website to my phone and opened it in Obsidian as a vault.

## Markdown Extensions

### Wiki Links

One thing I like about Obsidian is the wiki-link syntax.
The bracketed link syntax reminds my good old days of using [ikiwiki][].
The way Obsidian implemented it means I can link to any page with its name,
regardless of which directory the page file locates in and what file extension the page file uses.
And this inspires me to use this wiki-link syntax in my website.
It turns out [very easy][8dc019a] since someone already wrote [a remark plugin for Obsidian-style wiki-link syntax][remark-obsidian].

[ikiwiki]: https://ikiwiki.info
[8dc019a]: https://github.com/weakish/weakish.github.com/commit/8dc019a4f9e05cfa221589eaf50497f1671617fa
[remark-obsidian]: https://www.npmjs.com/package/remark-obsidian

### Highlighted Text and Callouts

Besides wiki-links, with this plugin, I also get callouts and highlighted text for free.

I seldom use highlighted text but I think it might be useful if I quote a large chunk of text and want to highlight some part of it.
This `==highlighted text==` syntax is not supported in GitHub Flavored Markdown (GFM) but it is supported in [lowdown].

[lowdown]: https://kristaps.bsd.lv/lowdown/

> Two additional types of double-emphasis are the strike-through and highlight.
> These are produced by pairs of tilde and equal characters, respectively:
>
>     ~~Kirk~~Picard is the best ==captain==.
>
>  ==The highlight variant may be enabled in lowdown(1) with highlight parsing enabled.==
>
> -- [man 5 lowdown][lowdown(5)]

[lowdown(5)]: https://manpages.ubuntu.com/manpages/jammy/man5/lowdown.5.html

As for callouts, I am not a fan of them.
First, the [Obsidian callout syntax][obsidian-callout] is not compatible with [GFM][gfm-callout].
Second, those callout types using English words such as "note" and "tip",
while one thing I like about markdown is its syntax is language agnostic,

[obsidian-callout]: https://help.obsidian.md/callouts
[gfm-callout]: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts