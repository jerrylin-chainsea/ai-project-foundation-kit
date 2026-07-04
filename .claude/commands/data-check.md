---
description: 看一份資料，一律輸出固定四欄(insight / anomalies / risk_level / action_items)
argument-hint: [資料檔路徑或貼上內容，預設 data-lab/data/sales.csv]
---

請檢查這份資料（沒指定就用 `data-lab/data/sales.csv`）：$ARGUMENTS

請**只輸出固定四欄**，格式每次都一樣：

```
insight:        一句話的關鍵發現
anomalies:      [ 看起來怪、需要人確認的列，附原因 ]
risk_level:     low / medium / high（只能這三個值）
action_items:   [ 具體、可以馬上做的建議 ]
```

規則：
1. 有負數、過大數字、缺漏，一律列進 anomalies 並說原因
2. 資料不足就不要硬給結論
3. 沒有資料依據的建議，標成「不可採用」
4. risk_level **只能**是 low、medium、high（不要翻成中文、不要其他字）
