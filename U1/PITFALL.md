# U1 · 卡住了？先看這裡

| 狀況 | 解法 |
|---|---|
| `git status` 顯示 `fatal: not a git repository` | 正常，因為你拿到的是 zip。先做 `STEP-00-zip-to-git.md` 的 `git init` |
| VS Code 只看到 `src/` 和 `package.json` | 你開到 `web-lab/` 了。請重新 Open Folder 到 `ai-project-foundation-kit/` 根目錄 |
| 雙擊 `start-m11.bat` 視窗一閃就關 | 先裝 Node.js LTS，裝完重開機再試 |
| 瀏覽器沒自動開 | 自己打開終端機顯示的網址，通常是 http://localhost:5180 |
| 5180 被占用 | Vite 會自動換 port；以終端機顯示的網址為準 |
| 檔案樹是空的 | VS Code 要開 `ai-project-foundation-kit` 這一層 |
| 改了 `data.js` 畫面沒變 | 確認有存檔、dev server 還在跑；不行就重新整理 |
| `git switch -c` 失敗 | 可能已經有同名分支；換老師指定分支名 |
| `git commit` 說要設定 email | 照終端機提示設定 `user.name` / `user.email` |
| AI 一開始就改檔 | 停下來，先看 `git status`；不確定就舉手 |
| 做完 STEP 02 不知道要幹嘛 | 回 `U1/README.md`，接著做 STEP 03 Git flow 和 STEP 04 Claude Code / Codex |
| AI review 只說「看起來很好」 | 不合格。要求它列 Changed Files、Scope Check、Risk |
| 不知道 Claude Code / Codex 差在哪 | C1 先不用分很細；兩者都先做「讀專案」與「review diff」，不要直接叫它們大改 |

原則：任何一步卡超過 5 分鐘，先舉手，用保底方案跟上進度。
