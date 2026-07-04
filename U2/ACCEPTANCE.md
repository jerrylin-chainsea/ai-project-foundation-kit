# U2 · 驗收單

## 完成物

- [ ] 說得出 `data-lab/report.json` 的七個欄位，與 `risk_level` 的三個允許值
- [ ] 說得出「資料合約」和「自由作文」差在哪
- [ ] 在 Dashboard 按過「載入範例 report.json」，確認畫面讀的就是同一份檔
- [ ] 用 planner 卡拿到過一份 A–F 格式的計畫，期間 `git status` 乾淨
- [ ] 人審四題問過一輪，才放行 implementer
- [ ] implementer 的修改只落在允許檔案（本堂：`web-lab/src/Dashboard.jsx`、`web-lab/src/styles.css` 的 Dashboard 區塊）
- [ ] Dashboard 載入 report.json 後，看得到「低庫存推播準備」區塊
- [ ] 區塊有推播主題、推播通道、下一步三個資訊
- [ ] 第二輪需求變更，仍走同一套 planner → 人審 → implementer 流程
- [ ] `npm run build` 通過
- [ ] `git diff` 只有預期變更，完成 commit

## DoD 對照

| 驗收面向 | 這堂的標準 |
|---|---|
| 畫面 | Dashboard 出現低庫存推播準備區塊 |
| 輸出 | planner 回 A–F、implementer 回 A–E 固定格式 |
| diff | 只動允許檔案，不動 LINE 腳本、不動資料合約 |
| build | `npm run build` 綠色通過 |
| human review | 四題防呆你親自問過、計畫你親自核准 |

> AI 做出來不算完成，通過驗收才算完成。
