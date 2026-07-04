# ops-agent-lab ｜ U4 平台自動化範例

這個資料夾示範一件事：把 U3 已經完成的「資料合約 → LINE Flex payload」接到一個營運自動化場景。

主線不需要 API key，也不需要安裝 CrewAI 套件。這裡用 **CrewAI-style roles** 先把工作拆成三個 agent 角色：

| 角色 | 負責什麼 | 輸出 |
|---|---|---|
| data_checker | 讀庫存 CSV，找出低於安全量的品項 | observations |
| ops_decider | 判斷風險等級與是否需要推播 | risk_level |
| push_writer | 寫出主管看得懂的補貨 action items | report.json |

產出的 `report.json` 會沿用 U11 原本的七欄資料合約：

```text
report_date / risk_level / total_revenue / anomaly_count / top_product / top_channel / action_items
```

在這個庫存範例中，`total_revenue` 先當作「預估缺貨風險金額」使用，目的是讓既有 Dashboard 與 LINE Flex 腳本可以直接接手。

## 本機跑法

只看 agent 結果，不寫檔：

```bash
python ops-agent-lab/run_ops_check.py
```

把結果寫回 U3 的資料合約，讓 Dashboard 與 LINE Flex payload 接手：

```bash
python ops-agent-lab/run_ops_check.py --write-report
node line-lab/sendLineAlert.js --flex
```

你應該看到：

- `data-lab/report.json` 被更新成低庫存補貨通知。
- `line-lab/line-flex-payload.json` 被產生。
- 沒有設定 `LINE_REAL_SEND=1` 時，只會 mock，不會真的發送 LINE。

## 轉成真 CrewAI 的提示

等學生已經看懂三個角色後，再讓 AI coding agent 協助轉成 CrewAI：

```text
請把 ops-agent-lab/run_ops_check.py 的三個角色
data_checker / ops_decider / push_writer
改寫成 CrewAI agents + tasks 的版本。

限制：
1. 保留輸出的 report.json 七欄資料合約
2. 不要把 API key 寫進程式碼
3. 先產生計畫，不要直接改檔
4. 如果需要新增套件，先列出套件與原因，等我同意
```

主線先用本資料夾的 deterministic 版本；進階組再接真 CrewAI。
