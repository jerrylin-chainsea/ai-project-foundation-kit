# U4 · 驗收單

## Skills

- [ ] `.claude/commands/ops-check.md` 建立完成，`/ops-check` 或等價 prompt 可用
- [ ] `.claude/commands/ship-check.md` 建立完成，`/ship-check` 或等價 prompt 可用
- [ ] 說得出 Skill 是「寫成固定指令的 SOP」，不是每次重講一遍

## MCP

- [ ] Chrome DevTools MCP：驗收過 console error、動態背景、canvas 動畫、推播範本，截圖只是附帶證據；失敗則用人工 F12 保底
- [ ] Context7 MCP：查過一次最新文件，答案有來源
- [ ] Codebase Memory MCP：回答過專案檔案關係問題，也問過一次「改這裡會影響哪裡」
- [ ] 說得出 MCP 權限三問：能讀什麼、能不能寫、會不會碰正式資料

## Astro 技術 blog

- [ ] 新增一篇 BOBA TIDE 技術紀錄文章
- [ ] 文章包含企業題目拆解、系統截圖、技術說明、AI 工作流、驗收證據
- [ ] 文章不是 AI 口號文，而是看得出實作決策與驗收證據
- [ ] `cd blog-lab && npm run build` 通過
- [ ] GitHub Pages Source 選 GitHub Actions
- [ ] `Deploy Astro Blog to GitHub Pages` workflow 成功
- [ ] 公開網址打得開，文章連結與樣式正常

## 最終繳交（整門課）

1. BOBA TIDE repo：首頁、備料控制台、訂單看板、LINE 推播中心可運作。
2. 一份 LINE Flex mock payload 或截圖。
3. 自建 `/ops-check`、`/ship-check` 與三個 MCP 的使用證據或保底驗收證據。
4. 一篇已部署的 Astro 技術 blog，能說明自己如何拆題、開發、驗證、交付。

## DoD 對照

| 驗收面向 | 這堂的標準 |
|---|---|
| 畫面 | BOBA TIDE 系統回歸正常，blog 可預覽且可公開打開 |
| 輸出 | Skill 指令回報、MCP 回報(console/影響範圍/文件出處) |
| build | web-lab build + blog build + GitHub Pages workflow |
| human review | 推播內容與 blog 內容都由人審核 |
