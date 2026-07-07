# U4 · Prompt 卡

## 卡 1 ｜ Chrome DevTools MCP 驗收（不改檔）

```text
請用 Chrome DevTools MCP 打開 http://localhost:5180。
不要改檔。

請檢查並回答：
1. console 有沒有 error
2. 品牌入口是否有動態背景
3. 訂單看板是否有 canvas 動畫
4. LINE 推播中心是否能看到三個推播範本
請回報驗收結果，並附一張截圖。
```

## 卡 2 ｜ /ship-check（交付前檢查）

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

## 卡 3 ｜ Astro 技術文章大綱

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

## 卡 4 ｜ Blog 部署 reviewer

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
