# Vim Completion Configuration

## A Bit of History

Vim has built-in support for completions in insert or replace modes,
mostly based on the content of the current file and included files.
By default, it uses separate Emacs-style key bindings (`<C-x C-key>`)
for different kinds of completions.
See `:help ins-completion` for more information.

The modern approach is utilizing language server protocol, a.k.a. LSP, and machine learning.

The concept of LSP is pioneered by vscode,
so a lot of language servers are written in Node.js and TypeScript.
While mostly used for LSP,
[CoC] brings the ecosystem of vscode extensions to vim,
which makes porting them to vim easier.

[CoC]: https://github.com/neoclide/coc.nvim

Then Neovim 0.5+ introduces native LSP support,
based on Lua instead of Node.js.
However, as mentioned above, since a lot of language servers are written in Node.js,
most likely Node.js is still needed.

## LunarVim

I use LunarVim, a Neovim distribution,
which uses native LSP
and will install supported language servers automatically upon opening files.

LunarVim disables automatic support for some file types.
I have to install and enable LSP for them manually.

For example, to install the [marksman] LSP for Markdown,
under LunarVim, type:

```vim
:LSPInstall marksman
```

[marksman]: https://github.com/artempyanykh/marksman

After installation, edit
`~/.config/lvim/after/ftplugin/markdown.lua`
to configure LSP for the Markdown file type:

```lua
require("lvim.lsp.manager").setup("marksman")
-- marksman has no formatting capability.
local formatters = require "lvim.lsp.null-ls.formatters"
formatters.setup {
  { name = "prettier", filetypes = { "markdown" } },
}
```

## Machine Learning based Completion

Two popular options of machine learning assisted completion are Tabnine and GitHub Copilot.

Compared to Copilot, Tabnine has two [advantages]:

- Free plan available.

    I have used the free plan for a while.
    It does not include whole line and full-function code completion.
    And Tabnine Pro is [$12 per month], slightly higher than Copilot ([$10 per month]).

- Local machine mode.

    Tabnine's free plan is based on the cloud.
    Tabnine Pro's offline installation requires contacting [sales].

[advantages]: https://www.tabnine.com/tabnine-vs-github-copilot
[$12 per month]: https://www.tabnine.com/pricing
[$10 per month]: https://github.com/features/copilot/
[sales]: https://support.tabnine.com/hc/en-us/articles/5409869385873-Offline-Installation-Usage-of-Tabnine

Thus, I [use Copilot with LunarVim].

[Tabnine]: https://www.tabnine.com/
[use Copilot with LunarVim]: https://www.lunarvim.org/plugins/02-extra-plugins.html#copilot-lua-and-copilot-cmp

