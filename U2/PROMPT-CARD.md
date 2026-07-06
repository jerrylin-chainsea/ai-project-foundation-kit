# U2 · Prompt 卡

## 卡 1 ｜ planner（先計畫，不改檔）

```text
你現在扮演 planner。
先不要改檔，也不要執行寫入動作。

請先閱讀：
- AGENTS.md
- CLAUDE.md
- web-lab/src/ShopConsole.jsx
- web-lab/src/shopLogic.js
- web-lab/src/shopData.js

任務：
在備料控制台 action queue 新增一條規則：
如果目前有 LINE OA 通路且尚未取餐的訂單，action queue 要多顯示「LINE OA 訂單需要主動聯絡客人」。

限制：
1. 只能修改 web-lab/src/shopLogic.js
2. 不要新增套件
3. 不要改 package.json
4. 不要重構
5. 不要手寫假資料，要從 orderItems 判斷

請只用以下格式回答：
A. 你準備修改的檔案
B. 每個檔案各改什麼
C. 會讀哪些資料欄位
D. 驗收方式
E. 可能風險
F. 哪一步需要人類拍板
```

## 卡 2 ｜ implementer（照核准計畫做）

```text
你現在扮演 implementer。
請依照剛剛已核准的計畫實作。

限制：
1. 只能修改 web-lab/src/shopLogic.js
2. 不要新增套件
3. 不要改 package.json
4. 不要重構
5. 如果超出原計畫，先停下來回報

完成後請固定回報：
A. 實際修改的檔案
B. 每個檔案改了什麼
C. 哪裡讀到 LINE OA 訂單資料
D. 我現在要怎麼手動驗收
E. 哪些地方你沒有改
```

## 卡 3 ｜ reviewer

```text
你現在扮演 reviewer。
請根據 AGENTS.md、CLAUDE.md、目前需求與 git diff 做檢查。
不要改檔。

請固定輸出：
Verdict：PASS 或 BLOCK
Changed Files：實際改了哪些檔
Scope Check：是否超出允許範圍
Package Check：是否修改 package.json / 新增套件
Data Check：是否從 orderItems 判斷 LINE OA 訂單，不是手寫假資料
Build Check：我應該跑哪個 build 指令
Regression Risk：最可能壞掉的地方
Human Review：人還要親自看什麼
Next Step：如果 PASS，下一步做什麼；如果 BLOCK，先修什麼
```
