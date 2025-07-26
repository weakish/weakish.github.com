---
wnpp:
    type: "RFA"
    description: "This manual is outdated and I no longer use Windows."
---

# Windows User Manual

## Software

- **Visual Studio Code**: I don't really like it much, but its ecosystem is just too good - things like GitHub Copilot and WSL2 work out of the box.
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
