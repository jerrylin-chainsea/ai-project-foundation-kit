# U2 · STEP 03 ｜planner → 人審 → implementer

> 不要一開始就叫 AI 寫程式。先讓 AI 規劃，再由人審核，最後才准它改檔。

## 1. 進入 planner

打開 [`PROMPT-CARD.md`](./PROMPT-CARD.md)，複製「卡 1｜planner」貼給 Claude Code 或 Codex。

planner 的任務是：

- 讀 `AGENTS.md`
- 讀 `CLAUDE.md`
- 讀 `warehouseData.js`
- 讀 `warehouseLogic.js`
- 讀倉儲後台如何使用 `getPendingLineOrders`
- 回覆 A-F 計畫
- 不改檔

## 2. 人審 A-F 計畫

AI 回覆後，先不要急著按同意。用這張表審：

| 檢查 | 通過標準 |
|---|---|
| A. 修改檔案 | 主要只修改 `web-lab/src/warehouseLogic.js` |
| B. 修改內容 | 只完成 `getPendingLineOrders(orderItems)` |
| C. 資料欄位 | 有提到 `channel`、`status` |
| D. 影響畫面 | 有提到 KPI、LINE OA 明細、action queue |
| E. 風險 | 有提到不要改 UI、不要改資料、不要新增套件 |
| F. 人類拍板 | 有說要人審後才實作 |

如果它想改 `WarehouseAdmin.jsx`、`styles.css`、`package.json`、`line-lab`，先不要放行。

## 3. 進入 implementer

人審通過後，複製「卡 2｜implementer」。

AI 應該把 `getPendingLineOrders` 改成類似：

```js
export function getPendingLineOrders(orderItems) {
  return orderItems.filter(
    (order) => order.channel === 'LINE OA' && order.status !== '已出貨',
  );
}
```

重點不是背這段，而是知道這段在做三件事：

1. 從 `orderItems` 讀資料
2. 找出 LINE OA 訂單
3. 排除已出貨訂單

## 4. 改完先不要 commit

先跑：

```bash
git status
git diff -- web-lab/src/warehouseLogic.js
```

你要看到：

- 沒有新增套件
- 沒有改 `package.json`
- 沒有改 `warehouseData.js`
- 沒有改 LINE API 或 token
- 主要修改集中在 `getPendingLineOrders`

下一步：[`STEP-04-test-review.md`](./STEP-04-test-review.md)。
