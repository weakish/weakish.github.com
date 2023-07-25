# Uses

## Colophon

Made with [Lume][] [^1]

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

    The last generation of Intel based MacBookPro. [^2]
    I use [MacPorts] as the package manager for command line programs and [Homebrew] for GUI applications. [^3]

- iPhone 13 mini

    Nowadays, there are fewer choices left for compact smart-phones.
    I bought iPhone 13 mini (131.5 x 64.2 x 7.65 mm, 141 g, 2406 mAH) in 2022, before iPhone SE 3rd generation (138.4 x 67.3 x 7.3 mm, 144 g, 2018 mAH) is available in the Apple Store.
    I prefer Android phones, but [Balmuda Phone] (123 x 69 x 13.7 mm, 138 g, 2500 mAH) and [Sony Xperia Ace III] (140 x 69 x 8.9 mm, 162 g, 4500 mAH) are only available in Japan,
    while Samsung Galaxy S23 (146.3 x 70.9 x 7.6 mm, 168 g, 3900 mAh), Sony Xperia 10 V (155 x 68 x 8.3 mm, 159 g, 5000 mAh), and Asus Zenfone 10 (146.5 x 68.1 x 9.4 mm, 172 g, 4300 mAh) are slightly bigger.
    Previously I used Sony Xperia XZ1 Compact (129 x 65 x 9.3 mm, 140 g, 2700 mAH), then iPhone SE 2rd generation (138.4 x 67.3 x 7.3 mm, 148 g, 1821 mAH).

[^2]: My previous personal Apple computer was last generation of PowerPC based iBook (`PowerBook 6,7`).

[^3]: Previously I also use Homebrew for command line programs.
    The migration to MacPorts is very smooth.
    Among all Homebrew formulas I need, only [tldr] is not found in MacPorts.
    I installed tldr via pnpm instead, which is also the recommended installation method on tldr website.

[MacPorts]: https://www.macports.org
[Homebrew]: https://github.com/Homebrew/homebrew-cask
[Balmuda Phone]: https://tech.balmuda.com/jp/phone/story/
[Sony Xperia Ace III]: https://xperia.sony.jp/xperia/acem3/spec_docomo.html
[tldr]: https://tldr.sh

## Camera

Panasonic [GM1S] (204g) with Lumix G 14mm f/2.5 (55g) and Lumix G VARIO 35-100 mm/f4-f5.6 lens (135g),
small[^4] and lightweight[^5].

[^4]: I once considered buying a camera in Fujifilm X100 series,
    which is one of the few digital compact cameras available today
    still having physical wheels to adjust aperture, shutter speed, and ISO.
    But it is too large to fit in the pocket.
    It is a pity that Fujifilm does not produce X70 anymore.
    Although Panasonic also discontinued GM series, at least it still produces LX 100 II.

[^5]: A discontinued lighter interchangeable lens alternative with a 1/1.7" or 1/2.3" sensor:
    Pentax Q/Q7/Q10/Q-S1 (180g/200g/200g/203g) with Pentax 01 Standard Prime (37g).
    An APS-C fixed lens camera with similar weight: Rioch GR III (257g).
    A discontinued APS-C fixed lens camera: Fujifilm X70 (340g).
    An M43 camera with zoom lens: Panasonic LX 100 II (392g).
    A compact 1" camera with zoom lens: Sony RX100 VII (302g), and Panasonic DMC-LX10 (310g).

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
