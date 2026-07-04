# ai-project-foundation-kit

這是 M11/U11「**AI 驅動開發流程與平台整合**」模組的練習專案。海風小店只是載體，你真正要學會的是一條**可重複的交付流程**：用 AI coding agent 在護欄內改程式，接到 LINE OA、GitHub Actions、CrewAI-style agents、Skill/MCP 等平台場景。

整門課只做一個作品：

> **倉儲營運 Dashboard + LINE OA Flex 推播 + ops agent 自動化** ——
> 資料合約驅動畫面與通知 payload，通過人工審核、ReAct 修錯、reviewer、build、GitHub Actions、Skill/MCP 完成交付。

主線（一條線走到底）：

```text
資料進來 → 檢查資料 → 資料合約 → AI coding agent 改功能
       → Dashboard 呈現 → LINE Flex 推播 → ops agent 自動化
       → GitHub Actions → reviewer 驗收 → build / commit / push
```

**學生從這裡開始：[`START-HERE.md`](./START-HERE.md)**（含一鍵啟動、DoD、四堂地圖）。

## 資料夾

```text
ai-project-foundation-kit/
  START-HERE.md      # 學生入口:主線圖 + DoD + 一鍵啟動
  start-m11.bat      # Windows 一鍵啟動(裝套件 + 開瀏覽器)
  start-m11.command  # macOS 一鍵啟動
  U1/ U2/ U3/ U4/    # 每堂:STEP-*.md / PROMPT-CARD.md / ACCEPTANCE.md / PITFALL.md
  web-lab/           # 作品本體:海風小店首頁 + 營運異常 Dashboard
  data-lab/          # report.json:唯一資料來源(資料合約)
  line-lab/          # LINE OA Flex 通知腳本(mock 優先,真送雙重確認)
  ops-agent-lab/     # CrewAI-style 角色流程:庫存檢查 → 決策 → 推播文案
  .github/workflows/ # GitHub Actions:定時產生 report 與 Flex payload
  prompts/           # 固定 prompt 卡完整版(01–07)
  .claude/           # Claude Code commands / skills 範例
  .mcp.json          # MCP 設定範例
```

## 完成的定義（DoD）

> AI 做出來不算完成。通過驗收才算完成。
> 驗收包含：**畫面 ／ 輸出 ／ diff ／ build ／ human review**。

## 主線核心：一份資料合約，兩道防線

`data-lab/report.json` 是唯一資料來源，欄位固定：

```text
report_date / risk_level / total_revenue / anomaly_count / top_product / top_channel / action_items
```

`risk_level` 只能是 `low / medium / high`。同一份合約有兩個消費者、兩道防線：

| 消費者 | 檔案 | 防線行為 |
|---|---|---|
| 畫面 | `web-lab/src/Dashboard.jsx`（經 `reportContract.js`） | 合約沒過 → 紅色擋牌，payload／mock／真送指令全部消失 |
| 通知 | `line-lab/sendLineAlert.js --flex` | 合約沒過 → 送出前阻擋並提示資料合約錯誤 |
| 自動化 | `ops-agent-lab/run_ops_check.py` | 角色流程產出同一份 `report.json`，下游不換格式 |

`web-lab/src/reportContract.js` 與 `line-lab/sendLineAlert.js` 是**雙胞胎**：檢查規則與錯誤訊息逐字相同，改一邊必須同步另一邊。

## web-lab：作品本體

```bash
cd web-lab
npm install
npm run dev     # http://localhost:5180
npm run build
```

- 「海風小店」首頁：U1/U2 的練習範圍（`src/data.js` 管文字）。
- 「營運異常 Dashboard」：U2–U4 主戰場，button-first 流程 —— 載入範例 → 檢查資料合約 → Flex payload 預覽 → 人工審核 checkbox → mock 送出 → 勾選後才顯示可複製的真送指令 → reviewer checklist。
- Dashboard 直接 import `data-lab/report.json`（dev server 已設 `fs.allow`），**前端不存第二份資料、沒有任何 token、永遠不呼叫 api.line.me**。

## line-lab：LINE 通知（mock 優先）

```bash
node line-lab/sendLineAlert.js --flex     # mock:產 Flex payload,不發送
node line-lab/sendLineAlert.js            # text fallback
```

腳本會：讀 `data-lab/report.json` → 驗證資料合約 → 產生 payload 寫入 `line-lab/line-flex-payload.json` → 預設 mock。真送需要**兩道**確認：

```bash
LINE_REAL_SEND=1 node line-lab/sendLineAlert.js --flex             # 沒 --confirm → [blocked]
LINE_REAL_SEND=1 node line-lab/sendLineAlert.js --flex --confirm   # 才會真送
```

PowerShell：`$env:LINE_REAL_SEND="1"; node line-lab/sendLineAlert.js --flex --confirm`

## ops-agent-lab：CrewAI-style 自動化

```bash
python ops-agent-lab/run_ops_check.py
python ops-agent-lab/run_ops_check.py --write-report
node line-lab/sendLineAlert.js --flex
```

`ops-agent-lab/run_ops_check.py` 用三個角色模擬 CrewAI 工作流：`data_checker` 讀庫存、`ops_decider` 判斷風險、`push_writer` 產出補貨通知。它仍然輸出同一份 `data-lab/report.json`，所以 U3 的 Dashboard 與 LINE Flex 腳本不用重寫。

`.github/workflows/u11-ops-check.yml` 會在 GitHub Actions 裡跑同一段流程，產出 `report.json` 與 `line-flex-payload.json` artifact，示範「平台排程 + 人審後再真送」。

### LINE OA 真送前置（老師示範／進階組；主線到 mock 為止）

1. 登入 LINE Developers Console，未登入會進 LINE Business ID。
2. 先建立 LINE Official Account。
3. 在 LINE Official Account Manager 啟用 Messaging API。
4. 回 Developers Console 的 Messaging API channel 取得 channel access token。
5. 從 Basic settings 的 `Your user ID` 或 webhook event 取得 target userId。
6. 填入 `line-lab/.env`，人工審核後才用 `--flex --confirm` 真送。

## 安全規則

- 預設 mock 模式，不真的發送 LINE；真送只在終端機發生，網頁不會幫你送。
- 只有 `LINE_REAL_SEND=1` 且加上 `--flex --confirm` 才允許呼叫 LINE API。
- token 不可寫死在程式碼，不可放前端，不可 commit `.env`。
- 不新增 npm 套件，不修改 `package.json`。
- API 失敗時要看 status code 與 response body。

## 老師側教材

教案、驗收清單、prompt 卡、講義在 [`../m11-materials/`](../m11-materials/)。學生日常操作以本資料夾的 `U1/`–`U4/` 為準。

## 需要的工具

- Node.js 18+：跑 web-lab 與 line-lab
- Claude Code 或 Codex：讀專案、改檔、跑指令、看 diff、debug
