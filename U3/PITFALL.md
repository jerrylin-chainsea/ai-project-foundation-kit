# U3 · 卡住了？先看這裡

| 狀況 | 解法 |
|---|---|
| 訂單看板一直沒有訂單 | 確認有按到「開始營業」；按鈕變灰代表已經在營業中了 |
| 看板完全不會動、`/api/orders` 404 | 你可能在 `npm run build/preview` 模式，回到 `npm run dev`；看板會自動退回靜態範例，這不算壞掉 |
| 訂單看板沒有 3D 動畫 | 確認瀏覽器支援 WebGL；不支援也可看流程板完成主線 |
| 整頁變紅色錯誤 | 你可能改壞 JSON 語法，把資料檔改回原樣 |
| 「庫存警示」載入不到資料 | 需要 `npm run dev` 的即時看板資料；先用「訂單資訊」或「營運異常」完成主線 |
| 擋牌沒出現 | 確認改的是 `data-lab/report.json` 的 `risk_level`，且目前在「營運異常」範本 |
| 推播按鈕不能按 | 要先載入、檢查、生成預覽、勾人工審核 |
| 按推播回 network error | 你可能在 `npm run preview`，請回到 `npm run dev` |
| 設 `.env` 還是 mock | 改完 `.env` 要重啟 dev server，且 `LINE_REAL_SEND=1` |
| 真送回 401/403 | token 錯或過期，看 LINE API status code 和 response body |
| AI 想改 `reportContract.js`、`sendLineAlert.js` 或 `orderSim.js` | 不放行。它們是老師寫好的雙胞胎防線與模擬引擎 |
| AI 想把 token 貼進前端 | 停。token 只能放 `line-lab/.env` |

原則：C3 主線看到 `[mock]` 就是對，真送是進階。
