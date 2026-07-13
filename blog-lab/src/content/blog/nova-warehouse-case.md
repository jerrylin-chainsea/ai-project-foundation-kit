---
title: 我如何用 AI coding agent 接手並交付 BOBA TIDE 備料控制台
date: 2026-07-05
summary: 從需求拆解、備料控制台規則、LINE Flex mock、DevTools 驗收到 GitHub Pages 部署，整理一個可對企業說明的技術案例。
---

## 1. 問題背景

BOBA TIDE 的營運人員需要快速知道三件事：

- 哪些原料低於安全庫存。
- 哪些訂單因缺料或高優先級需要處理。
- 哪些 LINE OA 訂單尚未出餐，需要客服確認。

這不是單純做一個漂亮頁面，而是要把資料、規則、畫面與驗收串起來。

## 2. 我如何拆需求

我把企業題目拆成四個層次：

| 層次 | 拆解結果 |
|---|---|
| 資料 | orders、report、Flex payload |
| 規則 | 低庫存、缺料阻塞、LINE OA 未出餐 |
| 畫面 | 備料控制台、訂單看板、LINE 推播中心 |
| 驗收 | build、mock response、DevTools Network、git diff |

## 3. 我改了什麼功能

在 C2，我透過 Plan Mode 先要求 AI 規劃，再只修改 `web-lab/src/shopLogic.js`。目標是新增一條 action queue 規則：

```text
如果存在 LINE OA 通路且尚未出餐的訂單，action queue 要顯示客服確認提醒。
```

這段不能手寫數字，必須從 `orderItems` 算出來。

## 4. API 與 LINE Flex 邊界

C3 的重點不是把 LINE 真的送出去，而是看懂平台邊界：

```text
Browser / React
  → POST /api/send-line-flex
  → 本機後端讀 .env
  → LINE sender script
  → mock result 或 LINE API
```

token 不能出現在前端，也不能 commit。課堂主線使用 mock，看到 `[mock] LINE_REAL_SEND is not 1, no request sent.` 就代表流程通過。

## 5. 驗收證據

請把你的截圖補在這裡：

- BOBA TIDE 首頁。
- 備料控制台 action queue。
- 訂單看板。
- LINE Flex preview。
- DevTools Network 的 `/api/send-line-flex`。
- `npm run build` 成功。
- GitHub Actions 或 GitHub Pages 部署成功。

## 6. AI 工作流

我使用的 AI coding agent 流程：

1. `AGENTS.md` / `CLAUDE.md` 限制 AI 的工作邊界。
2. Plan Mode 先規劃，不直接改。
3. implementer 只改允許檔案。
4. reviewer 檢查 diff、build、資料合約與平台安全。
5. MCP / DevTools 輔助驗收畫面與 Network。

## 7. 下一步

如果要接真實企業題目，我會先確認：

- 真實資料欄位是否和目前範例一致。
- LINE OA token 與 target ID 由誰管理。
- webhook 是否需要後端服務或 n8n。
- 哪些推播必須人工審核，哪些可以自動化。
- 部署平台是否只需要靜態站，或需要 server runtime。
