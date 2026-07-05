# U2 · STEP 04 ｜測試、畫面驗收、reviewer

> AI 說完成不算完成。你能用測試、畫面、diff、build 證明它完成，才算完成。

## 1. 先跑 smoke test

C2 提供一個不需要新套件的測試腳本：

```bash
cd web-lab
node scripts/check-warehouse-logic.mjs
```

如果你還沒完成 `getPendingLineOrders`，它會失敗。完成後應該看到類似：

```text
[pass] C2 warehouse logic smoke test passed.
```

這個測試在檢查：

- `getPendingLineOrders(orders)` 是否回傳 LINE OA 且尚未出貨的訂單
- KPI 的 `linePendingCount` 是否跟資料一致
- action queue 是否出現「LINE OA 訂單需要客服確認」
- 原本的補貨與主管確認提醒是否沒有被改壞

## 2. 再看畫面

```bash
npm run dev
```

回到「倉儲後台」，檢查三個位置：

1. KPI `LINE OA` 不是 0
2. 點 `LINE OA 待確認`，明細出現訂單
3. 處理佇列出現 `LINE OA 訂單需要客服確認`

這三個地方要由同一條 `getPendingLineOrders` 規則帶動，不能各自寫死。

## 3. 跑 build

```bash
npm run build
```

`build` 通過代表：

- JavaScript 沒有語法錯
- React/Vite 可以把專案打包成可部署檔案
- 沒有明顯破壞 C3 會接的前端專案

它不是完整測試，但它是前端專案交付前的最低門檻。

## 4. 看 diff

回到專案根目錄：

```bash
cd ..
git diff -- web-lab/src/warehouseLogic.js
git diff -- package.json
git status
```

驗收重點：

- `warehouseLogic.js` 只改 C2 挖洞點
- `package.json` 沒有變動
- 沒有新增不必要檔案
- diff 看得懂，不是整個檔案被重寫

## 5. reviewer

複製 [`PROMPT-CARD.md`](./PROMPT-CARD.md) 的「卡 3｜reviewer」。

reviewer 必須回覆：

- `PASS` 或 `BLOCK`
- 改了哪些檔案
- 是否超出範圍
- 是否從 `orderItems` 判斷，而不是寫死假資料
- smoke test / build 應該怎麼看
- 人類最後還要檢查什麼

如果 reviewer 給 `BLOCK`，不要急著 commit。先把問題貼回 implementer 修正。

## 6. commit

全部通過後：

```bash
git add web-lab/src/warehouseLogic.js
git commit -m "完成 LINE OA 訂單客服確認規則"
```

下一步：[`STEP-05-deploy-concept.md`](./STEP-05-deploy-concept.md)。
