# Jyutping

[Jyutping] is a romanization system for Cantonese developed by the Linguistic Society of Hong Kong.
It is the most popular romanization system right now.
Personally I like Yale romanization more,
but since Jyutping is the de facto standard and has better support,
I finally decided to use Jyutping reluctantly.

[Jyutping]: https://jyutping.org/jyutping/ 

Recent versions of macOS ship with Phonetic Cantonese input method.
It is compatible with both Jyutping and Yale romanization.
Some relaxed pronunciations are also supported.
Unlike the built-in Cangjie Cantonese input method,
it supports use other keyboard layout such as Dvorak.
Besides, its emoji is tuned for Cantonese speakers, e.g. `機械人` (robot) for `🤖`.

Rime also has a Jyutping input schema,
which allows to [specify relax prounciation rules individually][182].
For example, to implement the new realizations mentioned in
[Public Acceptability of Cantonese Phonological Variations: Ranking and Rationale][lshk]:

```yaml
# 非後圓脣元音（也就是圓脣程度最高的元音）/yː, œː, ɵ/ 前的塞擦音（aﬀricates /ts, tsh/），
# 發音部位體現為英語式的齦後音（post-alveolars [tʃ, tʃh]）
- derive/^(z|c)((yu)|(eo)|(oe)|(er))/ch$2/
# 非高非低偏央元音 /œː, ɵ/ 體現為美式英語音的捲舌元音 [ɚ]
- derive/(eo)|(oe)/er/
```

It also supports [Dvorak layout][dvorak].

It can be used with [emoji-cantonese],
which can be customized easily.
For example, to display `🙈` when typing `冇眼睇` ([no eye see]) as in macOS Phonetic Cantonese input method:

```patch
- 冇眼睇	冇眼睇 😑 🤦‍♀️ 🤦 🤦‍♂️
+ 冇眼睇	冇眼睇 🙈
```

[no eye see]: https://en.wiktionary.org/wiki/no_eye_see

On iOS, there is [Hamster] input method, which supports importing Rime schema.
Once imported, Jyupting can be used on iOS, with all the customizations.
However, I find out that the lookup function does not work.
Also, since my phone is small (iPhone 13 mini), I use [Cantoboard] on my phone,
which supports T9 layout.

There is also a [Jyupting input] method for macOS,
which does not support Dvorak layout and customizing relaxed pronunciation rules.
It is also available on iOS, Android, and Windows.

[182]: https://github.com/rime/rime-cantonese/pull/182
[lshk]: https://www.cuhk.edu.hk/ics/clrc/crcl_102_1/lshk.pdf "p. 33"
[dvorak]: https://github.com/rime/squirrel/pull/664#issuecomment-1928980893
[emoji-cantonese]: https://github.com/bingzheung/emoji-cantonese
[Hamster]: https://github.com/imfuxiao/Hamster
[Cantoboard]: https://github.com/Cantoboard/Cantoboard
[Jyupting input]: https://jyutping.app/mac/homebrew/