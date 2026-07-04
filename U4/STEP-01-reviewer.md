# U4 · STEP 01 ｜ ops agent：把補貨判斷變成可跑的流程

> **這堂完成物**：用 CrewAI-style 角色流程讀庫存 CSV，產出同一份 `data-lab/report.json`，再交給 U3 的 Dashboard 與 LINE Flex payload。
> **你現在在流水線**：`專案跑起來 → 檢查資料 → 資料合約 → AI 串接 → LINE Flex → 【ops agent 自動化】→ GitHub Actions → reviewer / build / commit`

## 0. 先認得三個角色

打開 `ops-agent-lab/role-cards.md`。今天不是先追求「真的裝 CrewAI」，而是先看懂 agent workflow 的拆法：

| 角色 | 做什麼 | 不能做什麼 |
|---|---|---|
| data_checker | 讀庫存 CSV，找低庫存與缺貨品項 | 不直接呼叫 LINE |
| ops_decider | 決定 `risk_level` 與是否需要推播 | 不新增下游格式 |
| push_writer | 產出主管看得懂的補貨 action items | 不跳過人工審核 |

## 1. 本機先 dry run

在 `ai-project-foundation-kit` 根目錄跑：

```bash
python ops-agent-lab/run_ops_check.py
```

**你應該看到**：一份 JSON，欄位仍是 U3 的七欄資料合約：

```text
report_date / risk_level / total_revenue / anomaly_count / top_product / top_channel / action_items
```

額外的 `agent_trace` 是給人審看的紀錄；Dashboard 與 LINE 腳本會忽略它。

## 2. 寫回 report.json，讓既有平台接手

```bash
python ops-agent-lab/run_ops_check.py --write-report
node line-lab/sendLineAlert.js --flex
```

**你應該看到**：

- `data-lab/report.json` 變成低庫存補貨通知。
- `line-lab/line-flex-payload.json` 被產生。
- 輸出仍是 `[mock] LINE_REAL_SEND is not 1, no request sent.`

這就是平台整合的重點：agent 只負責產生合約資料；LINE OA、Dashboard、GitHub Actions 都吃同一份資料。

## 3. 進階組：讓 AI 評估是否改成真 CrewAI

貼 `PROMPT-CARD.md` 的 **CrewAI 轉換評估卡**。先讓 AI 產生計畫，不要直接改。人審重點：

- 是否保留七欄資料合約？
- 是否要求 API key 只放環境變數？
- 是否說明新增套件與風險？
- 是否仍保留人工審核與 mock 預設？

→ 下一步：`STEP-02-build-commit-push.md`，把同一段流程放到 GitHub Actions。
