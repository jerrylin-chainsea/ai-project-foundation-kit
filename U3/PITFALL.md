# U3 · 卡住了？先看這裡

| 狀況 | 解法 |
|---|---|
| 訂單可視化沒有動畫 | 確認瀏覽器支援 WebGL；不支援也可看流程板完成主線 |
| 整頁變紅色錯誤 | 你可能改壞 JSON 語法，把資料檔改回原樣 |
| 推播按鈕不能按 | 要先載入資料、檢查合約、生成預覽、勾人工審核 |
| 按推播看到 `[mock]` | 代表不是真送；檢查 `.env`、`LINE_REAL_SEND=1`，並重啟 `npm run dev` |
| 真送回 401/403 | token 錯或過期，請換老師提供的新 token |
| 真送顯示成功但手機沒收到 | 檢查 `LINE_TARGET_ID` 是不是正確的 userId / groupId |
| 改了 `.env` 沒生效 | 一定要重啟 dev server |
| AI 想把 token 貼進前端 | 停。token 只能放 `line-lab/.env` |
| AI 想重寫 `sendLineAlert.js` | 不放行。今天主線是使用老師寫好的送出橋接 |

原則：U3 主線是真 LINE OA Flex 推播。看到 `[mock]` 只代表保底流程有跑，不是本堂主成果。
