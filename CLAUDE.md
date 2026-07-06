# CLAUDE.md ｜ Claude Code 專用補充

**先讀 `AGENTS.md`**（AI 工作守則），本檔只補充 Claude Code 特有事項。

## 這個專案

教學用「BOBA TIDE 手搖飲備料控制台 + LINE OA Flex 推播 + ops agent 自動化」。
啟動：`cd web-lab && npm run dev`（port 5180）。build：`npm run build`。
推播兩條路，走同一條後端 guard 階梯：
- Dashboard「推播 LINE Flex」按鈕 → 打本機後端 `web-lab/vite.config.js` 的 `/api/send-line-flex`（dev-only）→ `line-lab/sendLineAlert.js` 的 `handlePush`。
- 終端機 `node line-lab/sendLineAlert.js --flex`（預設 mock；真送需 `LINE_REAL_SEND=1` + `--flex --confirm`）。
兩條路的 token 與收件對象都只在 `line-lab/.env`（伺服端），不進前端。兩個推播範本：`report.json`（營運異常）、`orders.json`（訂單資訊）。
ops agent：`python ops-agent-lab/run_ops_check.py --write-report` 會產出同一份 `data-lab/report.json`，再交給 Dashboard 與 LINE Flex 腳本。
Blog：`cd blog-lab && npm run dev` 預覽 Astro 技術紀錄，`npm run build` 驗收，GitHub Pages 由 `.github/workflows/deploy-blog.yml` 部署 `blog-lab/dist`。

## 工作模式

- 收到任務先進 **Plan mode**，用 planner 格式（A–F）回計畫，等人核准才動手。
- 動手時遵守當堂允許檔案清單（見 AGENTS.md），改完用 implementer 格式（A–E）回報。
- 被要求檢查時扮演 reviewer，用 Pass/Block 固定格式（見 `prompts/07-reviewer.md`）。

## 本專案可用的 commands / skills

- `/debug`、`/commit-msg`、`/review-diff`、`/plan-review`、`/data-check`（`.claude/commands/`）
- Skills：`beginner-ai-project-workflow`、`data-check-fixed-output`、`debug-react`、`git-verify`、`review-diff`

## 紅線（重複一次最重要的）

- 不新增套件、不改 `package.json`、不重構。
- token 不進程式碼、不進前端、不 commit；前端永遠不直接打 `api.line.me`（由本機後端代打）。
- `web-lab/src/shopData.js` 是備料控制台與訂單看板的教學資料；U2 通常改 `shopLogic.js`，不是直接亂改資料。
- `data-lab/report.json`（營運異常）與 `data-lab/orders.json`（LINE 訂單範本）各是一份資料合約；`risk_level` 只能是 `low / medium / high`。
- GitHub Actions 主線只產生 artifact，不在 CI 裡真送 LINE。
- Blog 主線只改 `blog-lab/src/content/blog/**` 與 `blog-lab/public/images/**`；不要讓 AI 為了寫文章改 Astro 套件或部署設定。
