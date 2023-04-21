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

## Machine Learning based Completion

Popular options of machine learning assisted completion are:

- Tabnine
- GitHub Copilot
- Codeium
- Amazon CodeWhisperer

I have used Tabnine (free plan) for a while.
It does not include whole line and full-function code completion.
Although Tabnine Pro offers offline installation, it requires contacting [sales].
Its free plan is based on the cloud, just like Copilot.
And Tabnine Pro is [$12 per month], slightly higher than Copilot ([$10 per month]).

[$12 per month]: https://www.tabnine.com/pricing
[$10 per month]: https://github.com/features/copilot/
[sales]: https://support.tabnine.com/hc/en-us/articles/5409869385873-Offline-Installation-Usage-of-Tabnine

Both Codeium and Amazon CodeWhisperer are free for personal use.
Currently CodeWhisperer only supports VSCode and JetBrain IDEs.
Thus, I use Codeium.

