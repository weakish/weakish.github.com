# Windows 使用手冊

## 使用 Windows 的理由

- 衆所周知，好人纔能用蘋果電腦，顯然我不是好人。
- 標榜 KISS 的 Arch 居然使用 Systemd，讓我大失所望。要說功能強大，Windows 比 Systemd 強大多了。所以與其讓 Systemd 來啓動 Linux，不如乾脆讓 Windows 來啓動。
- 最主要的，我比較害怕蟑螂。目前 Windows 系統自帶的 unicode 版本還不夠新，蟑螂 emoji 會顯示成豆腐塊。

## 軟體

- **Debian** 我最熟悉的發行版
- **Vivaldi** Opera 創始人復活了 Mozilla Application Suite
- **Visual Studio Code** 其實我不怎麼喜歡，無奈它的生態實在太好了，比如 GitHub Copilot 和 WSL2 都是開箱即用。
- **小狼毫** 系統自帶的微軟拼音並不尊重英文鍵盤佈局，還要改註冊表纔能換到 dvorak 佈局，也不方便輸入直角引號。
- **Notepad++** 輕便的文本編輯器
- **Windows Terminal** 應該預裝卻沒有預裝的終端模擬器
- **PowerToys** 這些功能也應該直接做進系統

## Docker

鑑於 Docker Desktop For Windows 的許可問題，我直接在 WSL2 的 Debian 裏安裝了 Docker.
WSL2 中的 Debian 環境和標準 Debian 有所差異（比如沒有 systemd），所以 Docker 不能開箱即用，需要額外進行一些配置，詳見[這裏的說明][github-wsl]。

[github-wsl]: https://github.com/microsoft/WSL/discussions/4872#discussioncomment-76635

## 命令行下訪問剪貼板

WSL 2 下可以使用 `powershell.exe Get-Clipboard` 和 `clip.exe` 讀寫剪貼板的內容：

```sh
powershell.exe Get-Clipboard | cut -d ',' -f1 | clip.exe
```
