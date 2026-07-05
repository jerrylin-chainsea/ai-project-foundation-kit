# U1 · STEP 04 ｜ Claude Code / Codex：先讀、review，不要一開始就改

> **這一步完成物**：你知道 Claude Code / Codex 在開發流程裡的位置，並用它們做一次「讀專案」與「diff review」。

## 1. 兩個工具在 C1 的角色

| 工具 | C1 用法 | 不做什麼 |
|---|---|---|
| Claude Code | 讀 repo、解釋檔案、review diff、建議 commit message | 不讓它自由改很多檔 |
| Codex | 讀 repo、檢查流程、輔助排錯、review 終端機輸出 | 不讓它取代你的 human review |

你是主管，AI 是助理。AI 可以幫你看，但最後是你驗收。

## 2. 先讀專案，不改檔

貼 `PROMPT-CARD.md` 的「讀專案」卡到 Claude Code 或 Codex。

它回答後立刻跑：

```bash
git status
```

如果多了非預期改動，代表它沒有遵守「先讀，不要改」。

## 3. 請 AI review 你的 diff / commit

如果你剛剛已經 commit，貼 `PROMPT-CARD.md` 的「review 最新 commit」卡。

你要看到 AI 回答：

- Changed Files
- Scope Check
- Risk
- Next Step

如果 AI 只說「看起來很好」但沒有檔案與風險，這份 review 不合格。

## 4. C1 收束

現在你應該能說出：

```text
我用 VS Code 打開 repo。
我用 npm run dev 啟動 web-lab。
我從 main 開 feature branch。
我只改 data.js。
我看過 git diff。
我完成一筆 commit。
我用 Claude Code / Codex 讀專案與 review，但沒有讓 AI 亂改。
```

→ 下一步：打開 [`ACCEPTANCE.md`](./ACCEPTANCE.md)，逐項勾 C1 驗收。
