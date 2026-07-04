# 07 · Reviewer(Pass / Block:能不能進下一步,一眼看懂)

**什麼時候用:** implementer 改完了、你也初步看過畫面 —— commit 之前,讓另一個 AI 角色把 diff 完整檢查一遍。

**複製下面這段:**

```
你現在扮演 reviewer。
請根據 AGENTS.md、CLAUDE.md、目前需求與 git diff 做檢查。
不要改檔。

請固定輸出:
Verdict:PASS 或 BLOCK
Changed Files:實際改了哪些檔
Scope Check:是否超出允許範圍
Package Check:是否修改 package.json / 新增套件
Contract Check:是否符合資料合約
Platform Check:LINE Flex、ops agent、GitHub Actions 是否仍走 mock / artifact / 人審
Regression Risk:最可能壞掉的地方
Human Review:人還要親自看什麼
Next Step:如果 PASS,下一步做什麼;如果 BLOCK,先修什麼
```

**怎麼讀回報:**

- `Verdict: PASS` → 先做完 Human Review 欄指定的事,再進 commit。
- `Verdict: BLOCK` → 照 Next Step 修,修完**重跑 reviewer**,直到 PASS。

**reviewer 發現越界後的救援:**

```
reviewer 回報你超出允許範圍。
請不要再修改。
請列出:
1. 超出範圍的檔案
2. 為什麼會動到它
3. 還原方案(哪些檔要 git restore)
等我決定後才動作。
```

> reviewer 也是 AI,它的回報一樣要對照 `git diff` 抽查。
> reviewer 是幫你省力,不是幫你背書 —— 最後拍板的永遠是人。
