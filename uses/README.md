# Uses

## Colophon

- Frontend: just HTML and CSS, 100% JavaScript free.
- Generator: [Lume]

[Lume]: https://lume.land

[^1]: This site was hosted at GitHub Pages before.
    Thus, I have used Jekyll for many years.
    I have considered migrating to other static site generators several times.

    But I'd like to keep the source of the content in the same way:

    1. I'd like to use standard GFM, which renders nicely on GitHub and is compatible with a lot of programs.
       This rules out a lot of static site generators without writing a customized Markdown reader.
       For example, the default Markdown reader of [Pelican] uses `<{filename}../article.md>` for internal links,
       and its [Pandoc plugin][pelican-pandoc] expects all Markdown files to start with a YAML header.

    2. I prefer a content first directory structure, not nesting Markdown files under a specific directory.
       This again rules out a lot of static site generators.
       For example, [Hugo] assumes a `content` directory.

    Also, I do not want JavaScript at the client side.

    As far as I know, the static site generators satisfying these needs are Jekyll, Eleventy, and Lume.
    Eleventy, as a meta static site generator, allows customizing almost everything,
    while Lume is more out of the box.

    Finally I have migrating to Lume, allowing me to stop writing Liquid templates,
    which is my main pain point for Jekyll.

    The migration process is easier than I thought, since Lume also supports Liquid templates.
    The only thing I find missing is using `README.md` as the index page.
    This nice feature of Jekyll makes browsering the Markdown files more convenient on GitHub.
    However, customizing destination URL is easy in Lume.
    I wrote [a trivial `url` function][url] in configuration to implement this feature.

[Pelican]: https://docs.getpelican.com/en/latest/content.html#linking-to-internal-content
[pelican-pandoc]: https://github.com/pelican-plugins/pandoc-reader#specifying-file-metadata
[Hugo]: https://gohugo.io/getting-started/configuration/#contentdir
[url]: https://github.com/weakish/weakish.github.com/commit/1d8a2f4b7682cf246cb8e2d3996b5bb66c431240

## Computers

- `MacBookPro15,4`

    The last generation of Intel based MacBookPro.

- iPhone 13 mini

    Nowadays there are few choices left for compact smart-phones weight less than 150 grams.
    And although I prefer Android phones, Google only provides three years of security updates for Pixel phones.
    For example, Pixel 4a will not receive any security updates after 2023.

## Camera

Panasonic [GM1S] with Lumix G 14mm f/2.5 and Lumix G VARIO 35-100mm/f4-f5.6 lens,
small and lightweight.

[GM1S]: https://panasonic.jp/dc/p-db/DMC-GM1SK.html

## Editor

- [LazyVim] with [Codeium & Copilot](../vim/completion.md) and [LanguageTool](../vim/spell.md) under [kitty] terminal.

    I choose this Neovim setup because it keeps configurations simple and uses the modern plugin manager [lazy.vim].
    Previously I use LunarVim, which is a bit complex and lagged.
    I prefer kitty because it works well with Neovim (true color & undercurl) and it is from Kovid Goyal, the author of [calibre].

- [VSCode](https://code.visualstudio.com/)

    I also use VSCode, because it has better support for some languages or frameworks.
    For example, the official vim plugin of ReScript is still based on coc.vim,
    and its language server is [outdated] compared to the one included in the VSCode extension.
    Also, both Copilot Lab and Codeium Chat are only available under VSCode.

[LazyVim]: https://www.lazyvim.org/
[lazy.vim]: https://github.com/folke/lazy.nvim
[kitty]: https://sw.kovidgoyal.net/kitty/
[calibre]: https://github.com/kovidgoyal/calibre
[outdated]: https://github.com/rescript-lang/vim-rescript/issues/61

## Wear

Although I want to respect dress code,
since I only have casual clothing, no formal, semiformal, or informal clothing,
I am only able to conform to dress code like covering the body between shouder and knee.
I used to prefer [vintage style running shoes][thedeffest], those [revised] [models] originated from [1960s], [1970s], and [1980s], [light and comfort][ad].
But later I found out that these shoes are hard to buy.
Currently, I am wearing Kalenji One, which is comfortable and lightweight (less than 200 grams), under 14 USD. 

[thedeffest]: https://www.thedeffest.com/
[revised]: https://www.thedeffest.com/blog/new-balance-ms327laa-retro-runners
[models]: https://www.mizuno.jp/mizuno1906/journal/journal_collection/046/
[1960s]: https://www.onitsukatiger.com/gb/en-gb/onitsukatiger-inspiration/onitsukatiger-mexico-66/
[1970s]: /uses/comp-100.jpg "https://www.thedeffest.com/vintage-ads/new-balance-100-w100-vintage-sneaker-ad-from-1979"
[1980s]: /uses/nb-420.jpg "https://i.ebayimg.com/images/g/ApEAAOSwd7Fb-MP7/s-l1600.jpg"
[ad]: /uses/nb-ads.jpg "https://images.squarespace-cdn.com/content/v1/5ab94f5e3c3a536987d16ce5/1586282359719-W9JJP53TVVP0EAJVXOLJ/ke17ZwdGBToddI8pDm48kGNEFA4rC7c0McDIySn7RjkUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcPlG31PR0Q5DeNaNXE1QnS_LzyNcqI129vtg_t5azkwh6fx-4rvXr20Sq8_feGDMO/New+Balance+1982+vintage+sneaker+ad+%40+The+Deffest?format=1500w"

This page is inspired by [uses.tech].

[uses.tech]: https://uses.tech/
