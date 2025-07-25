This is a learning-by-doing project for me to experiment [Lume][] and [Deno][].

[Deno]: https://deno.land
[Lume]: https://lume.land

## Random Pages

Some random pages for demonstration purposes (content may be outdated or auto generated via AI).

### Syntax Highlighting

Syntax highlighting in Lume is supported via [Prism][] or [Highlight.js][].
And two community plugins for [Glow][] and [Shiki][] are available. 

[Prism]: https://lume.land/plugins/prism/
[Highlight.js]: https://lume.land/plugins/code_highlight/
[Glow]: https://deno.land/x/lume_glow
[Shiki]: https://deno.land/x/lume_shiki

Glow is too naive to me and supports only a limited set of languages.
Compared to Prism and Highlight.js, Shiki is more powerful and ships zero JavaScript in runtime.
For this site, I use [starry-night][], which is similar to Shiki in essence,
but matches GitHub in that it produces classes and works with the CSS it ships.
There is no Lume plugin for Starry Night, but it is easy to use with Lume:

[starry-night]: https://github.com/wooorm/starry-night

```ts
site.use(remark({
  rehypePlugins: [[
    rehypeStarryNight, {
      grammars: all 
    }]],
}));
```

Some random pages with syntax highlighting:

- [Exception and Union Type](dive-into/exceptions.md)
- [Notes on A little Java, a Few Patterns](java/a-little.md)
- [Quirks of Ruby](dive-into/ruby.md)

### More Random Pages

- [Fight for Type Safety Stand with JavaScript](dive-into/ts-check.md) (ts-check with JSDoc comments)
- [An Opinionated Guide to ESLint](dive-into/eslint.md)
- [Write Makefile Compatible with Both GNU make and BSD make](dive-into/make.md)
- Neovim [code completion](vim/completion.md) and [spell checking](vim/spell.md)
- [Selected Gitmojis](dive-into/gitmoji.md)
- [History of HTML through Linux/BSD Websites](web/html-history.md)
- [Build a Micro Static Site With GitHub Pages](dive-into/gh-pages.md)
- [RarCrack Basic Guide](dive-into/rarcrack.md)
- [Notes](/dapi/README.md) and [poems](poems/README.md) written in Chinese

## Markdown Sandbox

The following table uses GitHub Flavored Markdown (GFM) table syntax,
which may not render correctly in all Markdown viewers:

| [gh] | [gist] | [mastodon] | [gpg] | [rss] | [json] | [/log] | [/movies] | [/uses] |
|------|--------|------------|-------|-------|--------|--------| --------- | ------- |

[gh]: https://github.com/weakish "GitHub"
[Gist]: https://gist.github.com/weakish "GitHub Gist"
[mastodon]: https://social.vivaldi.net/@lib "@lib@vivaldi.net"
[gpg]: https://api.github.com/users/weakish/gpg_keys "2414 AEA0 EA48 5263 9697 F1BA 55F6 EEC2 EA3F 0A87"
[rss]: /rss.xml "Recent Updates in RSS Feed (XML)"
[json]: /feed.json "All Posts in JSON Feed"
[/uses]: uses/README.md "Setups, gear, software"
[/log]: log/README.md "Micro web log"
[/movies]: movies/ "Recently Watched Movies"

[![Netlify Status](https://api.netlify.com/api/v1/badges/2ebbcd01-c006-40c1-92cd-b927220814bc/deploy-status)](https://app.netlify.com/sites/weakish/deploys)
