# U2 · 需求拆解工作紙

> 先拆需求，再叫 AI 寫。你拆不清楚，AI 寫得再快也很難驗收。

## 0. 先觀察畫面

打開「倉儲後台」，勾選你看到了哪些區塊：

- [ ] KPI：商品貨號、開放訂單、LINE OA、風險金額
- [ ] 異常警示燈
- [ ] 問題明細面板
- [ ] 處理佇列
- [ ] 訂單資料表
- [ ] 庫存資料表

## 1. 原始需求

請把老師給的需求抄下來：

```text
倉儲後台要看得出目前有哪些 LINE OA 訂單尚未出貨，
讓客服可以先確認收件人與 ETA。
```

## 2. 拆資料

資料在哪裡？

```text
web-lab/src/warehouseData.js
```

今天會讀哪一個陣列？

```text
orders
```

會用到哪些欄位？

| 欄位 | 我看得懂它代表什麼嗎 |
|---|---|
| `id` | |
| `customer` | |
| `channel` | |
| `status` | |
| `eta` | |
| `amount` | |

## 3. 拆規則

把需求翻成一條判斷式：

```text
找出 channel 是 LINE OA，且 status 不是 已出貨 的訂單。
```

用 JavaScript 寫成：

```js
order.channel === 'LINE OA' && order.status !== '已出貨'
```

## 4. 拆畫面

這條規則完成後，應該影響哪三個畫面？

| 畫面位置 | 應該看到什麼 |
|---|---|
| KPI | `LINE OA` 從 0 變成實際筆數 |
| 問題明細 | 點 `LINE OA 待確認` 會看到訂單編號、客戶、ETA、金額 |
| 處理佇列 | 出現 `LINE OA 訂單需要客服確認` |

## 5. 拆測試

今天不寫大型測試框架，但要有最低限度的證明：

- [ ] 測試腳本 `node scripts/check-warehouse-logic.mjs` 通過
- [ ] 畫面三個位置都有變
- [ ] 原本缺貨與主管確認提醒沒有壞掉
- [ ] `npm run build` 通過
- [ ] `git diff` 只看到 C2 允許範圍

## 6. 給 AI 前的最後整理

把你的拆解濃縮成這段：

```text
我要完成 getPendingLineOrders(orderItems)。
資料來源是 orders。
規則是 channel === 'LINE OA' 且 status !== '已出貨'。
它會影響 KPI、LINE OA 待確認明細、action queue。
限制是只改 warehouseLogic.js，不改 UI、不改資料、不新增套件。
驗收要跑測試腳本、看畫面、看 diff、跑 build。
```

完成後再進 [`STEP-03-plan-implement.md`](./STEP-03-plan-implement.md)。
