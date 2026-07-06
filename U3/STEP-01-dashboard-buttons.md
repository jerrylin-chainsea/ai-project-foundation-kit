# U3 · STEP 01 ｜ 訂單看板：資料如何變成畫面

> **這堂完成物**：看懂訂單資料如何驅動畫面，再到 LINE 推播中心走完 Flex mock 流程。

## 1. 先打開「訂單看板」

啟動專案後，點上方「**訂單看板**」。

你應該看到：

- 訂單狀態 3D 動畫
- 訂單流程板：接單、製作、搖製、取餐
- 每筆訂單的狀態、zone、金額、ETA

這一頁的重點不是酷炫動畫本身，而是這件事：

```text
資料欄位 → React component → CSS 狀態樣式 → 畫面
```

## 2. 認識三個前端名詞

| 名詞 | 在這個專案裡看哪裡 |
|---|---|
| component | `web-lab/src/OrderBoard.jsx` 裡的 `OrderLane` |
| CSS | `web-lab/src/styles.css` 裡的 `.order-lane`、`.flow-dot` |
| src | `web-lab/src/`，前端主要程式都在這 |

學生不需要從零寫 React，但要看得懂：資料變了，component 和 CSS 會讓畫面跟著變。

## 3. 看 LINE 用的訂單範本

打開：

```text
data-lab/orders.json
```

這份是 LINE Flex 的訂單範本資料，不是訂單看板頁的完整清單。C3 要教的是：不同下游可以有不同資料合約，但欄位要清楚、驗收要清楚。

## 4. 切到「LINE 推播中心」

點「**LINE 推播中心**」，最上面有推播範本：

- 營運異常
- 訂單資訊

接下來要走：

```text
載入資料 → 檢查資料合約 → Flex 視覺預覽 → 人工審核 → mock 推播
```

→ 下一步：`STEP-02-hitl-review.md`，理解 API、webhook、token 與人工審核。
