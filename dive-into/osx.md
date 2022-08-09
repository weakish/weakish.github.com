# macOS Survival Guide

## Create a Bootable Installer

I created a bootable installer to install macOS offline,
incase that something went wrong
macOS can be installed from Internet in recovery mode, but it is unreliable and slow.
I first tried a Sandisk 16GB USB drive, and it failed during copying the installer content.
Then I tried a Toshiba 32GB USB drive, and the creation succeeded.
I am not sure if 16GB is too small or macOS installer is fussy on USB drive models.

[installer]: https://support.apple.com/en-us/HT201372

## Install Linux

I always feel that I can only own a computer truely after I have installed Linux on it.
So after finishing the macOS initial setup (user account, etc.), I rebooted to the recovery mode (Command+R on Intel based Macintosh machines with a T2 chip).

Then I added an partition via disk utility in the recorvery mode.
This partition is for Linux, so the format does not matter.
Adding a new partition will automatically resize the current macOS partition,
which is much slower if performed under macOS instead of recovery mode.

I also disable secure boot and enable external boot.

Then I just booted into the installation USB drive, and installed [EndeavourOS].
I chose the replace partition option with encrypted file system.
The installer set up LUKS encryption and ext4 automatically.
If I had choosen the "erase all" option, I can do some customizations, such as ext4/btrfs, swap partition/file, etc.
However, I need a dual boot machine.

[EndeavourOS]: https://wiki.t2linux.org/distributions/endeavouros/installation/

## Enable TouchID for sudo

Add `auth sufficient pam_tid.so` in `/etc/pam.d/sudo`.

## Install Homebrew

The Homebrew installer script will install Command Line Tools for Xcode automatically.

After installation, turn off analytics:

```sh
brew analytics off
```

## Install ExtFS

I tried to install Paragon ExtFS for ext{2,3,4} read/write support via homebrew:

```sh
brew install paragon-extfs
```

Homebrew reports the installation succeeded, but I can not find the extF application.
Thus I manually opened the installer in `/usr/local/Caskroom/paragon-extfs/latest/` to install ExtFS.
I allowed ExtFS in Settings > Security & Privacy, and restarted the system as ExtFS installer required.
After that, I tried mounting a ext4 removable drive and succeeded. 

## Keyboard

In System Preference > Keyboard > Modifier Keys,
`Control` and `Command` keys can be swapped.
However, under the terminal I'd like to use the classical ctrl prefixed shortcuts, thus I swapped them back again.
[iTerm2] is a terminal emulator with this option.

[iTerm2]: https://www.iterm2.com/

I also installed [AltTab] to switch applications with `alt-tab`.

[AltTab]: https://alt-tab-macos.netlify.app/

By the way, OS X has native system-wide support for some Emacs keybinds, e.g.

| Command | Key |
| - | - |
| beginning-of-line | `^a` |
| end-of-line | `^e` |
| previous-line | `^p` |
| next-line | `^n` |
| forward-char | `^f` |
| backward-char | `^b` |
| delete-char | `^d` |
| backward-delete-char | `^h` |
| transpose-char | `^t` |
| kill-line | `^k` |
| yank-line | `^y` |
| insert-line | `^o` |
| page-down | `^v` |
| recenter | `^l` |

And there are some keybinds slightly different the orignal Emacs keybinds:

- forward/backward-word, use two keys (`Control` and `Option`) for the `Meta` key.
- shrink/extend-selection, add an additional `Shift` key but not needing to enter the selection mode (`C-SPC`) first.

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
