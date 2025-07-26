# Windows User Manual

## Reasons to Use Windows

- As everyone knows, only good people can use Apple computers, and clearly I'm not a good person.
- Arch, which claims to follow the KISS principle, actually uses Systemd, which greatly disappointed me. Speaking of powerful features, Windows is much more powerful than Systemd. So rather than letting Systemd boot Linux, it's better to just let Windows boot.
- Most importantly, I'm quite afraid of cockroaches. The current built-in Unicode version in Windows isn't new enough, so cockroach emojis display as tofu blocks.

## Software

- **Debian** The distribution I'm most familiar with
- **Vivaldi** The Opera founder revived Mozilla Application Suite
- **Visual Studio Code** I don't really like it much, but its ecosystem is just too good - things like GitHub Copilot and WSL2 work out of the box.
- **Weasel** The built-in Microsoft Pinyin doesn't respect English keyboard layouts, requires registry edits to switch to dvorak layout, and isn't convenient for inputting straight quotation marks.
- **Notepad++** Lightweight text editor
- **Windows Terminal** A terminal emulator that should be pre-installed but isn't
- **PowerToys** These features should also be built directly into the system

## Docker

Given the licensing issues with Docker Desktop For Windows, I installed Docker directly in Debian within WSL2.
The Debian environment in WSL2 differs from standard Debian (for example, no systemd), so Docker doesn't work out of the box and requires some additional configuration. See [the instructions here][github-wsl].

[github-wsl]: https://github.com/microsoft/WSL/discussions/4872#discussioncomment-76635

## Accessing Clipboard from Command Line

In WSL 2, you can use `powershell.exe Get-Clipboard` and `clip.exe` to read and write clipboard contents:

```sh
powershell.exe Get-Clipboard | cut -d ',' -f1 | clip.exe
```
