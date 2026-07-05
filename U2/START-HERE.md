# U2 · START HERE ｜今天照這條路走

這堂課只做一個小功能，但要走完整開發流程。

你不是來背 prompt。你要練的是：看懂專案、拆需求、叫 AI 先規劃、審核後才讓它改檔，最後用測試、畫面、diff、build 證明結果真的成立。

## 0. 今天會完成什麼

倉儲後台已經接好畫面，但老師留了一個程式洞：

```text
web-lab/src/warehouseLogic.js
getPendingLineOrders(orderItems)
```

你要讓它找出：

```js
order.channel === 'LINE OA' && order.status !== '已出貨'
```

完成後，同一條規則會影響三個地方：

- KPI 的 `LINE OA`
- `LINE OA 待確認` 明細
- 處理佇列裡的客服確認提醒

## 1. 先把專案跑起來

在 VS Code 打開整個 `ai-project-foundation-kit` 資料夾。

Terminal 執行：

```bash
cd web-lab
npm install
npm run dev
```

打開畫面後，先看兩個分頁：

- `倉儲後台`
- `訂單可視化`

這一步只看現況，不要改檔。

## 2. 先跑一次失敗測試

另開一個 Terminal：

```bash
cd web-lab
node scripts/check-warehouse-logic.mjs
```

現在失敗是正常的，因為 C2-HOLE 還沒完成。

這一步要讓你知道：今天不是「AI 說完成」就算完成，而是要讓測試從紅色變綠色。

## 3. 只讀這幾個檔案

先看規則：

- `AGENTS.md`
- `CLAUDE.md`

再看資料和程式洞：

- `web-lab/src/warehouseData.js`
- `web-lab/src/warehouseLogic.js`

今天主線只允許改：

```text
web-lab/src/warehouseLogic.js
```

不要改：

- `WarehouseAdmin.jsx`
- `styles.css`
- `warehouseData.js`
- `line-lab`
- `.env`
- `package.json`

## 4. 先拆需求，再貼 planner

先完成：

```text
U2/WORKSHEET-requirement-breakdown.md
```

你要能說出：

- 資料來源是哪裡
- 判斷規則是什麼
- 會影響哪些畫面
- 怎麼驗收

完成後，打開：

```text
U2/PROMPT-CARD.md
```

先貼 `卡 1｜planner`。

planner 階段只能規劃，不能改檔。

## 5. 人審通過，才進 implementer

planner 回覆後，先檢查：

- 是否只改 `warehouseLogic.js`
- 是否沒有碰 LINE API、token、webhook
- 是否有提到 `channel` 和 `status`
- 是否有測試、畫面、diff、build 驗收

通過後才貼：

```text
卡 2｜implementer
```

## 6. 改完立刻驗收

執行：

```bash
cd web-lab
node scripts/check-warehouse-logic.mjs
npm run build
```

再看 diff：

```bash
cd ..
git diff -- web-lab/src/warehouseLogic.js
git status
```

畫面也要確認：

- KPI `LINE OA` 不是 0
- 點 `LINE OA 待確認` 看得到訂單
- 處理佇列出現客服確認提醒

## 7. reviewer 收尾

貼：

```text
卡 3｜reviewer
```

reviewer 不是叫 AI 稱讚你，而是讓它檢查：

- 範圍有沒有超出
- 測試與 build 是否通過
- diff 是否乾淨
- 有沒有誤碰 C3 的 LINE 真送內容

## 8. 最後才 commit

```bash
git add web-lab/src/warehouseLogic.js
git commit -m "完成待確認訂單判斷規則"
```

如果你不知道下一步，回到這份檔案，照順序往下做。
