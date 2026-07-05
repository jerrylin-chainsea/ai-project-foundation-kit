# U2 · 卡住了？先看這裡

| 狀況 | 解法 |
|---|---|
| AI 想改很多檔 | 不放行。要求它縮小到 `warehouseLogic.js` |
| AI 想新增套件 | 不放行。本任務不需要新套件 |
| AI 想改 `warehouseData.js` | 通常不需要。這堂要練邏輯，不是改資料 |
| AI 手寫「LINE OA 訂單 1 筆」 | 不合格。必須從 `orderItems.filter(...)` 算出來 |
| action queue 沒出現新規則 | 確認條件是 `order.channel === 'LINE OA'` 且 `order.status !== '已出貨'` |
| build 失敗 | 先看錯誤檔案與行數，不要叫 AI 重構 |
| reviewer 一直 PASS | 把需求、允許檔案、`git diff` 都貼給它重新檢查 |
| 對話變亂 | `/compact`；還是亂就 `/clear` 後重貼 planner 卡 |

原則：AI 越界時不要急著修功能，先把範圍拉回來。
