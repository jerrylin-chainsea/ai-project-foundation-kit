# U2 · 驗收單

## 完成物

- [ ] 說得出 `AGENTS.md` / `CLAUDE.md` 是 AI 工作守則
- [ ] 說得出本堂允許檔案，且知道通常只改 `shopLogic.js`
- [ ] 用 planner 卡拿到 A-F 計畫，期間 `git status` 沒有新變更
- [ ] 人審四題問過一輪，才放行 implementer
- [ ] action queue 出現「LINE OA 訂單需要主動聯絡客人」
- [ ] 新規則是從 `orderItems` 判斷，不是寫死文字假資料
- [ ] 原本低庫存與缺料訂單提醒仍正常
- [ ] `npm run build` 通過
- [ ] `git diff` 只動允許檔案
- [ ] reviewer 回 PASS 或指出可修正 BLOCK
- [ ] 完成 commit

## DoD 對照

| 驗收面向 | 這堂的標準 |
|---|---|
| 畫面 | 備料控制台 action queue 多一條 LINE OA 主動聯絡客人提醒 |
| 輸出 | planner A-F、implementer A-E、reviewer Pass/Block |
| diff | 只動 `shopLogic.js` 或核准過的允許檔案 |
| build | `cd web-lab && npm run build` 通過 |
| human review | 人親自看過計畫、畫面與 diff |

## 加映（選用，不影響上面的主線驗收）

- [ ] 建立過 `.claude/agents/beginner-ai-project-workflow.md`，說得出 name/description、model/memory、核心工作流程、保底機制各在幹嘛
- [ ] 用 `@agent-beginner-ai-project-workflow` 呼叫過一次
- [ ] （選用）Claude HUD 已安裝

詳見 [`STEP-03-subagent.md`](./STEP-03-subagent.md)。
