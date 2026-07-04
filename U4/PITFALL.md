# U4 · 卡住了？先看這裡

| 狀況 | 解法 |
|---|---|
| `python` 找不到 | Windows 可試 `py ops-agent-lab/run_ops_check.py`；macOS/Linux 確認已安裝 Python 3 |
| `run_ops_check.py --write-report` 後 Dashboard 數字變了 | 正常。ops agent 產出的是低庫存補貨通知；想回原資料就用 git diff 看清楚再決定是否還原 |
| `node line-lab/sendLineAlert.js --flex` 沒產生檔案 | 先看是不是 `report.json` 合約錯；錯誤訊息會直接印在終端機 |
| GitHub Actions 找不到 workflow | workflow 必須在專案根目錄的 `.github/workflows/u11-ops-check.yml`；如果你把 kit 放進另一個 repo 子資料夾，GitHub 不會自動吃到子資料夾 workflow |
| Actions 沒有手動執行按鈕 | 確認 workflow 已 push 到 GitHub 預設分支或目前分支，並有 `workflow_dispatch` |
| Actions artifact 沒出現 | 先看 Actions log；通常是前面 Python 或 Node 步驟失敗 |
| 擔心 Actions 會真送 LINE | 本 workflow 沒有設定 `LINE_REAL_SEND=1`，所以只會 mock 並產 artifact |
| reviewer 每次都回 PASS，感覺沒在檢查 | 把「目前需求」「允許檔案清單」「workflow 內容」貼進 prompt；再不行就自己看 `git diff` |
| `/ops-check` 或 `/ship-check` 打了沒反應 | 確認檔案路徑是 `.claude/commands/ops-check.md` 或 `.claude/commands/ship-check.md`；保底直接貼 Prompt 卡全文 |
| AI 想把 CrewAI 套件直接裝進主線 | 不放行。主線用 deterministic 版本；真 CrewAI 是進階組，先計畫、再人審 |
| AI 又開始越改越偏 | 貼：「請回到原本任務，這次只處理 X，其他不要改。」 |

> 原則：**C4 是平台化，不是把真送自動化。排程可以自動跑，送出仍要人審。**
