# U2 · STEP 02 ｜先讀資料：倉儲後台、訂單資料表、C2 挖洞點

> 先讀資料，再讓 AI 寫。你不知道欄位意思，就無法驗收 AI 寫得對不對。

## 1. 啟動專案

```bash
cd web-lab
npm run dev
```

打開本機網址後，切到「倉儲後台」。

你應該看到：

- `NOVA WAREHOUSE 控制台`
- KPI：商品貨號、開放訂單、LINE OA、風險金額
- 異常警示燈：缺貨商品、低庫存商品、需介入訂單、LINE OA 待確認
- 問題明細面板
- 處理佇列
- 訂單資料表
- 庫存資料表

先停 2 分鐘看「訂單資料表」。今天的需求不是老師硬給的，而是從這張表裡的 `channel` 與 `status` 看出來的。

## 2. 讀資料來源

打開：

```text
web-lab/src/warehouseData.js
```

找到 `orders`：

```js
{
  id: 'SO-20260705-021',
  customer: '朗日餐飲集團',
  channel: 'LINE OA',
  status: '待出貨',
  priority: 'medium',
  zone: 'C08',
  amount: 4860,
  eta: '15:10',
}
```

今天會用到的欄位：

| 欄位 | 意思 |
|---|---|
| `id` | 訂單編號 |
| `customer` | 客戶 |
| `channel` | 訂單通路，例如 `LINE OA` |
| `status` | 訂單狀態，例如 `待出貨`、`已出貨` |
| `eta` | 預計處理或出貨時間 |
| `amount` | 訂單金額 |

## 3. 讀畫面如何使用資料

打開：

```text
web-lab/src/WarehouseAdmin.jsx
```

這個檔案是老師預先接好的後台畫面。你今天不是要重寫它，而是要理解它已經會讀：

```js
getPendingLineOrders(orders)
```

所以學生真正要補的是 business rule，不是重做 UI。

## 4. 找到 C2 挖洞點

打開：

```text
web-lab/src/warehouseLogic.js
```

找到：

```js
export function getPendingLineOrders(orderItems) {
  // C2-HOLE: 課堂要在這裡完成 LINE OA 客服確認規則。
  // 目標：回傳 channel === 'LINE OA' 且 status !== '已出貨' 的訂單。
  // 這個 helper 會同時影響 KPI、客服清單、action queue 三個畫面位置。
  return [];
}
```

這就是今天的唯一主線修改點。

## 5. 先看它壞在哪

現在 `return []` 代表沒有任何 LINE OA 待確認訂單，所以：

- KPI `LINE OA` 會是 0
- `LINE OA 待確認` 明細會是空的
- action queue 不會出現 LINE OA 客服確認提醒

完成後，這三個地方要同時變動。

下一步：[`WORKSHEET-requirement-breakdown.md`](./WORKSHEET-requirement-breakdown.md)。
