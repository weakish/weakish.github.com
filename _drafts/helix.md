# Helix Try On

## Installation

I installed helix via MacPorts.

## Keymap

Keymap is similar to vim.

Unlike vim, helix follows the `selection -> action` model.
For example, `wd` instead of `dw` to delete a word.
This also means that vim is more line oriented but helix is more selection oriented. 
For example, `f`, `F`, `t`, and `T` are not confined to the current line.
Also, `dd` (delete a line) and `yy` (copy a line) are unavailable in helix.
Helix uses `xd` and `xy` instead,
where x selects current line, if already selected, extends to next line.
Similarly, `*` (search for the word under the cursor) is unavailable in helix.
Helix uses `be*n` instead,
where `b` selects to the begining of the word, `e` selects to the end of the word, effectively selecting the whole word, `*` uses the current selection as the search pattern, and `n` goes to the next occurence (same to vim).
Another example is global replace in helix is `%sREGEX<RETURN>cREPLACEMENT<ESC>`,
where `%` selects the entire buffer (`ggVG` in vim), `s` opens a prompt for a regex,
`c` deletes the selection and enters insert mode,
and `<ESC>` goes back to normal mode.

`C-s` can saves a location in the jumplist, but there is no named bookmarks as in vim.

- Alt-ArrowKey: Select parent/child/previous/next node in syntax tree.
- z/Z: View/sticky view mode for scrolling without changing the selection.
- g: Goto mode. For example, `gg` goes to the first line (same to vim), `ge` goes to the last line (`G` in vim), `gh` goes to line start (`0` in vim), `gs` goes to first non-blank character of the line (`^` in vim), and `gl` goes to line end (`$` in vim).
- m: Match mode. For example, `mm` jumps to matching bracket (`%` in vim).
- Vim-unimpaired style mappings.
- Keys in picker and prompt cannot be re:mapped.

Helix's keymap is more consistent than vim,
which means it is more friendly to new users.
But I miss a lot of vim keybinds in my muscle memory.
Thankfully, some of them can be restored via [configuration].

[configuration]: https://github.com/LGUG2Z/helix-vim

## Commands

As mentioned above, unlike vim, replacing text does not require command mode.
Also, some commands are different, for example:

```
:reload # reload a file from disk, `:e` in vim

:sh command # `:!command` in vim  
```

## Configuration

`:config-open` to open helix config file,
and `:config-reload` to reload the config.

Config file format is TOML.
For example, to change the cursor shape to bar in insert mode:

```toml
[editor.cursor-shape]
insert = "bar"
normal = "block"
select = "underline"
```

Without this configuration, insert mode also uses a block cursor, same to normal mode.
This bothers me a lot since I get used to using the cursor shape to distinguish normal and insert mode under vim.
I guess helix encourages me to stay in insert mode as short as possible.
Therefore, there is no need to distinguish normal and insert mode with cursor shape.
Also, the reason behind this design may be only the primary cursor can change shape due to limitations of the terminal environment.

## Language Servers

Helix support most languages out of the box.
Just ensure the language server binary is in the `PATH`.
Run `hx --health` to see a list of all the supported languages.

### LTeX

The vscode LTeX extension quick action adds words to `.vscode/ltex.dictionary.en-US.txt` by default.
This file will not be recognized by ltex-ls by default under Helix.
The vscode LTeX extension will also read word list in `~/.local/share/ltex`,
which will not be recognized by ltex-ls either.
Trying to set language via magic comment does not work:

```html
<!-- LTeX: language=en-US -->
```

I verified that magic comment itself does recognized by ltex-ls via changing the language to `de-DE`. 
Configure `ltex.language` also does not make word list recognized.

## Missing Features

Some features available in other IDEs/editors are absent in Helix.

Solution: use other <del>editors</del> dedicated external tools instead.

### Git Frontend

Helix has not integrated a git frontend to view history and stage changes [yet][#227],
but I am comfortable using git command line directly,
where I have a lot of aliases defined in my `~/.gitconfig`.
Sometimes when finding `git -p` a bit tedious to use,
I run [gitui] instead.
When I need to reorganize and rewrite git history a lot,

I use [GitUp], which is powerful and speedy at rewriting git history.
However, it has [not support signing commits yet][#691].
If repositories require commits signing, I run `git rebase --signoff` before push.  

[#227]: https://github.com/helix-editor/helix/issues/227
[gitui]: https://github.com/extrawurst/gitui
[GitUp]: https://gitup.co
[#691]: https://github.com/git-up/GitUp/pull/691

### Global Replace in Workspace

Helix already supports global search,
but there is [no global search and replace view in workspace][#4381].
I use [far] for this.

[#4381]: https://github.com/helix-editor/helix/pull/4381

## References

- [Migrating from Vim to Helix](https://github.com/helix-editor/helix/wiki/Migrating-from-Vim)

- [Helix Documentation](https://docs.helix-editor.com/title-page.html)

- [Helix FAQ](https://github.com/helix-editor/helix/wiki/FAQ)
