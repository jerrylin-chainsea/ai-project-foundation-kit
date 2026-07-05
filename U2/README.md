# U2 ｜受控 Vibe Coding：用 AI 做可驗收的程式修改

學生請先看：

```text
U2/START-HERE.md
```

這堂課不是 prompt 課，也不是自由做功能。今天只完成一個小功能：

```text
web-lab/src/warehouseLogic.js
getPendingLineOrders(orderItems)
```

但你會走完整流程：

```text
看現況 → 跑失敗測試 → 讀資料 → 拆需求 → planner → 人審 → implementer → 測試 / 畫面 / diff / build → reviewer → commit
```

## 今天真正學到什麼

- 受控 vibe coding：不是叫 AI 隨便做，而是讓 AI 在規則內做事。
- `AGENTS.md` / `CLAUDE.md`：專案守則與 agent 工作邊界。
- Plan Mode：先規劃，不先改檔。
- 人審：人要判斷 AI 計畫能不能放行。
- 最小修改：只填一個 helper，不重做 UI。
- 測試與驗收：用測試腳本、畫面、diff、build 證明結果成立。
- 部署概念：知道 source、build、dist、preview、deploy 的差別。

## 4 小時路線

| 時間 | 做什麼 | 學生要留下什麼 |
|---|---|---|
| 0:00-0:25 | 從 C1 進到 C2：為什麼要受控 vibe coding | 知道今天不是貼 prompt |
| 0:25-0:55 | 看 AGENTS / CLAUDE / Plan Mode | 知道允許檔案與禁止範圍 |
| 0:55-1:30 | 跑失敗測試、讀資料、拆需求 | 完成 worksheet |
| 1:30-2:15 | planner → 人審 | 一份可放行的 A-F 計畫 |
| 2:15-2:55 | implementer 最小修改 | 完成 `getPendingLineOrders` |
| 2:55-3:30 | 測試、畫面、diff、build | 驗收證據 |
| 3:30-3:50 | build / dist / preview / deploy 概念 | 知道本機開發與可部署成品的差別 |
| 3:50-4:00 | reviewer、commit、銜接 C3 | 一個乾淨 commit |

## 檔案用途

| 檔案 | 用途 |
|---|---|
| `START-HERE.md` | 學生主線入口 |
| `WORKSHEET-requirement-breakdown.md` | 需求拆解 |
| `PROMPT-CARD.md` | planner / implementer / reviewer prompt |
| `ACCEPTANCE.md` | 完成定義 |
| `PITFALL.md` | 卡住時看這裡 |
| `TEACHER-GUIDE.md` | 老師導讀 |
| `SCREENSHOT-GUIDE.md` | 老師備課截圖清單 |

## 完成定義

- 測試腳本通過
- 倉儲後台三個位置都有反應
- `npm run build` 通過
- `git diff` 只剩 C2 允許範圍
- 沒有碰 LINE API、token、webhook
