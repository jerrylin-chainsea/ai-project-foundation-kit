# U4 · Prompt 卡

## 卡 1 ｜ ops agent 檢查（不改檔）

```text
請檢查 ops-agent-lab 的自動化流程。
不要改檔。

請回答：
1. data_checker / ops_decider / push_writer 三個角色各做什麼
2. run_ops_check.py 產出的資料是否符合 data-lab/report.json 七欄合約
3. 哪些額外欄位只是給人審看，下游會忽略
4. 接到 line-lab/sendLineAlert.js --flex 前，還需要哪個人工審核
```

## 卡 2 ｜ CrewAI 轉換評估（先計畫）

```text
請評估是否把 ops-agent-lab/run_ops_check.py
改成真正的 CrewAI agents + tasks。

先不要改檔，不要新增套件。
請用以下格式回答：
A. 需要新增或修改的檔案
B. 需要的套件與原因
C. 如何保留 report.json 七欄資料合約
D. API key / token 要放哪裡，哪些地方禁止出現
E. mock 與人工審核如何保留
F. 風險與不建議改的地方
```

## 卡 3 ｜ GitHub Actions reviewer

```text
你現在扮演 reviewer。
請檢查 .github/workflows/u11-ops-check.yml。
不要改檔。

請固定輸出：
Verdict：PASS 或 BLOCK
Workflow Trigger：是否有手動或排程觸發
Secret Safety：是否沒有 token / API key
Output Check：是否產出 report.json 與 line-flex-payload.json artifact
No Real Send Check：是否不會真送 LINE
Next Step：如果 PASS，下一步做什麼；如果 BLOCK，先修什麼
```

## 卡 4 ｜ reviewer（Pass / Block 格式）

```text
你現在扮演 reviewer。
請根據 AGENTS.md、CLAUDE.md、目前需求與 git diff 做檢查。
不要改檔。

請固定輸出：
Verdict：PASS 或 BLOCK
Changed Files：實際改了哪些檔
Scope Check：是否超出允許範圍
Package Check：是否修改 package.json / 新增套件
Contract Check：是否符合資料合約
Platform Check：LINE Flex、ops agent、GitHub Actions 是否仍走 mock / artifact / 人審
Regression Risk：最可能壞掉的地方
Human Review：人還要親自看什麼
Next Step：如果 PASS，下一步做什麼；如果 BLOCK，先修什麼
```

## 卡 5 ｜ /ship-check（交付前檢查）

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

## 卡 6 ｜ Astro 技術文章大綱

```text
請幫我整理一篇 Astro blog 技術文章大綱。
主題：我如何用 AI coding agent 接手並交付一個 BOBA TIDE 手搖飲控制台系統。

請不要寫空泛心得，要包含：
1. 企業題目拆解
2. 我改了哪些功能
3. React component / CSS / API payload / token 邊界
4. AGENTS.md、CLAUDE.md、Plan Mode 如何限制 AI
5. 驗收證據：build、mock、DevTools、diff
6. 可以給企業看的成果截圖清單
```

## 卡 7 ｜ Blog 部署 reviewer

```text
你現在扮演部署 reviewer。
請檢查 blog-lab 與 .github/workflows/deploy-blog.yml。
不要改檔。

請固定輸出：
Verdict：PASS 或 BLOCK
Astro Build：blog-lab 是否可 npm run build
Pages Source：GitHub Pages 是否應選 GitHub Actions
Base Path：astro.config.mjs 如何處理 project Pages 的 base
Artifact Path：workflow 是否部署 blog-lab/dist
Public Safety：文章是否可能放了 token、個資或未授權資料
Next Step：如果 PASS，下一步做什麼；如果 BLOCK，先修什麼
```
