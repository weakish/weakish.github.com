# macOS Survival Guide

## Create a Bootable Installer

I created a bootable installer to install macOS offline,
in case that something went wrong.
Although macOS can be installed from Internet in recovery mode, it is unreliable and slow.
I first tried a Sandisk 16GB USB drive, and it failed during copying the installer content.
Then I tried a Toshiba 32GB USB drive, and the creation succeeded.
I am not sure if 16GB is too small or macOS installer is fussy on USB drive models.

[installer]: https://support.apple.com/en-us/HT201372

I also set secure boot to medium security, to avoid connecting to Apple servers when installing operating systems. 

## Enable TouchID for sudo

Add `auth sufficient pam_tid.so` in `/etc/pam.d/sudo_local`.

## Set Timezone to GMT

I am frustrated to dealing with timezones.
Why not everyone uses UTC+0?

```sh
sudo systemsetup -settimezone GMT
```

And got a [-99 error](https://github.com/LnL7/nix-darwin/issues/359#issuecomment-1209428101).
But it seems that the timezone has changed to GMT.

```sh
; sudo systemsetup -gettimezone
Time Zone: GMT
```

For safety, I unselect the "Set time zone automatically using current location" option in "System Preferences > Date & Time > Time Zone".

## Keyboard

In System Preference > Keyboard > Modifier Keys, I set CapsLock as Esc.

By the way, OS X has native system-wide support for some Emacs keybinds, e.g.

| Command | Key | Alternatives |
| - | - | - |
| beginning-of-line | `^a` | `<D-Left>` |
| end-of-line | `^e` |`<D-Right>` |
| previous-line | `^p` | `<Up>` |
| next-line | `^n` | `<Down>` |
| forward-char | `^f` | `<Right>` |
| backward-char | `^b` | `<Left>` |
| delete-char | `^d` | N/A |
| backward-delete-char | `^h` | `<Delete>` |
| transpose-char | `^t` | N/A |
| kill-line | `^k` | N/A |
| yank-line | `^y` | N/A |
| insert-line | `^o` | N/A |
| page-down | `^v` | `<Fn+Down>` |
| recenter | `^l` | N/A |

And there are some keybinds slightly different the original Emacs keybinds:

- forward/backward-word, use two keys (`Control` and `Option`) for the `Meta` key. Alternatives: `Option` with arrow keys.
- `M-<` and `M->` are unavailable on macOS. But `<D-Up>` and `<D-Down>` can be used to go to the begin and end of document.
- `M-v` is unavailable, but `<Fn+Up>` can be used for page up.
- `C-l` for recenter is unavailable.
- Also, `C-s` and `C-r` for search is unavailable.
- shrink/extend-selection, add an additional `Shift` key but not needing to enter the selection mode (`C-SPC`) first.

My keyboad has arrow keys and I feel using arrow keys are more nature.

## Trackpad

In System Preferences > Trackpad:

- Change "Look up" to three-finger tap.

- Select "Swipe down with three fingers" for App Expose.

- Unselect "Lanuchpad" and "Show Desktop".

- Select "Tap to click".

- Unselect "Scroll direction: Natural".

    It may be natural on touchsceen, but I feel it unnatural on trackpad and mouse.

## Turn off Internal Display

**When the power adapter is connected:**

1. Close the lid to put laptop to sleep.
2. Reactivate laptop via external input devices, e.g. keyboard.

## Window Management

I feel the window management under macOS weird.

### Stage Manager

I do not use stage manager.
It is inaccessible from keyboard shortcuts.
Besides, it causes latency when switching between windows. 

### Tiling

By default, macOS only supports tiling two windows vertically.
I want to tile windows via keyboard shortcuts.
Therefore, in Settings > Keyboard > Keyboard Shortcuts > App Shortcuts,
I add the following two shortcuts under "All Applications":

- "Move Window to Left Side of Screen": `C-A-Left`
- "Move Window to Right Side of Screen": `C-A-Right`


### Virtual Desktops

Press `Ctrl-Left/Right` or swipe three fingers from left to right to switch among virtual desktops.

Press `Ctrl-Up` to show an overview of desktops.

`Fn-f` will turn the focused application to full screen.
All full screen application will occupy an entire virtual desktop,
which will be created and destroyed upon the application entered and exited full screen.

`Ctrl-Down` shows all windows of the current application
and ``Cmd-``` switches among windows of the current application.
Both of them only apply to windows in the current virtual desktop.
Therefore, full screen applications do not work with them.

There is no such concept called maximize under recent versions of macOS.
The most similar thing is "zoom", which sometimes maximizes the window,
sometimes not, depending on the type of the window and its content.
Similarly to tilling, I added keyboard shortcut for it:

- "Zoom": `Alt-Cmd-f`

Also, I enabled `Ctrl-Num` shortcuts under
`Settings > Keyboard > Keyboard shortcuts > Mission Control > Mission Control`.
However, this only works for virtual desktops I created by myself,
not automatically managed desktops for full screen applications.

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

There are several vi shortcuts extensions for safari, for example, [vimari].

[vimari]: https://github.com/televator-apps/vimari

Due to the limitation of Safari, vimari has fewer key bindings than similar extensions for other browsers.
Also, by default it binds `w/q` for next/previous tab, which I feel hard to remember.
[Vimium] uses `J/K`, which I also hard to remember.
Thus, I just remove them and use Safari native keyboard shortcuts.
Also, I find myself more frequently open links in new tabs,
so I swapped `f` and `F`, using `f` to toggle links for opening the link in background tab.

```json
"hintToggle": "shift+f",
"newTabHintToggle": "f",
```

[Vimium]: https://github.com/philc/vimium

## Google

Google accounts can be added to the Mail.app.
Besides gmail, other osx applications can also sync with Google account:

- Contacts
- Calenders
- Messages (with Google Talk)
- Notes (via gmail, tagged as notes)
