# Tate-chu-yoko

> 縦中横（たてちゅうよこ、
> Horizontal-in-Vertical Text Composition, horizontal-in-vertical setting, tate-chu-yoko setting
> とは、縦書きの行中で，縦書きの字の向きのまま横書きにすることである。
>
>
> 縦組みの行の中で数文字（通常2、3文字。まれに4文字以上）の欧字や数字を、
> 1文字分の高さで左横書きに配置する。
>
> -- [縦中横 - Wikipedia](https://ja.wikipedia.org/wiki/縦中横)

```css
:lang(jp) {
writing-mode: vertical-rl;
text-orientation: mixed;
}

.tatechuyoko {
  text-combine-upright: all;
}
```

```html
<p lang="jp">
昭和<span class="tatechuyoko">45</span>年
<span class="tatechuyoko">1</span>月<span class="tatechuyoko">1</span>日
午前<span class="tatechuyoko">0</span>時
<span class="tatechuyoko">0</span>分<span class="tatechuyoko">0</span>秒
</p>
```

The formal syntax of `text-combine-upright` is 

```
text-combine-upright = 
  none                         |
  all                          |
  [ digits <integer [2,4]>? ]
```

However, `digits` is not supported by [browsers] yet.

[browsers]: https://caniuse.com/mdn-css_properties_text-combine-upright_digits "browser support table"

Besides, `digits` only handles ASCII digits (U+0030–U+0039).
ASCII letters are not supported.

