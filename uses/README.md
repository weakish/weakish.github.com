# Uses

## Colophon

A plain text file documents the colophon of this site.
As for the URL to this plain text, if you are interested in the colophon of this site,
you probably know it.
If not, you can figure it out via the source code of this site.

## Computers

- `MacBookPro15,4`

    The last generation of Intel based MacBookPro.

    I use [MacPorts] as the package manager for command line programs and [Homebrew] for GUI applications.
    Previously I also use Homebrew for command line programs.
    The migration to MacPorts was very smooth.

    My previous personal Apple computer was the last generation of PowerPC based iBook (`PowerBook 6,7`).

- iPhone 13 mini

    Nowadays, there are almost no choices left for compact smart-phones.
    I bought iPhone 13 mini (131.5 x 64.2 x 7.65 mm, 141 g, 2406 mAH) in 2022, before iPhone SE 3rd generation (138.4 x 67.3 x 7.3 mm, 144 g, 2018 mAH) is available in the Apple Store.
    I prefer [Android][] phones, but [Balmuda Phone] (123 x 69 x 13.7 mm, 138 g, 2500 mAH) is discontinued and [Sony Xperia Ace III] (140 x 69 x 8.9 mm, 162 g, 4500 mAH) are only available in Japan,
    while Samsung Galaxy S23 (146.3 x 70.9 x 7.6 mm, 168 g, 3900 mAh), Sony Xperia 10 V (155 x 68 x 8.3 mm, 159 g, 5000 mAh), and Asus Zenfone 10 (146.5 x 68.1 x 9.4 mm, 172 g, 4300 mAh) are slightly bigger.
    Previously I used Sony Xperia XZ1 Compact (129 x 65 x 9.3 mm, 140 g, 2700 mAH), then iPhone SE 2rd generation (138.4 x 67.3 x 7.3 mm, 148 g, 1821 mAH).

- iPad 9th generation

    Among the iPads that Apple is still selling, the 9th generation iPad is the only one with a headphone jack,
    and the cheapest one can be used as a second display via sidecar with Mac.

[MacPorts]: https://github.com/weakish/dotfiles/blob/master/ports.txt "ports installed on my machine"
[Homebrew]: https://github.com/weakish/dotfiles/blob/master/Brewfile "Brewfile on my machine"
[Android]: android.md "My Android Setup"
[Balmuda Phone]: https://tech.balmuda.com/jp/phone/story/
[Sony Xperia Ace III]: https://xperia.sony.jp/xperia/acem3/spec_docomo.html


## Editor

I mainly use VSCode since it is a popular choice for a lot of languages and frameworks.
Also, it has first class support for GitHub Copilot which I used a lot.
Currently I am on its Pro plan but GitHub does not bill me for it (`SKU: free_engaged_oss`).

Some of my friends are using [Cursor][] but I have not tried it yet.
I might try it, [Windsurf][] and [Junie][] in future.

[Cursor]: https://www.cursor.com
[Windsurf]: https://windsurf.com/editor
[Junie]: https://www.jetbrains.com/junie/

I am also testing the agent mode of GitHub Copilot by assigning issues to Copilot.
I might try [Devin][] in future.

[Devin]: https://devin.ai

## Terminal

I use [kitty] because previously I had used Neovim for some time and kitty works well with Neovim (true color & undercurl).
Also, kitty is from Kovid Goyal, the author of [calibre].

[kitty]: https://sw.kovidgoyal.net/kitty/
[calibre]: https://github.com/kovidgoyal/calibre

## Browser

I use DuckDuckGo browser with the advertisements in DuckDuckGo search engine disabled,
otherwise it will [not block some Microsoft tracking scripts under certain conditions][ddg-help].

[ddg-help]: https://duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections#duckduckgo-private-search-ads

Occasionally I use Chromium for fancy features such as [WebGPU].

[WebGPU]: https://caniuse.com/webgpu "Can I use page for WebGPU"

