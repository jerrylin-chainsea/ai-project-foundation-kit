# U2 · 卡住了？先看這裡

| 狀況 | 處理 |
|---|---|
| 學生覺得只是在貼 prompt | 回到 `START-HERE.md`，強調每張 prompt 都對應一個開發角色：planner、implementer、reviewer |
| 不知道 AGENTS.md 有什麼用 | 讓學生找出 C2 允許檔案，說明它是 AI 的工作邊界 |
| 不知道 CLAUDE.md 有什麼用 | 說明它是 Claude Code 補充，不取代 AGENTS.md |
| AI 在 planner 階段就改檔 | 停下來，要求它回報已改內容；必要時用 git diff 檢查 |
| AI 想改 `WarehouseAdmin.jsx` | 先不放行。UI 已接好，C2 主線只補 `getPendingLineOrders` |
| AI 想改 `warehouseData.js` | 先不放行。這堂練規則，不是改資料 |
| AI 想改 `package.json` | 先不放行。本堂不需要新套件 |
| AI 想接 LINE API 或 token | 停下來。LINE API、webhook、token 是 C3 邊界，不在 C2 主線 |
| AI 手寫「LINE OA 訂單 1 筆」 | 不合格。必須從 `orderItems.filter(...)` 算出來 |
| KPI 還是 0 | 確認 `getPendingLineOrders` 真的 return filter 結果 |
| LINE OA 明細沒出現 | 確認條件是 `order.channel === 'LINE OA'` 且 `order.status !== '已出貨'` |
| action queue 沒出現 | action queue 也是吃 `getPendingLineOrders`，先確認 helper |
| 測試腳本失敗 | 看第一個 assertion message，通常是 helper 還是 `return []` 或條件寫錯 |
| build 失敗 | 先看錯誤檔案與行數，不要叫 AI 重構 |
| diff 太大 | 要求 AI 回到最小修改，只保留 `getPendingLineOrders` |
| 學生問是不是要部署 | C2 只講 build / dist / preview / deploy 概念；公開部署後面再做 |
| reviewer 一直 PASS | 把需求、允許檔案、測試結果、`git diff` 都貼給它重新檢查 |
| 對話變亂 | `/compact`；還是亂就新開一輪，把 planner 卡和限制重新貼上 |

保底句：

```text
現在不是加功能，是回到 C2 的最小可驗收修改。
請只處理 getPendingLineOrders(orderItems)，不要改 UI、資料、套件、LINE API。
```
