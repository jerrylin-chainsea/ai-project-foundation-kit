# U1 · STEP 03 ｜ Git flow：不要只是會 commit，要知道自己在哪條線上

> **這一步完成物**：你能說清楚 main、feature branch、diff、commit 的關係。

## 1. 先看自己在哪個分支

```bash
git branch --show-current
git status
```

你應該在：

```text
feature/u1-first-edit
```

如果你在 `main`，先停下來問老師。C1 要練的是：不要直接在 main 上亂改。

## 2. 這就是今天的 Git flow

```text
main
  |
  | git switch -c feature/u1-first-edit
  v
feature/u1-first-edit
  |
  | 修改 web-lab/src/data.js
  | git diff
  | git add
  | git commit
  v
一筆可回溯的小修改
```

今天不急著 merge。先學會「小範圍修改 → 看 diff → commit」。

## 3. 用 Git 看剛剛那筆 commit

```bash
git log --oneline -5
git show --stat --oneline HEAD
```

你應該看到最新 commit 訊息類似：

```text
練習修改 NOVA 首頁標題
```

而且 `show --stat` 只出現：

```text
web-lab/src/data.js
```

## 4. Git flow 的人審問題

每次 commit 前問四題：

1. 我現在在哪個 branch？
2. 我改了哪些檔案？
3. diff 裡有沒有意外改動？
4. commit message 是否講得出「為什麼改」？

→ 下一步：打開 [`STEP-04-ai-agents.md`](./STEP-04-ai-agents.md)，讓 Claude Code / Codex 幫你讀專案、review diff，但不讓它亂改。
