# U1 · 卡住了？先看這裡

| 狀況 | 解法 |
|---|---|
| 雙擊 `start-m11.bat` 視窗一閃就關 | 先裝 Node.js LTS，裝完重開機再試 |
| 瀏覽器沒自動開 | 自己打開終端機顯示的網址，通常是 http://localhost:5180 |
| 5180 被占用 | Vite 會自動換 port；以終端機顯示的網址為準 |
| 檔案樹是空的 | VS Code 要開 `ai-project-foundation-kit` 這一層 |
| 改了 `data.js` 畫面沒變 | 確認有存檔、dev server 還在跑；不行就重新整理 |
| `git switch -c` 失敗 | 可能已經有同名分支；換老師指定分支名 |
| `git commit` 說要設定 email | 照終端機提示設定 `user.name` / `user.email` |
| AI 一開始就改檔 | 停下來，先看 `git status`；不確定就舉手 |

原則：任何一步卡超過 5 分鐘，先舉手，用保底方案跟上進度。
