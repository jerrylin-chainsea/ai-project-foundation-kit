# U1 · Prompt 卡

U1 主要靠手，不靠 AI 亂改。AI 的用途是：讀專案、解釋流程、review diff / commit。

## 卡 1 ｜ 讀專案（先看，不要改）

貼到 Claude Code 或 Codex：

```text
請先閱讀目前專案，不要修改任何檔案。

請回答：
1. 這個專案是做什麼的
2. 啟動方式是什麼
3. 四個頁面各在做什麼
4. 如果我要修改首頁文字，可能要改哪裡
5. 這個專案有哪些 AI 工作守則檔
6. 我要怎麼驗收你沒有亂改
```

**驗收**：AI 給出摘要，而且 `git status` 乾淨。

## 卡 2 ｜ review 最新 commit

貼到 Claude Code 或 Codex：

```text
請 review 我最新的一筆 commit。
不要修改任何檔案。

請固定輸出：
Changed Files：這筆 commit 改了哪些檔案
Scope Check：是否只動 U1 允許的 web-lab/src/data.js
Behavior Check：畫面上應該看到什麼變化
Risk：最可能出錯的是什麼
Next Step：下一步我應該做什麼
```

**驗收**：AI 必須提到具體檔案與風險；只說「沒問題」不合格。

## 卡 3 ｜ 解釋 Git flow

貼到 Claude Code 或 Codex：

```text
請根據目前 git branch、git status、git log --oneline -5，
用初學者聽得懂的方式解釋我剛剛走過的 Git flow。
不要修改任何檔案。

請回答：
1. main 和 feature branch 的差別
2. 為什麼先看 git diff 再 commit
3. 這筆 commit 的範圍是否合理
4. 如果下一堂要繼續開發，應該怎麼開始
```

**驗收**：AI 的回答要能幫你講給同學或企業聽，不是只列指令。
