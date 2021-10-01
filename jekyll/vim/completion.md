# VIM Completion Configuration

## Built-in

Vim has built-in support for completions in insert or replace modes.
See `:help ins-completion`.

By default, Vim uses separate Emacs style key bindings (`<C-x C-key>`)
for different kinds of completions.

There are two plugins to use a single `Tab` key for completions:

- [SuperTab](https://github.com/ervandew/supertab)
- [VimCompletesMe](https://github.com/ajh17/VimCompletesMe)

There is also [AutoComplPop][] to automatically pop up completions.

[AutoComplPop]: http://www.vim.org/scripts/script.php?script_id=1879

### VimCompletesMe

#### Why

Count source lines of code (VimScript comments start with `"`):

```sh
; cat supertab.vim | egrep -v '^("|([[:blank:]]*$))' | wc -l
923
; cat VimCompletesMe.vim  | egrep -v '^("|([[:blank:]]*$))' | wc -l
82
```

Period.

#### Configuration

Without any configuration, the Tab key will, depending on the context, offer:

- Vim's local keyword completion (Ctrl-X_Ctrl-N)
- File path completion when typing a path (Ctrl-X_Ctrl-F)
- Omni-completion after typing a period or an arrow operator (Ctrl-X_Ctrl-O)

With a `b:vcm_tab_complete` variable,
you can set the Tab key to use the following type of completions:

- Dictionary words (Ctrl-X_Ctrl-K)
- User-defined completion (Ctrl-X_Ctrl-U)
- Tags (Ctrl-X_Ctrl-])
- Vim command line (Ctrl-X_Ctrl-V)
- Omni completion (Ctrl-X_Ctrl-O)

If any of above types of completions fails to return any results,
hitting Tab again will switch back to Vim's local keyword completion.

You can set the b:vcm_tab_complete variable interactively, or in `~/.vimrc`:

```vim
autocmd FileType text,markdown let b:vcm_tab_complete = 'dict'
```

### AutoComplPop

Use `Enter` to commit completion.
Use arrow keys (`Up|Down`) to select completions.

It works well for certain file types,
while distracting on other types such as text.

## External engine

### [YouCompleteMe](http://valloric.github.io/YouCompleteMe/)

YouCompleteMe is a fast, as-you-type, fuzzy-search code completion engine.
It has several completion engines:

- an identifier based engine that works with every programming language,
- a Clang based engine that provides native semantic completion
    for C-family languages,
- a Jedi-based completion engine for Python 2 and 3,
- an OmniSharp-based completion engine for C#,
- a combination of Gocode and Godef semantic engines for Go,
- a TSServer-based completion engine for TypeScript,
- a Tern-based completion engine for JavaScript,
- a racer-based completion engine for Rust,
- and an omnifunc-based completer for many other languages

YCM also provides semantic IDE-like features in a number of languages:

- finding declarations, definitions, usages, etc. of identifiers,
- displaying type information for classes, variables, functions etc.,
- displaying documentation for methods, members, etc. in the preview window,
- fixing common coding errors, like missing semi-colons, typos, etc.,
- semantic renaming of variables across files (JavaScript only).

Tho downside is it consumes a lot of RAM.

### [neocomplete](https://github.com/Shougo/neocomplete.vim)

neocomplete maintains a cache of keywords in the current buffer.
It requires Vim 7.3.885+ with Lua enabled.
It sometimes be slower than YCM, but requires much less RAM.

You can configure it to use Tab key to complete,
and/or automatically pops up completion menu.

## Conclusions

- If we need basic completions that works out of box:
    VimCompletesMe;
- If we need auto-pop basic completions:
    AutoComplPop and VimCompletesMe;
- IDE like features: YouCompleteMe;
- a balance between features and resources: neocomplete.
