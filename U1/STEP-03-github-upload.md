# U1 · STEP 03 ｜上傳到 GitHub repo

> **這一步完成物**：把本機 repo 上傳到 GitHub。C1 只做 repo 上傳，不做 GitHub Pages 部署；Pages 和 Actions 留到 U4。

## 1. 先確認本機狀態

```bash
git status
git branch --show-current
git log --oneline -5
```

你應該已經有兩種 commit：

1. `初始化 M11 專案包`
2. `練習修改 BOBA TIDE 首頁標題`

如果 `git status` 不乾淨，先不要上傳，請先看清楚 diff。

## 2. 到 GitHub 建一個空 repo

在 GitHub 建立新 repo，名字叫做：

```text
ai-project-foundation-kit
```

注意：

- 不要勾 `Add a README file`
- 不要加 `.gitignore`
- 不要加 license

因為你本機已經有完整專案和 initial commit。GitHub repo 要保持空的，才不會第一次 push 就衝突。

## 3. 加上遠端 origin

把下面網址換成你自己的 GitHub repo URL：

```bash
git remote add origin https://github.com/<你的帳號>/ai-project-foundation-kit.git
git remote -v
```

你應該看到 `origin` 指向你的 GitHub repo。

## 4. 先推 main

```bash
git switch main
git push -u origin main
```

這會把「初始化 M11 專案包」推上 GitHub。

## 5. 再推 C1 練習分支

```bash
git switch feature/u1-first-edit
git push -u origin feature/u1-first-edit
```

這會把你第一次修改首頁標題的練習分支也推上 GitHub。

## 6. 到 GitHub 網頁確認

打開你的 GitHub repo，確認：

- Code 頁面看得到專案檔案。
- Branch 下拉選單看得到 `main`。
- Branch 下拉選單看得到 `feature/u1-first-edit`。
- `main` 是乾淨的起始專案。
- `feature/u1-first-edit` 有你修改首頁標題的 commit。

## 7. 為什麼不會跟 U4 打架

C1 做的是：

```text
本機 repo → GitHub 遠端 repo
```

U4 做的是：

```text
GitHub repo → GitHub Actions → GitHub Pages 公開網站
```

所以 C1 先上傳 repo 不會跟 U4 打架，反而是 U4 部署的前置條件。C1 不開 Pages、不設定 Actions，只確認 repo 能 push。

## 8. 這一步的完成定義

- GitHub 上有你的 repo。
- `origin` 設定正確。
- `main` 已 push。
- `feature/u1-first-edit` 已 push。
- GitHub 網頁能看到兩個 branch。

→ 下一步：打開 [`STEP-04-gitflow.md`](./STEP-04-gitflow.md)，把本機 branch、遠端 origin、push 的關係整理成 Git flow。