To browse markdown files on my mobile phone, I use [Obsidian][].
I cloned the corresponding repository to my iCloud drive,
then opened it in Obsidian iOS app as a vault.
My modifications on the iPhone will be synced via iCloud to my Mac,
then I will finish the changes, commit them, and push them to GitHub.

[Obsidian]: https://obsidian.md

## Email

I use Apple Mail on my Mac and iPhone.
I've used Spark before but it [does not provide offline access to emails][spark].

[spark]: https://sparkmailapp.com/help/general/email-storage-and-backups "Help documentation of Spark"

## Window Manager

Back to the days when I was using Linux
(before [systemd killed portability][init-freedom] and [Wayland killed compatibility][KiCad]),
I fell in love with tiling window managers like awesomewm and i3.
On macOS, I use [PaperWM.spoon][paperwm], a tiled scrollable window manager.

[init-freedom]: https://www.devuan.org/os/init-freedom "Init Freedom"
[KiCad]: https://www.kicad.org/blog/2025/06/KiCad-and-Wayland-Support/ "KiCad and Wayland Support"
[paperwm]: https://github.com/mogenson/PaperWM.spoon "PaperWM.spoon GitHub repository"

## Online Services

- Transfer files: [WeTransfer] and [SwissTransfer]. No account is needed for either the sender or the receiver. The former is more limited (share and receive up to 3GB per month, 10 transfers per month, expires in 3 days), while the latter is more generous (50GB file limit, expires in 30 days).

[WeTransfer]: https://wetransfer.com
[SwissTransfer]: https://www.swisstransfer.com

- Backup files: iCloud for my iPhone and iPad, Time machine and [Backblaze][] [^bz] for my MacBook Pro, and [borg][] for Linux.

[Backblaze]: https://secure.backblaze.com/r/04svpb "Backblaze referral link, use this link to get a free month Backblaze for you and me"
[borg]: borg.md "Borg Tutorial"

[^bz]: Backblaze usually works out of the box and I can just let it run in the background. But occasionally it is slow to pick up new files for several hours and I need to [manually trigger a rescan][bzhelp]. If even this does not work, I need to [inspect its log file][bz-log]. Be aware, Backblaze keeps the log of all file history and stores that log file on the internal drive (unrelocatable). Therefore if there is a lot of file renaming and movements, Backblaze may occupy a lot of internal disk space during years of usage. 

[bzhelp]: https://www.backblaze.com/computer-backup/docs/resolve-delays-finding-external-drives-or-new-files
[bz-log]: https://www.reddit.com/r/backblaze/comments/191gqt2/comment/kgwz6nn/

## Camera

- Olympus Pen D3

    Fully manual compact half-frame camera.
    I often load it with Fomapan Classical 100 or Eastman Double X.
    I prefer Orthochromatic films such as Rollei Ortho 25 Plus and Ilford Ortho Plus, but they are hard to buy.
    Sometimes I also use color films produced by Kodak or Fujifilm.
    I use Ilford HP5 Plus pushed two or three stops for low light.

## Shoes

I used to prefer [vintage style running shoes][thedeffest], those revised [models] originated from [1960s] to [1980s], [light and comfort][ad].
However, I found out that their toe boxes are narrow.
So I bought a pair of Crocs Classical Clog instead, which has a large toe box.
I also put on some charms to make my white Crocs prettier.
I wore it a lot but did not bought a new pair after it was worn out, since:

- I feel the material is too hard for my feet skin so I have to wear socks.

- The heel to toe drop is low but the sole still feels too thick for me.

- Some places do not allow wearing Clogs.

