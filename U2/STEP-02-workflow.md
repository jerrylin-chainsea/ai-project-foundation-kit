# U2 · STEP 02 ｜ planner → 人審 → implementer → reviewer

> 你要練的是「管理 AI 做小範圍程式修改」，不是讓 AI 自由發揮。

## 1. 今日任務

在「倉儲後台」的 action queue 裡新增一條規則：

> 如果目前有 **LINE OA 通路且尚未出貨** 的訂單，action queue 要多顯示一條「客服需要確認 LINE OA 訂單」。

建議顯示內容：

```text
title: LINE OA 訂單需要客服確認
detail: 目前有 N 筆 LINE OA 訂單尚未出貨，請先確認收件人與 ETA
level: warning
```

## 2. 先進 Plan Mode

貼 `PROMPT-CARD.md` 的 planner 卡。AI 只能回 A-F 計畫，不能改檔。

你要檢查四件事：

1. 它是否只打算改允許檔案？
2. 它是否沒有新增套件？
3. 它是否沒有改 `package.json`？
4. 它是否沒有重構整個後台？

四題都安全，才放行 implementer。

## 3. 放行實作

貼 implementer 卡。完成後檢查：

```bash
git status
git diff -- web-lab/src/warehouseLogic.js
cd web-lab
npm run build
```

完成後，`C2-HOLE` 附近應該出現這種邏輯：

```js
const pendingLineOrders = orderItems.filter(
  (order) => order.channel === 'LINE OA' && order.status !== '已出貨',
);

if (pendingLineOrders.length > 0) {
  actions.push({
    level: 'warning',
    title: 'LINE OA 訂單需要客服確認',
    detail: `目前有 ${pendingLineOrders.length} 筆 LINE OA 訂單尚未出貨，請先確認收件人與 ETA`,
  });
}
```

重點不是背這段，而是確認它真的從 `orderItems` 算出來，不是手寫「3 筆」。

畫面驗收：

1. 回到「倉儲後台」。
2. action queue 裡看到「LINE OA 訂單需要客服確認」。
3. 原本的低庫存與缺料訂單提醒仍在。

## 4. reviewer

貼 reviewer 卡，要求 AI 用 Pass/Block 回報。

人審重點：

- diff 是否只動 `warehouseLogic.js`
- 新規則是否讀 `orderItems`，不是手寫假資料
- build 是否通過
- C3 的「訂單可視化」與「LINE 推播中心」沒有被改壞

## 5. commit

```bash
git add web-lab/src/warehouseLogic.js
git commit -m "新增 LINE OA 訂單客服確認規則"
```

收束：AI 做出來不算完成，畫面、diff、build、reviewer 都過才算。

→ C2 主線到這裡就完成了，可以直接去 [`ACCEPTANCE.md`](./ACCEPTANCE.md) 對照驗收。時間還有的話，[`STEP-03-subagent.md`](./STEP-03-subagent.md) 是加映（把 planner/reviewer prompt 存成 sub-agent + 裝 Claude HUD），跳過也不影響過關。
