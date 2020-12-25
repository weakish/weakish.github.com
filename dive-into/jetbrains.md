# Dive into JetBrains IDEs

## Appearance

- Appearance: **Darcula**
- Color Scheme: **Colorful Darcula**
- Color Scheme Font: **24** for 13-inch display

## Keymaps

I use Sublime Text keymap with a few tweaks:

- Basic completion: **Tab**. With the auto formatting function, I do not need to use Tab to indent. Thus Tab can be used to trigger completion. And when the completions pop up, I can press Tab again to confirm the completion candicate, very convinient.
- Find Action: the ultimate keyboard shortcut deserves **F1** (inspired by vscode)
- Rename variable name: **F2** is used for renaming file names in most file managers and renaming variables in vscode. For consistency, I also removed `Ctrl+F2` for toggling bookmark, and bind `Ctrl+F2` to introducing variables, `Shift+F2` to inline variables, `Ctrl+Shift+F2` to introduce constants, `Alt+F2` to introduce functions (extract methods).
- Go to declaration or usage: **F4** since this powerful navigation includes the function of "go to source".
- Quick documentation: **F5** is near **F4** (jump to source). I have poor memory and check documentation and source frequently.
- Go to symbol: **F6** goes to address bar in web browsers. Thus I use F6 to navigate. And F6 is near F5 (go to documentation) and F4 (go to source). The default three-key combo (ctrl+shift+R) is too hard to remember and type.
- Find usage: **F7** since it is consistent with `Ctrl+F7` (find usage in current file). Although **F4** can go find usages at the declaration , sometimes I still want to find other usages when not at the declaration.
- Last edit location: **F8** since it is near F9.
- Toggle bookmark: **F9** inspired by Yin Wang. I also set alt/ctrl/shift + F9 to show/next/previous bookmark. P.S. F2 - F9 are all used for navigation.
- Terminal: **F12** since I use terminal a lot and already bind go to declaration/usage to F4. Why not keep the default? Because I want all navigation related actions are in nearby keys (F2-F9). Also, F12 in web browser opens the console.
- Complete Current Statement: **C-Enter** since I used it far more frequently than inserting a new line.


### Fn

I bind frequently used actions to F keys, so they are easier to reach.
The "Sublime" field refers to the default keyboard shorts for the real Sublime Text editor, not the Sublime Text keymap for JetBrains IDEs.

| Key | Default | Sublime | Me | Rationale |
| - | - | - | - | - | - |
| F1 | help | n/a | find action | inspired by vscode |
| F2 | next error | next bookmark | refactor: rename | inspired by file managers and vscode |
| F3 | next occurrence | next occurrence | next occurrence  | convention |
| F4 | jump to source | next results in find all | go to declaration/usage | more powerful than "jump to source" |
| F5 | refactor: copy | n/a | quick documentation | near F4 |
| F6 | refactor: move | toggle spell check | go to symbol | inspired by go to address bar in web browser |
| F7 | debug: step into | build | find usage | consistent with `Ctrl+F7` (find usage in current file) |
| F8 | debug: step out | n/a | last edit location  | near F9 |
| F9 | debug: resume | sort lines | toggle bookmark | Inspired by Yin Wang. |
| F10 | menu (os) | menu (os) | menu (os) |
| F11 | toggle fullscreen | toggle fullscreen | toggle fullscreen | convention |
| F12 | go to declaration/usage | go to definition | terminal | Already bind go to declaration/usage to F4 and inspired by web browser (F12 for the console). |

## Other Tweaks

- Editor > General > Code Completion: enable "sort completion suggestions based on machine learning".
- Tools > Terminal > Application Settings > Shell path: change from `/bin/bash` to `/usr/bin/fish`.