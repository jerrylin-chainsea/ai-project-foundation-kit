# U2 · 驗收單

## 概念驗收

- [ ] 說得出 C2 是受控 vibe coding，不是 prompt 課
- [ ] 說得出 `AGENTS.md` 是所有 coding agent 的專案守則
- [ ] 說得出 `CLAUDE.md` 是 Claude Code 專用補充
- [ ] 說得出 Plan Mode 的目的：先規劃、先人審、不先改檔
- [ ] 說得出 `AGENTS.md` / `CLAUDE.md` 不是魔法鎖，仍要靠 diff、測試、build、人審
- [ ] 說得出 build、dist、preview、deploy 的差別

## 需求拆解驗收

- [ ] 看過倉儲後台，知道它是給營運 / 倉儲 / 客服主管看的控制台
- [ ] 看過訂單資料表，知道需求來自 `channel` 與 `status`
- [ ] 完成 [`WORKSHEET-requirement-breakdown.md`](./WORKSHEET-requirement-breakdown.md)
- [ ] 說得出資料、規則、畫面、測試、驗收各是什麼

## Agent 流程驗收

- [ ] planner 回覆 A-F 計畫，且沒有改檔
- [ ] 人審有檢查允許檔案、資料欄位、畫面影響、驗收方式、風險
- [ ] implementer 只做核准後的小範圍修改
- [ ] reviewer 回覆 PASS 或 BLOCK，不只是說「看起來可以」

## 功能驗收

- [ ] `getPendingLineOrders(orderItems)` 從 `orderItems` filter，不是手寫假資料
- [ ] KPI `LINE OA` 從 0 變成實際筆數
- [ ] `LINE OA 待確認` 明細出現訂單
- [ ] action queue 出現 `LINE OA 訂單需要客服確認`
- [ ] 原本缺貨與主管確認提醒仍正常

## 工程驗收

- [ ] `cd web-lab && node scripts/check-warehouse-logic.mjs` 通過
- [ ] `cd web-lab && npm run build` 通過
- [ ] `git diff -- web-lab/src/warehouseLogic.js` 看得懂且範圍小
- [ ] `git diff -- package.json` 沒有輸出
- [ ] 沒有新增不必要套件
- [ ] 沒有碰 LINE API、token、webhook
- [ ] 完成 commit

## DoD

| 驗收面向 | 這堂的標準 |
|---|---|
| 概念 | 受控 vibe coding、AGENTS、CLAUDE、Plan Mode、測試、部署概念都講得出來 |
| 畫面 | KPI、LINE OA 明細、action queue 都被同一條規則帶動 |
| 測試 | 測試腳本通過 |
| diff | 主線只動 `warehouseLogic.js` 的 C2 挖洞點 |
| build | `npm run build` 通過 |
| preview | 知道 `npm run preview` 是看 build 後的 `dist/` |
| human review | 人有看過畫面、diff、測試結果，不只相信 AI 回報 |
