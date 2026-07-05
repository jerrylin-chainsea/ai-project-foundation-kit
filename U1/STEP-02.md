# U1 · STEP 02 ｜ 第一次可見修改、第一次 Git 快照

> 目標：只改一個安全資料檔，看到熱更新，然後用 Git 留下一次乾淨快照。

## 1. 開一個練習分支

```bash
git status
git switch -c feature/u1-first-edit
```

如果 `git status` 顯示 `fatal: not a git repository`，請先回 [`STEP-00-zip-to-git.md`](./STEP-00-zip-to-git.md) 做 `git init` 和 initial commit。

如果 `git switch -c` 失敗，通常代表你已經在同名分支；舉手或改用老師指定的新分支名。

## 2. 改一個看得見的字

打開 `web-lab/src/data.js`，找到：

```js
name: 'NOVA WAREHOUSE',
```

把它改成老師指定的版本，例如：

```js
name: 'NOVA WAREHOUSE｜Jerry',
```

存檔後，瀏覽器不用重新整理，首頁 H1 應該會熱更新。

## 3. 看 diff，不要盲目 commit

```bash
git status
git diff -- web-lab/src/data.js
```

**你應該看到**：只有 `web-lab/src/data.js` 一小段文字改動。沒有動到 `WarehouseScene.jsx`、`package.json`、`Dashboard.jsx`。

## 4. commit

```bash
git add web-lab/src/data.js
git commit -m "練習修改 NOVA 首頁標題"
git status
```

最後 `git status` 應該乾淨。

## 5. 這一步的完成定義

- 畫面：首頁 H1 有變
- diff：只動 `web-lab/src/data.js`
- commit：有一筆 commit，`git status` 乾淨
- human review：你親眼看過畫面與 diff，不是只相信 AI 說完成

→ 下一步：打開 [`STEP-03-gitflow.md`](./STEP-03-gitflow.md)，把剛剛做的動作整理成 Git flow。
