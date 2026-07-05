# U1 ｜ 開發環境、VS Code、Git flow、Claude Code / Codex

> **這堂不是做功能。這堂是學會接手一個 repo，知道從哪裡啟動、怎麼改、怎麼驗收、怎麼讓 AI 幫忙但不失控。**

## 今天照這個順序做

| 順序 | 檔案 | 你會完成什麼 |
|---|---|---|
| 0 | [`STEP-00-zip-to-git.md`](./STEP-00-zip-to-git.md) | 解壓 zip，用 `git init` 建立自己的本機 repo |
| 1 | [`STEP-01.md`](./STEP-01.md) | 用 VS Code 打開專案，啟動 web-lab，看懂四個頁面 |
| 2 | [`STEP-02.md`](./STEP-02.md) | 建 feature branch，改首頁一個字，完成第一次功能 commit |
| 3 | [`STEP-03-gitflow.md`](./STEP-03-gitflow.md) | 看懂 main / feature branch / diff / commit 的 Git flow |
| 4 | [`STEP-04-ai-agents.md`](./STEP-04-ai-agents.md) | 用 Claude Code / Codex 讀專案、review diff、產 commit message |
| 5 | [`ACCEPTANCE.md`](./ACCEPTANCE.md) | 對照驗收，確認 C1 真的完成 |

## C1 要學會的技術力

- VS Code：Explorer、Editor、Terminal、檔案路徑。
- Git：`init`、`status`、`diff`、`add`、`commit`。
- Git flow：不要直接亂改 main；用 feature branch 做小範圍修改。
- Claude Code / Codex：先讀、先計畫、做 review，不是一開始就叫 AI 改。
- 驗收：畫面有變、diff 乾淨、commit 有記錄、AI 沒亂改。

## 今天唯一會改的檔案

```text
web-lab/src/data.js
```

如果 AI 想改其他檔案，先停下來。C1 的目標不是功能多，而是流程穩。

注意：這門課預設你是拿到 zip，不是 `git clone`。所以第一步一定是先做 `git init` 和 initial commit。
