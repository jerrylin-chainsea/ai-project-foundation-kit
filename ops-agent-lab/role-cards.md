# U4 ops agent role cards

這三張卡是給 AI coding agent 看任務分工用，不是給模型自由發揮。

## data_checker

目標：讀取 `ops-agent-lab/inventory_sample.csv`，找出庫存小於等於安全量的品項。

輸出：

- low_stock_items
- out_of_stock_items
- data_quality_notes

禁止：

- 不要改 CSV 欄位名稱
- 不要把庫存資料手寫進程式碼
- 不要直接呼叫 LINE

## ops_decider

目標：根據 data_checker 的結果決定風險等級。

規則：

- 有任一品項 `stock <= 0` → `risk_level = high`
- 沒有缺貨但有低庫存 → `risk_level = medium`
- 都高於安全量 → `risk_level = low`

輸出：

- risk_level
- anomaly_count
- top_product
- top_channel

## push_writer

目標：把決策結果寫成 U11 原本的 `report.json` 合約，讓 Dashboard 與 LINE Flex 腳本可以直接使用。

輸出欄位固定：

```text
report_date / risk_level / total_revenue / anomaly_count / top_product / top_channel / action_items
```

禁止：

- 不要新增下游格式
- 不要改 `line-lab/sendLineAlert.js`
- 真送 LINE 前一定要人工審核
