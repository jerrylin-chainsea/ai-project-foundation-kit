# U4 · 驗收單

## ops agent / GitHub Actions

- [ ] 說得出 `data_checker` / `ops_decider` / `push_writer` 三個角色各做什麼
- [ ] 跑過 `python ops-agent-lab/run_ops_check.py`
- [ ] 跑過 `python ops-agent-lab/run_ops_check.py --write-report`
- [ ] 跑過 `node line-lab/sendLineAlert.js --flex`，看到 mock 或產出 payload
- [ ] 看懂 `.github/workflows/u11-ops-check.yml` 只產 artifact，不真送 LINE

## reviewer / build / commit

- [ ] 跑過 reviewer 卡，拿到 Verdict（PASS 或 BLOCK）
- [ ] `npm run build` 通過
- [ ] `git diff -- web-lab/package.json` 沒有非預期變更
- [ ] 完成 commit；有遠端的班級完成 push

## MCP / Skills

- [ ] Chrome DevTools MCP：驗收 localhost、console、Network 或截圖；失敗則用人工 F12 保底
- [ ] Context7 MCP：查過一次最新文件，答案有來源
- [ ] Codebase Memory MCP：回答過專案檔案關係問題
- [ ] 說得出 MCP 權限三問：能讀什麼、能不能寫、會不會碰正式資料
- [ ] `/ops-check` 或等價 prompt 可用
- [ ] `/ship-check` 或等價 prompt 可用

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
3. 一次 ops agent / GitHub Actions / reviewer 驗收紀錄。
4. 三個 MCP 的使用證據或保底驗收證據。
5. 一篇已部署的 Astro 技術 blog，能說明自己如何拆題、開發、驗證、交付。

## DoD 對照

| 驗收面向 | 這堂的標準 |
|---|---|
| 畫面 | BOBA TIDE 系統回歸正常，blog 可預覽且可公開打開 |
| 輸出 | ops agent JSON、Flex payload、reviewer、MCP 回報 |
| diff | reviewer PASS 且人工抽查 |
| build | web-lab build + blog build + GitHub Pages workflow |
| human review | artifact、推播內容與 blog 內容都由人審核 |
