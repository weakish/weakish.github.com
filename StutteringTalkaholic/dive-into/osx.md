# OSX Survival Guide

## Lock Screen

1. Launch System Preferences.
2. In `Security & Privacy` > `General`, check `Require password after sleep or screen saver begins`

Now hit `Control+Shift+Power` to turn off and lock screen.

## Turn off Internal Display

**When the power adapter is connected:**

1. Close the lid to put laptop to sleep.
2. Reactivate laptop via external input devices, e.g. keyboard.
3. I think example

## Keyboard

In System Preference > Keyboard > Modifier Keys,
`Control` and `Command` keys can be swapped,
and `Caps` can be used as an additional `Escape` key.

[Karabiner-Elements][karabiner] is a powerful keyboard modifier for osx.
For example, it supports [PC-style keyboard shortcuts][pc-style].
However, some of them do not work, and results in inconsistent keyboard shortcuts.
It is recommend to swap `Control` and `Command` through Karabiner-Elements' simple modification instead.
And import certain complex rules like `Alt-Tab` from it individually.

[karabiner]: https://pqrs.org/osx/karabiner/document.html#configuration-simple-modifications

[pc-style]: https://pqrs.org/osx/karabiner/complex_modifications/#pc_shortcut

## Mouse

Unselect "Scroll direction: Natural" in System Preferences > Mouse.
(The direction may be natural to touch screen, but it is not natural for mouse at all.)

## Tiling

Long press the restore button, then drag the window to the left or right part of the screen.

Another way is activating mission control.
Then move one window to another full screen window in another virtual desktop.

Drag the edge between two tiling windows to adjust the size of the two windows at the same time.

## Virtual Desktops

Press `Ctrl-Left/Right` to switch among virtual desktops.

Press `Ctrl-Up/Down` to show an overview of desktops or go back to normal mode.

## Screen Recording

QuickTime > File > New Screen Recording

## Finder

By default, `~/Library` is hidden.
To reveal it in Finder temporarily,
hold the Option key, then click the `Go` menu,
and the Library fodler is revealed in the dropdown menu.

To permanently reveal the Library folder in Finder, run the following command:

```sh
chflags nohidden ~/Library/
```

BTW, most applications' user configuration files are in `~/Library/Application Support`.

## Safari

To enable developer tools, select "Show Develop menu in menu bar" in Safari > Preferences > Advanced.

There are several vi shortcuts extensions for safari, for example, [sVim].

[sVim]: https://github.com/flipxfx/sVim

sVim can be configured via sVimrc via the extension settings in Safari.
I mapped `d` and `D` to close and undo close tab:

```
" Shortcuts

map "d" quit
map "shift+d" lastClosedTab
```

## Google

Google accounts can be added to the Mail.app.
Except for the gmail, other osx applications can also sync with Google account:

- Contacts
- Calanders
- Messages (with Google Talk)
- Notes (via gmail, tagged as notes)

## (No) Devops

Faults of [boxen]:

1. It depends on Xcode or Xcode Command Line Tools but cannot install them automatically.
2. Mainly for Ruby and Node.js developers.

[boxen]: https://github.com/boxen/our-boxen/

So I just setup osx manually.
