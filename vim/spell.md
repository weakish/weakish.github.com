# Spell Checking in Vim

Vim has built-in support for spell checking.
This built-in function provides basic spell checking.
For example, it does not recognize 'localhost', 'Lua' or 'Node.js'.
However, new words can be added quickly via `zg` in normal mode.

LunarVim, the Neovim distribution I use,
enables spell checking for commit messages and markdown by default.

To check grammar and stylish errors,
Grammarly or [LanguageTool] can be used.

[languagetool]: https://languagetool.org/

I prefer LanguageTool because it is open source.
All the errors can be checked with [ltex-ls] locally,
without making any network requests.

[ltex-ls]: https://valentjn.github.io/ltex/

Unfortunately, ltex-ls [does not support adding unknown words to dictionary][168].
Thus, I disabled the spell checking rule from ltex-ls.
Neovim's built-in spell checking is used instead.

[168]: https://github.com/valentjn/ltex-ls/issues/168

```lua
local ltex_options = {
  settings = {
    ltex = {
      disabledRules = {
        ["en-US"] = { "MORFOLOGIK_RULE_EN_US" }
      },
    },
  },
}
require("lvim.lsp.manager").setup("ltex", ltex_options)
```

Alternatively, ltex-ls can be configured to [use the normal vim user dictionary][workaround].
The downside is a restart of Neovim is required for ltex-ls to recognize newly added words.
Vim autocmd may be used to update the word list automatically,
but this adds complexity to the configuration.

[workaround]: https://github.com/valentjn/ltex-ls/issues/168#issuecomment-1236595760

BTW, the grammarly LSP [does not support this][294], either.

[294]: https://github.com/znck/grammarly/discussions/294
