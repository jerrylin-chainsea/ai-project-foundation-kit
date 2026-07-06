---
name: "source-command-review-diff"
description: "檢視目前 git diff，逐檔說明改了什麼、有沒有越界修改"
---

# source-command-review-diff

Use this skill when the user asks to run the migrated source command `review-diff`.

## Command Template

請先跑 `git status` 和 `git diff`，然後**只做檢視、不要修改任何檔案**。

逐檔回報：
1. 這次動到哪些檔案
2. 每個檔案「加了什麼、刪了什麼」（用白話）
3. 有沒有**越界修改**（改到跟本次任務無關的檔案或區塊）
4. 有沒有可疑的地方（刪掉看起來重要的東西、新增了套件、動了設定檔）
5. 結論：這次修改可不可以放心 commit？若不行，該還原哪個檔

> 若發現越界修改，建議我用 `git restore <檔>` 還原該檔後重做。
