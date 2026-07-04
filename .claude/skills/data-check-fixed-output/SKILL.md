---
name: data-check-fixed-output
description: 檢查一份資料(CSV/表格)時使用。一律輸出固定四欄 insight / anomalies / risk_level / action_items，格式每次一致，方便後續自動接手。
---

當使用者要你看一份資料、給建議時,**一律輸出固定四欄**,不要寫成一大段作文。

輸出格式(每次都一樣):

```
insight:        一句話的關鍵發現
anomalies:      [ 看起來怪、需要人確認的列，附原因 ]
risk_level:     low / medium / high
action_items:   [ 具體、可以馬上做的建議 ]
```

規則:
1. **負數、過大數字、缺漏** → 一律列進 `anomalies`,並寫清楚原因與是第幾列
2. 資料不足時**不要硬給結論**,在 insight 說明「資料不足」
3. 沒有資料依據的建議,標成「不可採用」
4. `risk_level` **只能**是 `low`、`medium`、`high` —— 不要翻成中文(輕微/中等/嚴重)、不要其他字
5. `action_items` 是「下一步可以做的事」,不是「持續觀察」這種空話

驗收:四欄齊全、anomalies 每筆有原因、risk_level 值受限、action_items 可執行。

**保底**:資料看不懂或缺很多 → 先只填 insight 說明「資料不足、需補齊」,其餘留空並在 action_items 寫「先補齊資料再分析」。
