# U4 · STEP 01 ｜ 先把常提醒 AI 的事，寫成 Skills

> **這堂完成物**：把你在 U1-U3 一直在提醒 AI 的事——先讀、先計畫、不亂改、改完驗收——寫成兩個固定指令，帶著走。

## 1. Skill 是什麼

Skill 就像給新人的工作守則：貼在牆上，每個人進來都照這個做，你不用每次重講一遍。放在 `.claude/skills/`，打 `/名字` 呼叫。

## 2. 建立 /ops-check

建立檔案 `.claude/commands/ops-check.md`，內容：

```text
請檢查 U11 自動化流程。
不要改檔。

請根據目前檔案與輸出回答：
1. run_ops_check.py 是否會產生符合 report.json 合約的資料？
2. line-lab/sendLineAlert.js --flex 是否仍是 mock 優先？
3. 人工審核前還缺哪一個證據？
```

存檔後在對話框打 `/ops-check`。

## 3. 建立 /ship-check

建立檔案 `.claude/commands/ship-check.md`，內容：

```text
請根據目前 git status、git diff 與 build 結果，
幫我做交付前檢查。
不要改檔。
請回答：
1. 是否可交付
2. 風險最高的是哪一點
3. commit 訊息建議
4. 如果要退回，最先該退哪個檔案
```

以後每次要 commit 前，一個指令就把「交付前四問」跑完。

→ 下一步：`STEP-02-mcp.md`，今天的主線——親手裝三個 MCP，讓 AI 能自己開瀏覽器、查最新文件、記住整個專案。
