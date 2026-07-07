# U4 · 卡住了？先看這裡

| 狀況 | 解法 |
|---|---|
| `python` 找不到 | Windows 可試 `py ops-agent-lab/run_ops_check.py`；macOS/Linux 確認已安裝 Python 3 |
| `run_ops_check.py --write-report` 後 Dashboard 數字變了 | 正常。自動化腳本產出的是低庫存補貨通知；想回原資料就用 git diff 看清楚再決定是否還原 |
| `node line-lab/sendLineAlert.js --flex` 沒產生檔案 | 先看是不是 `report.json` 合約錯；錯誤訊息會直接印在終端機 |
| `/ops-check` 或 `/ship-check` 打了沒反應 | 確認檔案路徑是 `.claude/commands/ops-check.md` 或 `.claude/commands/ship-check.md`；保底直接貼 Prompt 卡全文 |
| `cd blog-lab && npm run dev` 失敗 | 先確認人在 `blog-lab/`，再跑 `npm install`；不要在專案根目錄跑 Astro 指令 |
| `npm install` 後看到 vulnerabilities | 課堂不要跑 `npm audit fix --force`；先完成 build 與部署主線，套件升級由老師統一處理 |
| Astro build 顯示 telemetry 訊息 | 正常提示，不是錯誤；看到 `build Complete` 才是驗收重點 |
| GitHub Pages 頁面 404 | Settings → Pages 的 Source 要選 GitHub Actions；workflow 要成功跑完 |
| 部署後樣式或文章連結壞掉 | 檢查 `blog-lab/astro.config.mjs` 的 `base` 是否對應 GitHub Pages URL；本 starter 在 Actions 會自動用 repo 名稱 |
| 文章看起來很 AI 味 | 加回具體證據：截圖、diff、build、Network、mock response、下一步風險 |
| AI 想直接新增套件 | 不放行。不新增套件是這門課的紅線，先計畫、再人審 |
| AI 又開始越改越偏 | 貼：「請回到原本任務，這次只處理 X，其他不要改。」 |

> 原則：**C4 是把常做的事變成工具，不是把真送自動化。Skill 與 MCP 可以自動跑，送出仍要人審。**
