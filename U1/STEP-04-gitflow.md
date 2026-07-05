# U1 · STEP 04 ｜ Git flow：不要只是會 commit，要知道自己在哪條線上

> **這一步完成物**：你能說清楚 main、feature branch、diff、commit、origin、push 的關係。

## 1. 先看自己在哪個分支

```bash
git branch --show-current
git status
git remote -v
```

你應該在：

```text
feature/u1-first-edit
```

如果你在 `main`，先停下來問老師。C1 要練的是：不要直接在 main 上亂改。

## 2. 這就是今天的 Git flow

```text
local main
  |
  | git switch -c feature/u1-first-edit
  v
local feature/u1-first-edit
  |
  | 修改 web-lab/src/data.js
  | git diff
  | git add
  | git commit
  v
一筆可回溯的小修改
  |
  | git push -u origin main
  | git push -u origin feature/u1-first-edit
  v
GitHub origin
  ├─ main
  └─ feature/u1-first-edit
```

今天不急著 merge。先學會「小範圍修改 → 看 diff → commit → push」。

## 3. local 和 remote 差在哪

| 名詞 | 代表什麼 |
|---|---|
| local branch | 你電腦裡的 branch |
| remote branch | GitHub 上的 branch |
| origin | 你幫 GitHub repo 取的遠端名字 |
| push | 把本機 commit 送到 GitHub |
| `-u` | 記住本機 branch 對應哪個遠端 branch，下次可以直接 `git push` |

## 4. 用 Git 看剛剛那筆 commit

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

## 5. Git flow 的人審問題

每次 commit 前問四題：

1. 我現在在哪個 branch？
2. 我改了哪些檔案？
3. diff 裡有沒有意外改動？
4. commit message 是否講得出「為什麼改」？
5. 這個 branch 有沒有 push 到 GitHub？

→ 下一步：打開 [`STEP-05-ai-agents.md`](./STEP-05-ai-agents.md)，讓 Claude Code / Codex 幫你讀專案、review diff，但不讓它亂改。
