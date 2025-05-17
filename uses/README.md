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

    However, I am not happy with Lume 3.0,
    which introduces a lot of breaking changes for subjectively better redesign.
    Particularly, it drops the support for Liquid templates, which requires me to either maintain a Liquid plugin myself or migrate existing Liquid templates to something like JSX.
    However, I have motivation to do neither.

[Pelican]: https://docs.getpelican.com/en/latest/content.html#linking-to-internal-content
[pelican-pandoc]: https://github.com/pelican-plugins/pandoc-reader#specifying-file-metadata
[Hugo]: https://gohugo.io/getting-started/configuration/#contentdir
[url]: https://github.com/weakish/weakish.github.com/commit/1d8a2f4b7682cf246cb8e2d3996b5bb66c431240

## Computers

- `MacBookPro15,4`

    The last generation of Intel based MacBookPro. [^2]
    I use [MacPorts] as the package manager for command line programs and [Homebrew] for GUI applications. [^3]

- iPhone 13 mini

    Nowadays, there are almost no choices left for compact smart-phones.
    I bought iPhone 13 mini (131.5 x 64.2 x 7.65 mm, 141 g, 2406 mAH) in 2022, before iPhone SE 3rd generation (138.4 x 67.3 x 7.3 mm, 144 g, 2018 mAH) is available in the Apple Store.
    I prefer Android phones, but [Balmuda Phone] (123 x 69 x 13.7 mm, 138 g, 2500 mAH) is discontinued and [Sony Xperia Ace III] (140 x 69 x 8.9 mm, 162 g, 4500 mAH) are only available in Japan,
    while Samsung Galaxy S23 (146.3 x 70.9 x 7.6 mm, 168 g, 3900 mAh), Sony Xperia 10 V (155 x 68 x 8.3 mm, 159 g, 5000 mAh), and Asus Zenfone 10 (146.5 x 68.1 x 9.4 mm, 172 g, 4300 mAh) are slightly bigger.
    Previously I used Sony Xperia XZ1 Compact (129 x 65 x 9.3 mm, 140 g, 2700 mAH), then iPhone SE 2rd generation (138.4 x 67.3 x 7.3 mm, 148 g, 1821 mAH).

- iPad 9th generation

    Among the iPads that Apple is still selling, the 9th generation iPad is the only one with a headphone jack,
    and the cheapest one can be used as a second display via sidecar with Mac.
    

[^2]: My previous personal Apple computer was the last generation of PowerPC based iBook (`PowerBook 6,7`).

[^3]: Previously I also use Homebrew for command line programs.
    The migration to MacPorts is very smooth.

[MacPorts]: https://github.com/weakish/dotfiles/blob/master/ports.txt "ports installed on my machine"
[Homebrew]: https://github.com/weakish/dotfiles/blob/master/Brewfile "Brewfile on my machine"
[Balmuda Phone]: https://tech.balmuda.com/jp/phone/story/
[Sony Xperia Ace III]: https://xperia.sony.jp/xperia/acem3/spec_docomo.html

## Online Services

- Transfer files: [WeTransfer] and [SwissTransfer]. No account is needed for both the sender and the receiver. The former has a 2GB limit, while the latter has a 50GB limit.

[WeTransfer]: https://wetransfer.com
[SwissTransfer]: https://www.swisstransfer.com

## Camera

- Olympus Pen D3

    Fully manual compact half-frame camera.
    I often load it with Fomapan Classical 100 or Eastman Double X.
    I prefer Orthochromatic films such as Rollei Ortho 25 Plus and Ilford Ortho Plus, but they are hard to buy.
    Sometimes I also use color films produced by Kodak or Fujifilm.
    I use Ilford HP5 Plus pushed two or three stops for low light.

## Editor

I mainly use VSCode since it is a popular choice for a lot of languages and frameworks.
Also, it has first class support for GitHub Copilot which I use a lot (currently I am on its Pro plan).

## Terminal

I use [kitty] because previously I had used Neovim for some time and kitty works well with Neovim (true color & undercurl).
Also, kitty is from Kovid Goyal, the author of [calibre].

[kitty]: https://sw.kovidgoyal.net/kitty/
[calibre]: https://github.com/kovidgoyal/calibre

## Browser

Safari is my main browser since it is the default one on macOS and iOS,
and it is said to be more power efficient than other alternatives.

Occasionally I use Chromium for fancy features such as [WebGPU].

[WebGPU]: https://caniuse.com/webgpu "Can I use page for WebGPU"

Personally I prefer Firefox and Vivaldi but ironically I do not use them,
just like I prefer Linux and BSD but I do not use them.
I have not thought about this too much, maybe because I have low self-esteem and think I do not deserve the best.

## Wear

I used to prefer [vintage style running shoes][thedeffest], those revised [models] originated from [1960s] to [1980s], [light and comfort][ad].
However, I found out that their toe boxes are narrow.
Nowadays, I often wear a pair of Crocs Classical Clog instead, which has a large toe box.
I also put on some charms to make my white Crocs prettier.
Occasionally, I wear Vibram FiveFingers KSO ECO Green, which is extremely light and minimalistic.

[thedeffest]: https://www.thedeffest.com/
[models]: https://www.mizuno.jp/mizuno1906/journal/journal_collection/046/
[1960s]: https://www.onitsukatiger.com/gb/en-gb/onitsukatiger-inspiration/onitsukatiger-mexico-66/
[1980s]: /uses/nb-420.jpg "https://i.ebayimg.com/images/g/ApEAAOSwd7Fb-MP7/s-l1600.jpg"
[ad]: /uses/nb-ads.jpg "https://images.squarespace-cdn.com/content/v1/5ab94f5e3c3a536987d16ce5/1586282359719-W9JJP53TVVP0EAJVXOLJ/ke17ZwdGBToddI8pDm48kGNEFA4rC7c0McDIySn7RjkUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcPlG31PR0Q5DeNaNXE1QnS_LzyNcqI129vtg_t5azkwh6fx-4rvXr20Sq8_feGDMO/New+Balance+1982+vintage+sneaker+ad+%40+The+Deffest?format=1500w"

## Drink

Water, milk, and Juice.
I seldom drink coffee or tea, and almost never drink alcohol.
However, I do like drinking chocolate.

This page is inspired by [uses.tech].

[uses.tech]: https://uses.tech/