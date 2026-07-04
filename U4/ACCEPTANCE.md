# U4 · 驗收單

## ops agent

- [ ] 說得出 `data_checker` / `ops_decider` / `push_writer` 三個角色各做什麼
- [ ] 跑過 `python ops-agent-lab/run_ops_check.py`，看過 dry-run JSON
- [ ] 跑過 `python ops-agent-lab/run_ops_check.py --write-report`
- [ ] `data-lab/report.json` 仍符合七欄資料合約
- [ ] 跑過 `node line-lab/sendLineAlert.js --flex`，產生 `line-lab/line-flex-payload.json`

## GitHub Actions

- [ ] 看懂 `.github/workflows/u11-ops-check.yml` 的四個主要步驟
- [ ] 知道 workflow 只產 artifact，不真送 LINE
- [ ] 有遠端的班級：Actions 分頁手動跑過 `U11 Ops Agent Check`
- [ ] 下載或檢查過 artifact：`report.json`、`line-flex-payload.json`

## reviewer / build / commit

- [ ] 跑過 reviewer 卡，拿到 Verdict（PASS 或 BLOCK）
- [ ] reviewer 的回報有對照 `git diff` 抽查過
- [ ] `npm run build` 通過
- [ ] `git diff -- web-lab/package.json` 沒有輸出
- [ ] 完成 commit；有遠端的班級完成 push

## 固化成工具（/ops-check、/ship-check）

- [ ] 建立 `.claude/commands/ops-check.md` 並成功打出 `/ops-check`
- [ ] 建立 `.claude/commands/ship-check.md` 並成功打出 `/ship-check`

## 三個 MCP（本堂主線 · 學生動手裝）

- [ ] `chrome-devtools`：`/mcp` 列得出；AI 真的開 `localhost:5180`、回報 console + 截圖
- [ ] `context7`：`/mcp` 列得出；句尾加 `use context7` 後答案附文件出處
- [ ] `codebase-memory`：`/mcp` 列得出；`index_repository` 後架構問題答得出檔案關係
- [ ] 說得出 MCP 權限三問：能讀什麼、能不能寫、會不會碰正式資料
- [ ] （任一 MCP 裝不起來用保底即可：F12 / 看官網 / `/init`，不擋過關）

## DoD 對照

| 驗收面向 | 這堂的標準 |
|---|---|
| 畫面 | Dashboard 全流程仍正常（回歸確認） |
| 輸出 | ops agent JSON、Flex payload、Actions artifact、reviewer 固定格式 |
| diff | reviewer PASS 且人工抽查一致 |
| build | `✓ built` |
| human review | Actions artifact 與真送前內容都由人審核 |

## 最終繳交（整門課四件）

1. 可互動的營運 Dashboard 推播中心（兩範本：載入 → 檢查 → 視覺預覽 → 審核 → 按鈕推播）
2. 一份 Flex payload（畫面截圖或 `line-lab/line-flex-payload.json`）
3. 一次 ops agent / GitHub Actions artifact 紀錄
4. `/mcp` 列出三台 MCP，且各驗收過一次（截圖）

> AI 做出來不算完成，通過驗收才算完成。
