# U1 · 卡住了？先看這裡

| 狀況 | 解法 |
|---|---|
| 雙擊 `start-m11.bat` 視窗一閃就關 | 先裝 Node.js LTS（https://nodejs.org），裝完重開機再雙擊一次 |
| `npm install` 很久或失敗 | 確認網路；跑 `node -v` 要是 18 以上；仍不行 → 看老師畫面，流程不中斷 |
| 瀏覽器沒自動開 | 自己打開 http://localhost:5180 |
| 埠被占用 | Vite 會自動換埠，用終端機顯示的那個網址 |
| 找不到 Terminal | 選單 `Terminal ▸ New Terminal` |
| 檔案樹是空的 | 重開資料夾，選到 `ai-project-foundation-kit` 這一層 |
| 改了店名畫面沒變 | 確認存檔（分頁圓點消失）、dev server 還在跑；不行就重新整理頁面 |
| `git commit` 說 not a git repository | 先 `git init`，再重跑一次流程 |
| `git commit` 要你設 email | 照它提示的兩行設定後，重下 commit |

> 原則：**任何一步卡超過 5 分鐘，先舉手，用保底方案跟上進度**。這堂的重點是流程，不是排障。
