# U2 ｜受控 Vibe Coding：用 AGENTS、CLAUDE、Plan Mode 完成倉儲後台

> 這堂不是 prompt 課。這堂是教學生把 AI coding agent 變成可控的開發夥伴：先讀專案守則，先規劃，再小範圍開發，最後用測試、畫面、diff、build 驗收。

教師導讀請先看 [`TEACHER-GUIDE.md`](./TEACHER-GUIDE.md)。
簡報截圖與備課畫面請看 [`SCREENSHOT-GUIDE.md`](./SCREENSHOT-GUIDE.md)。

## C2 的一句話目標

用 `AGENTS.md`、`CLAUDE.md`、Plan Mode 和 reviewer，把一個倉儲後台需求拆成資料、規則、畫面、測試與驗收，最後完成 `getPendingLineOrders(orderItems)` 這個挖洞任務。

## 先講清楚：什麼是 vibe coding

Vibe coding 指的是：你用自然語言描述需求，讓 AI coding agent 幫你讀專案、改檔案、跑指令、回報結果。

它很快，但如果沒有規則，很容易變成「AI 覺得可以」而不是「工程上可交付」。所以 C2 不是要學生學會多貼幾句 prompt，而是把 vibe coding 加上工程控制：先看專案、先讀守則、先出計畫、人審後再開發，最後用測試、畫面、diff、build 驗收。

## 學生會學到什麼

- 受控 vibe coding：不是叫 AI 隨便做，而是用規則、計畫、diff、build 控制每一輪修改。
- `AGENTS.md`：寫給所有 coding agent 的專案守則。
- `CLAUDE.md`：Claude Code 專用補充，通常引用或對齊 `AGENTS.md`。
- Plan Mode：先讀檔、先提出計畫，未經人審不改檔。
- 需求拆解：把一句話需求拆成資料欄位、業務規則、畫面位置、驗收方式。
- 測試與驗證：用測試腳本、畫面檢查、`git diff`、`npm run build` 證明改動真的成立。
- 部署概念：理解 source code、build、`dist/`、preview、public deploy 的差別；C2 不做完整部署自動化。

## 4 小時節奏

| 時間 | 主題 | 學生產出 |
|---|---|---|
| 0:00-0:25 | C1 到 C2：為什麼需要受控 vibe coding | 能說出「AI 幫忙寫」和「可交付開發流程」的差別 |
| 0:25-0:55 | `AGENTS.md`、`CLAUDE.md`、Plan Mode | 知道 AI 允許改哪裡、不允許改哪裡 |
| 0:55-1:30 | 倉儲後台導讀與需求拆解 | 完成需求拆解工作紙 |
| 1:30-2:15 | planner → 人審 | 拿到 A-F 計畫，並能判斷是否可放行 |
| 2:15-2:55 | implementer 小範圍實作 | 完成 `getPendingLineOrders(orderItems)` |
| 2:55-3:30 | 測試、畫面驗收、diff | 測試腳本通過、畫面三處連動、diff 範圍乾淨 |
| 3:30-3:50 | build / preview / 部署概念 | 知道 `npm run build`、`dist/`、`npm run preview` 各自代表什麼 |
| 3:50-4:00 | reviewer、commit、銜接 C3 | reviewer PASS，完成可交付 commit |

## 講義順序

| 順序 | 檔案 | 目的 |
|---|---|---|
| 0 | [`STEP-00-what-are-we-building.md`](./STEP-00-what-are-we-building.md) | 先建立 C2 的課程入口：這堂到底在訓練什麼能力 |
| 1 | [`STEP-01-controlled-vibe-coding.md`](./STEP-01-controlled-vibe-coding.md) | 把 vibe coding 從「憑感覺叫 AI 做」改成受控流程 |
| 2 | [`STEP-02-data-contract.md`](./STEP-02-data-contract.md) | 讀倉儲後台、訂單資料表、庫存資料表與 C2 挖洞點 |
| 3 | [`WORKSHEET-requirement-breakdown.md`](./WORKSHEET-requirement-breakdown.md) | 學生自己把需求拆成資料、規則、畫面、驗收 |
| 4 | [`STEP-03-plan-implement.md`](./STEP-03-plan-implement.md) | 用 planner → 人審 → implementer 完成最小修改 |
| 5 | [`STEP-04-test-review.md`](./STEP-04-test-review.md) | 用測試腳本、畫面、diff、build、reviewer 驗收 |
| 6 | [`STEP-05-deploy-concept.md`](./STEP-05-deploy-concept.md) | 補部署概念：build、dist、preview、public deploy 的差別 |
| 7 | [`PROMPT-CARD.md`](./PROMPT-CARD.md) | 可直接貼給 agent 的 planner / implementer / reviewer 卡 |
| 8 | [`ACCEPTANCE.md`](./ACCEPTANCE.md) | C2 完成定義 |
| 9 | [`PITFALL.md`](./PITFALL.md) | 卡住時的保底處理 |

## 本堂實作目標

倉儲後台已經有四個區塊：

1. KPI：包含 `LINE OA`
2. 異常警示燈：包含 `LINE OA 待確認`
3. 問題明細：可顯示待確認訂單
4. 處理佇列：顯示下一步 action

目前老師預留的挖洞點是：

```js
getPendingLineOrders(orderItems)
```

學生要完成的規則：

```js
order.channel === 'LINE OA' && order.status !== '已出貨'
```

完成後，同一條規則要同時影響 KPI、明細清單、action queue。這就是 C2 要學生真正理解的事情：一個小 helper 不是「改一行 code」，而是把資料、規則、畫面與驗收串起來。
