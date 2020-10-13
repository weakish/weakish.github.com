# OSX Survival Guide

## Bootstrap

[strap] is the [successor of boxen] created by the current homebrew maintainer [Mike McQuaid].

[strap]: https://github.com/MikeMcQuaid/strap
[successor of boxen]: https://mikemcquaid.com/2016/06/15/replacing-boxen/
[Mike McQuaid]: https://mikemcquaid.com

### Download the Script

```sh
curl https://raw.githubusercontent.com/MikeMcQuaid/strap/master/bin/strap.sh > strap.sh
```

### Configuration

Edit the `strap.sh` script, e.g. using vim, uncomment and fill up the following environment variables:

```sh
# STRAP_GIT_NAME=
# STRAP_GIT_EMAIL=
# STRAP_GITHUB_USER=
# STRAP_GITHUB_TOKEN=
# CUSTOM_HOMEBREW_TAP=
# CUSTOM_BREW_COMMAND=
```

- `STRAP_GIT_NAME` and `STRAP_GIT_EMAIL` is for git `user.name` and `user.email`, and contact info on login screen.
- `STRAP_GITHUB_USER` is to for git `github.user` and accessing your `dotfiles` and `homebrew-brewfile` repositories.
- `STRAP_GITHUB_TOKEN` is needed to allow homebrew to reduce the rate limit of `brew search` command and to tap your private repositories (the token can be generated at GitHub > Settings > Developer settings > Personal access tokens, with scope `repo, user`).
- `CUSTOM_HOMEBREW_TAP` and `CUSTOM_BREW_COMMAND` are optional, to add your personal homebrew tap and custom brew command which will be run at the end of the bootstrap.

The customized `strap.sh` can be automatically generated at https://macos-strap.herokuapp.com/,
which asks for your authorization on GitHub.
But I prefer to edit the script manually.

strap is idempotent, so you can run it first,
adding custom dotfiles and brewfile repositories later,
then run it again.

### Run

```
/bin/bash strap.sh
```

## Keyboard

In System Preference > Keyboard > Modifier Keys,
`Control` and `Command` keys can be swapped.
However, under the terminal I'd like to use the classical ctrl prefixed shortcuts, thus I swapped them back again.
[iTerm2] is a terminal emulator with this option.

[iTerm2]: https://www.iterm2.com/

I also installed [AltTab] to switch applications with `alt-tab`.

[AltTab]: https://alt-tab-macos.netlify.app/

## Mouse

Unselect "Scroll direction: Natural" in System Preferences > Mouse.
(The direction may be natural to touch screen, but it is not natural for mouse at all.)

## Trackpad

Select "Tap to click" in System Preferences > Trackpad.

## Lock Screen

Press `Control+Shift+Power` to turn off and lock screen.
Alternatively, you can put the `Screen Lock` icon on touch bar (System Preference > Keyboard > Touch Bar) or configures hot corners.

## Turn off Internal Display

**When the power adapter is connected:**

1. Close the lid to put laptop to sleep.
2. Reactivate laptop via external input devices, e.g. keyboard.

## Tiling

Long press the restore button, then select tiling in drop-down menu.

Another way is activating mission control.
Then move one window to another full screen window in another virtual desktop.

Drag the edge between two tiling windows to adjust the size of the two windows at the same time.

## Virtual Desktops

Press `Ctrl-Left/Right` to switch among virtual desktops.

Press `Ctrl-Up/Down` to show an overview of desktops or go back to normal mode.

## Finder

By default, `~/Library` is hidden.
To reveal it in Finder temporarily,
hold the Option key, then click the `Go` menu,
and the Library folder is revealed in the dropdown menu.

To permanently reveal the Library folder in Finder, run the following command:

```sh
chflags nohidden ~/Library/
```

BTW, most applications' user configuration files are in `~/Library/Application Support`.

## Safari

To enable developer tools, select "Show Develop menu in menu bar" in Safari > Preferences > Advanced.
You can also change the default encoding to UTF-8.

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
- Calenders
- Messages (with Google Talk)
- Notes (via gmail, tagged as notes)

## Chinese Input Method

I use [the built-in Double Pinyin Input Method][double-pinyin].
The built-in input method uses Caps to switch between English and Chinese mode,
which makes sense to me.
I also [use Caps to switch between English and Chinese mode under Linux][caps]
(the trick is to `clear lock` and bind Caps to another unused key, e.g. `Multi_key`, then configure it as the switch key in fcitx).

[double-pinyin]: https://scomper.me/gtd/xi-tong-shuang-pin-shu-ru-fa-@vgow
[caps]: https://www.wancat.cc/post/capslock/