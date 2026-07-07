# U4 · STEP 03 ｜ 自動化小範例：把補貨判斷變成可跑的流程

> **這堂完成物**：用一個小腳本自動讀庫存 CSV、產出同一份 `data-lab/report.json`，交給 U3 的 Dashboard 與 LINE Flex payload。

## 1. 一個小腳本，自動判斷補貨

打開 `ops-agent-lab/run_ops_check.py`。它依序做三件事：檢查庫存 CSV → 判斷風險 → 寫成補貨建議。重點不是多一套新格式，而是自動產出的資料，跟 U3 手動填的格式完全一樣。

## 2. 本機先 dry run

在 `ai-project-foundation-kit` 根目錄跑：

```bash
python ops-agent-lab/run_ops_check.py
```

**你應該看到**：一份 JSON，欄位仍是 U3 的七欄資料合約：

```text
report_date / risk_level / total_revenue / anomaly_count / top_product / top_channel / action_items
```

額外的 `agent_trace` 是給人審看的紀錄；Dashboard 與 LINE 腳本會忽略它。

## 3. 寫回 report.json，讓既有平台接手

```bash
python ops-agent-lab/run_ops_check.py --write-report
node line-lab/sendLineAlert.js --flex
```

**你應該看到**：

- `data-lab/report.json` 變成低庫存補貨通知。
- `line-lab/line-flex-payload.json` 被產生。
- 輸出仍是 `[mock] LINE_REAL_SEND is not 1, no request sent.`

這就是平台整合的重點：自動化腳本只負責產生合約資料；LINE OA、Dashboard 都吃同一份資料。

→ 下一步：`STEP-04-blog-write.md`，把四堂課的成果整理成技術 blog。
