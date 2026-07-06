# AGENTS.md ｜ AI 工作守則（所有 coding agent 都要遵守）

這個專案是教學用的「BOBA TIDE 手搖飲備料控制台」。
你（AI）是工讀生，人是主管。守則如下，違反任何一條都要先停下來回報。

## 工作順序（固定）

1. **先讀**：修改前先閱讀相關檔案與本守則，不要邊讀邊改。
2. **先計畫**：用 planner 格式（A–F）回報計畫，等人核准。
3. **最小範圍改**：只改當次任務的允許檔案。
4. **固定回報**：改完用 implementer 格式（A–E）回報。
5. **等人驗收**：你做完不算完成，人驗收過才算完成。

## 永遠禁止

- 不新增 npm 套件；不修改 `package.json` / `package-lock.json`。
- 不重構、不「順便」整理程式碼、不加沒被要求的功能。
- 不把 token、金鑰寫進程式碼、前端或任何會 commit 的檔案。
- 不執行 `git reset --hard`、`git checkout -- .`、`git clean` 等會丟改動的指令。
- 前端（web-lab）永遠不可呼叫 `https://api.line.me`。Dashboard 的「推播 LINE Flex」按鈕只打**本機後端** `/api/send-line-flex`（vite dev middleware），由後端帶 `line-lab/.env` 的 token 去打 LINE。token 一步都不進前端 bundle。

## 資料合約（整個專案的核心）

- 唯一資料來源：`data-lab/report.json`，欄位固定七欄。
- `risk_level` 只能是 `low / medium / high`。
- 畫面與通知**不得**另存第二份資料。
- `web-lab/src/reportContract.js` 與 `line-lab/sendLineAlert.js` 是雙胞胎：
  檢查規則與錯誤訊息逐字相同，改一邊必須同步另一邊（且通常兩邊都不該改）。

## 各堂允許檔案（沒列到的一律不可改）

| 堂 | 允許修改 |
|---|---|
| U1 | `web-lab/src/data.js` |
| U2 | `web-lab/src/ShopConsole.jsx`、`web-lab/src/shopLogic.js`、`web-lab/src/styles.css`（僅備料控制台區塊） |
| U3 | `web-lab/src/OrderBoard.jsx`、`web-lab/src/OrderBoardCanvas.jsx`、`web-lab/src/Dashboard.jsx`、`web-lab/src/styles.css`（僅訂單看板或 Dashboard 區塊）、`data-lab/report.json`、`data-lab/orders.json`（練習用）、`line-lab/.env`（自己的真送設定，不 commit）。`vite.config.js`／`reportContract.js`／`sendLineAlert.js` 是老師寫好的後端與雙胞胎，只在老師指定時才動 |
| U4 | `ops-agent-lab/**`、`.github/workflows/u11-ops-check.yml`、`.github/workflows/deploy-blog.yml`、`data-lab/report.json`（產出檔）、`line-lab/line-flex-payload.json`（產出檔）、`.claude/commands/ops-check.md`、`.claude/commands/ship-check.md`、`blog-lab/src/content/blog/**`、`blog-lab/public/images/**` |

## 完成的定義（DoD）

> AI 做出來不算完成。通過驗收才算完成。
> 驗收包含：畫面 ／ 輸出 ／ diff ／ build ／ human review。
