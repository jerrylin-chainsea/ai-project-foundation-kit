# U1 · STEP 00 ｜從 zip 建立自己的 Git repo

> **這一步完成物**：把老師給的 zip 變成你自己的本機 Git repo，並建立第一筆乾淨快照。

## 1. 解壓縮 zip

你拿到的會是類似：

```text
ai-project-foundation-kit.zip
```

請先解壓縮，得到：

```text
ai-project-foundation-kit/
```

接下來 VS Code 要開這一層資料夾，不要開 Downloads，也不要只開 `web-lab/`。

## 2. 用 VS Code 開專案根目錄

在 VS Code 選：

```text
File → Open Folder → ai-project-foundation-kit
```

左邊檔案樹應該看得到：

```text
START-HERE.md
AGENTS.md
CLAUDE.md
U1/
web-lab/
data-lab/
line-lab/
```

如果只看到 `src/`、`package.json`，代表你開到 `web-lab/` 裡面了，請重新 Open Folder。

## 3. 確認目前還不是 Git repo

打開 VS Code Terminal：

```bash
git status
```

如果你看到：

```text
fatal: not a git repository
```

這是正常的。因為你是從 zip 來的，不是 `git clone`。

## 4. 初始化 Git

在專案根目錄執行：

```bash
git init
git status
```

你應該看到很多檔案變成 untracked。這代表 Git 開始追蹤這個資料夾，但還沒有建立快照。

## 5. 建立 initial commit

```bash
git add .
git commit -m "初始化 M11 專案包"
git status
```

最後 `git status` 應該顯示乾淨，例如：

```text
nothing to commit, working tree clean
```

## 6. 如果 Git 要求設定姓名與 email

照終端機提示設定一次：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的信箱"
```

再重跑：

```bash
git commit -m "初始化 M11 專案包"
```

## 7. 這一步的完成定義

- VS Code 開的是 `ai-project-foundation-kit/` 根目錄。
- `git init` 已完成。
- 有一筆 initial commit。
- `git status` 乾淨。

→ 下一步：打開 [`STEP-01.md`](./STEP-01.md)，把 web-lab 跑起來。
