# U2 · Prompt 卡

> 使用方式：先貼 planner，通過人審後才貼 implementer。最後貼 reviewer。不要跳步。

## 卡 1 ｜planner：先規劃，不改檔

```text
你現在扮演 planner。
請先閱讀專案，不要修改任何檔案，不要執行 npm install，不要改 package.json。

請閱讀：
- AGENTS.md
- CLAUDE.md
- web-lab/src/warehouseData.js
- web-lab/src/warehouseLogic.js
- web-lab/src/WarehouseAdmin.jsx

任務：
在 web-lab/src/warehouseLogic.js 的 getPendingLineOrders(orderItems) 完成 LINE OA 客服確認規則。
規則：回傳 channel === 'LINE OA' 且 status !== '已出貨' 的訂單。

這個 helper 會同時影響：
1. KPI：LINE OA
2. 明細：LINE OA 待確認
3. action queue：LINE OA 訂單需要客服確認

限制：
1. 主線只修改 web-lab/src/warehouseLogic.js
2. 不要修改 WarehouseAdmin.jsx；UI 已經接好
3. 不要修改 warehouseData.js；資料已經準備好
4. 不要新增套件
5. 不要修改 package.json
6. 不要接 LINE API、token、webhook

請只用以下格式回答：
A. 你準備修改的檔案
B. 每個檔案各改什麼
C. 會讀哪些資料欄位
D. 這條規則會影響哪三個畫面
E. 驗收方式：測試腳本、畫面、diff、build
F. 可能風險與哪一步需要人類拍板
```

## 卡 2 ｜implementer：照核准計畫做最小修改

```text
你現在扮演 implementer。
請照剛剛已通過的人審計畫做最小修改。

限制：
1. 只修改 web-lab/src/warehouseLogic.js
2. 不要新增套件
3. 不要修改 package.json
4. 不要修改 warehouseData.js
5. 不要修改 WarehouseAdmin.jsx
6. 不要碰 LINE API、token、webhook
7. 如果你認為必須超出限制，先停下來回報，不要自己做

完成後請固定回報：
A. 實際修改的檔案
B. 每個檔案改了什麼
C. 哪裡讀到 LINE OA 訂單資料與狀態
D. 我要怎麼跑測試腳本、看畫面、看 diff、跑 build
E. 哪些地方你沒有改
```

## 卡 3 ｜reviewer：檢查 diff、測試、範圍

```text
你現在扮演 reviewer。
請根據 AGENTS.md、CLAUDE.md、目前需求與 git diff 做檢查。
不要修改檔案，只做 review。

需求：
getPendingLineOrders(orderItems) 要回傳 channel === 'LINE OA' 且 status !== '已出貨' 的訂單。
這條規則要同時影響 KPI、LINE OA 待確認明細、action queue。

請用以下格式回答：
Verdict：PASS 或 BLOCK
Changed Files：實際改了哪些檔
Scope Check：是否超出 web-lab/src/warehouseLogic.js
Package Check：是否修改 package.json / 新增套件
Data Check：是否從 orderItems 判斷，不是手寫假資料
Single Rule Check：KPI、明細、action queue 是否都由 getPendingLineOrders 間接驅動
Test Check：node scripts/check-warehouse-logic.mjs 是否應該通過
Build Check：npm run build 是否應該通過
Regression Risk：最可能壞掉的地方
Human Review：人還要親自看什麼
Next Step：如果 PASS，下一步 commit；如果 BLOCK，列出要修什麼
```

## 卡 4 ｜救援：AI 擴大範圍時

```text
請先停止新增功能。
你剛剛的修改可能超出 C2 範圍。

請檢查：
1. 是否改到 package.json？
2. 是否新增套件？
3. 是否改到 warehouseData.js？
4. 是否改到 WarehouseAdmin.jsx？
5. 是否碰到 LINE API、token、webhook？
6. 是否把 C3 或 C4 的內容提前做了？

請只回覆：
A. 哪些修改應該保留
B. 哪些修改應該移除
C. 如何回到只修改 warehouseLogic.js 的最小版本
D. 回復後要跑哪些驗收
```
