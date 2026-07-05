# U2 · STEP 01 ｜ 先讀守則：AGENTS.md、CLAUDE.md、Plan Mode

> **這堂完成物**：看得懂 AI 工作守則，會要求 AI 先規劃，再做一個倉儲後台小範圍修改。

## 1. 打開後台頁

啟動專案後，點上方「**倉儲後台**」。

你應該看到：

- SKU 總數
- 低庫存 SKU
- 開放訂單
- 風險金額
- 今日優先處理 action queue
- 區域水位、低庫存明細、庫存資料表

這是 C2 的主戰場，不是 C3 的 LINE 推播中心。

## 2. 打開 AI 守則

打開專案根目錄：

```text
AGENTS.md
CLAUDE.md
```

你只要先記住三件事：

1. AI 先讀、先計畫，不是一開始就改。
2. 每堂課有允許修改的檔案清單。
3. 完成要看畫面、輸出、diff、build、human review。

## 3. 本堂允許檔案

```text
web-lab/src/WarehouseAdmin.jsx
web-lab/src/warehouseLogic.js
web-lab/src/styles.css（只准改倉儲後台相關樣式）
```

本堂通常只需要改 `warehouseLogic.js`。其他檔案除非計畫講清楚，否則不要放行。

## 4. 今天要改哪裡

打開 `web-lab/src/warehouseLogic.js`，找到這行：

```js
// C2-HOLE: 課堂要在這裡新增第三條規則。
// 目標：從 orderItems 找出 channel === 'LINE OA' 且 status !== '已出貨' 的訂單。
// 驗收：action queue 出現「LINE OA 訂單需要客服確認」，而且數字必須由資料算出來。
```

這就是老師預留的挖洞點。你不是從零寫後台，而是在已經能運作的系統裡補一條規則。

→ 下一步：`STEP-02-workflow.md`，用 planner → 人審 → implementer → reviewer 走完整開發流程。