Currently my favorite pair is [Vibram FiveFingers KSO ECO Green][kso],
which is extremely light (M43 4.9 oz) and minimalistic (3mm rubber outsole).
Walking wearing it, I can feel the ground and my toes are not constrained.
However, I feel it is not suitable to wear it running on hard surface so later I bought a pair of [Vibram FiveFingers V-Run Ivory / Yellow][v-run],
which is also extremely light (M43 4.8 oz) but offers a bit more cushioning (2mm EVA insole, 4mm EVA midsole, 2.5 mm rubber outsole).
Both of them have fast lacing system, which I prefer since I hate tying shoelaces.

I also have a pair of [Altra Solstice XT 3 White][altra], zero drop and wide toe box.
Its 23mm stack feels too thick for my walk but is fine for gym.
The stack of Altra running shoes and hiking shoes are too thick for me so I do not consider them after trying them on at the store.

I also have a pair of running sandals bought from a local shop where they assemble sandals themselves.
Zerodrop, hybrid outsole for both road and trail, red foam and rainbow straps.

[thedeffest]: https://www.thedeffest.com/
[models]: https://www.mizuno.jp/mizuno1906/journal/journal_collection/046/
[1960s]: https://www.onitsukatiger.com/gb/en-gb/onitsukatiger-inspiration/onitsukatiger-mexico-66/
[1980s]: /uses/nb-420.jpg "https://i.ebayimg.com/images/g/ApEAAOSwd7Fb-MP7/s-l1600.jpg"
[ad]: /uses/nb-ads.jpg "https://images.squarespace-cdn.com/content/v1/5ab94f5e3c3a536987d16ce5/1586282359719-W9JJP53TVVP0EAJVXOLJ/ke17ZwdGBToddI8pDm48kGNEFA4rC7c0McDIySn7RjkUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcPlG31PR0Q5DeNaNXE1QnS_LzyNcqI129vtg_t5azkwh6fx-4rvXr20Sq8_feGDMO/New+Balance+1982+vintage+sneaker+ad+%40+The+Deffest?format=1500w"
[kso]: https://www.vibram.com/us/shop/fivefingers/kso-eco-mens/M95_MilitaryGreen.html
[v-run]: https://www.vibram.com/us/shop/fivefingers/men/v-run-mens/M31_2_IvoryYellow.html
[altra]: https://www.altrarunning.com/en-us/gym-training/mens-solstice-xt-3/AL0A85Q5.html?dwvar_AL0A85Q5_color=110

All my shoes can be used for running, except for sandals I wear indoors.

## Clothes

I chose clothes based on the following principles:

1. Lightweight for comfort and ease of carrying. Multi-layered combinations of lightweight clothes handle temperature differences well.
2. Can be rolled up to reduce storage space.
3. Cotton and linen for everyday wear, comfortable, machine washable under high water temperature for hygiene, and fast to dry in a dryer.
4. Speed drying materials like AIRism for intense activities.
5. Prefer Merino to HEATTECH. I feel the HEATTECH is not so good for warmth but it is very uncomfortable, while Merino is lightweight and breathable. I chose machine-washable Merino clothes, which can be washed inside a mesh bag or pillowcase in the gentle mode of a washing machine with pH-neutral detergent. When traveling, sometimes I use shampoo instead since Merino is basically sheep's hair. When using shampoo, I reduce the amount to avoid washing machine foam overflow. Merino is not suitable for a dryer, so I dry it flat on a rack, to avoid the weight of water stretching and deforming the clothes when hanging it on a hanger.

## Wallet

[Muji Travel Wallet (Orange)][muji-travel-wallet] is a compact wallet which fits in my pants pocket well.

[muji-travel-wallet]: https://uk.muji.eu/products/travel-wallet-18644 "Muji Travel Wallet Product Page"

## Drink

Water, milk (cow and soy), and Juice.
I seldom drink coffee or tea, and almost never drink alcohol.
However, I do like drinking chocolate.
I am thinking of getting a Revomax bottle for take away at the cafe to reduce one time plastic waste.
I like its one-handed instant opening and closing lid.

This page is inspired by [uses.tech].

[uses.tech]: https://uses.tech/