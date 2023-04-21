# Spell Checking in Vim

Vim has built-in support for spell checking.
This built-in function provides basic spell checking.
For example, it does not recognize 'localhost', 'Lua' or 'Node.js'.
However, new words can be added quickly via `zg` in normal mode.

To check grammar and stylish errors,
Grammarly or [LanguageTool] can be used.

[languagetool]: https://languagetool.org/

I prefer LanguageTool because it is open source.
All the errors can be checked with [ltex-ls] locally,
without making any network requests.

[ltex-ls]: https://valentjn.github.io/ltex/

Unfortunately, ltex-ls [does not support adding unknown words to dictionary][168].
Previously, as a workaround, I disabled the spell checking rule from ltex-ls,
and use Neovim's built-in spell checking instead.
Now I use [ltex_extra.nvim], which provides code actions for adding unknown words, disable rules, and hide false positives.

[168]: https://github.com/valentjn/ltex-ls/issues/168


BTW, the Grammarly LSP [does not support this][294], either.

[294]: https://github.com/znck/grammarly/discussions/294
