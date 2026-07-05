# U2 · STEP 01 ｜受控 Vibe Coding：先立規則，再讓 AI 寫

> Vibe coding 不是亂叫 AI 做。真正能交付的 vibe coding，要有守則、計畫、驗收與版本控制。

## 1. Vibe coding 是什麼

在這堂課裡，vibe coding 指的是：

```text
你用自然語言描述需求，
AI coding agent 幫你讀專案、改檔案、跑指令、回報結果。
```

你可以把它想成「用中文或英文下開發任務」，但真正負責品質的人仍然是你。AI 可以寫得很快，卻不一定知道課程階段、企業場景、允許檔案、驗收標準。

它的優點是快，但風險也很明顯：

- AI 會過度發揮
- AI 會改到不該改的檔案
- AI 可能把不同課程階段混在一起
- AI 可能寫出看似完成、但無法驗收的結果

所以 C2 要教的是受控版本：

```text
受控 vibe coding = 自然語言需求 + 專案守則 + Plan Mode + 人審 + 測試驗收 + git diff
```

對照一下：

| 做法 | 看起來像什麼 | 問題 |
|---|---|---|
| 不受控 vibe coding | 「幫我做一個 LINE OA 訂單提醒」 | AI 可能擴大需求、亂改檔、提前接 API |
| 受控 vibe coding | 「先讀守則、先規劃，只改允許檔案，通過測試與 diff 才算完成」 | 速度慢一點，但能被驗收與交接 |

## 2. `AGENTS.md` 是什麼

`AGENTS.md` 是寫給 coding agent 的專案工作守則。它通常放在 repo 根目錄，讓 agent 在開始工作前先知道：

- 這個專案是做什麼的
- 每堂課允許改哪些檔案
- 哪些檔案不能碰
- 改完要怎麼回報
- 要跑哪些驗收

在這份專案裡，C2 最重要的守則是：

```text
主線只改 web-lab/src/warehouseLogic.js 的 getPendingLineOrders。
WarehouseAdmin.jsx / styles.css 是老師預先接好的畫面，學生不需要改。
```

## 3. `CLAUDE.md` 是什麼

`CLAUDE.md` 是 Claude Code 專用的專案記憶與補充規則。它會提供 Claude Code 額外上下文，例如：

- 先讀 `AGENTS.md`
- Claude Code 要用 Plan Mode
- 完成後要用固定格式回報
- 不要為了小任務改 package 或部署設定

重點：`AGENTS.md` / `CLAUDE.md` 是上下文與守則，不是魔法鎖。真正的保險仍然要靠：

- 人類先審計畫
- `git diff`
- 測試腳本
- `npm run build`
- reviewer

## 4. Plan Mode 管什麼

Plan Mode 的目標是：

```text
先讓 AI 讀檔案、說計畫、列風險；
不要一開始就改檔。
```

學生審 Plan 的時候，不看它寫得漂不漂亮，只看五件事：

1. 它說要改哪些檔案？
2. 有沒有超出 `AGENTS.md` 允許範圍？
3. 有沒有要新增套件或改 `package.json`？
4. 它用哪些資料欄位判斷需求？
5. 它打算怎麼驗收？

## 5. 今天的角色分工

| 角色 | 做什麼 | 不做什麼 |
|---|---|---|
| planner | 讀檔案、拆任務、提出 A-F 計畫 | 不改檔 |
| human reviewer | 判斷計畫能不能放行 | 不盲目按同意 |
| implementer | 照核准計畫做最小修改 | 不擴大範圍 |
| reviewer | 檢查 diff、測試、build、風險 | 不只說「看起來可以」 |

下一步：[`STEP-02-data-contract.md`](./STEP-02-data-contract.md)。
