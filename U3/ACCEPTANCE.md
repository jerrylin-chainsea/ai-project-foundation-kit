# U3 · 驗收單

## 訂單可視化

- [ ] 看過「訂單可視化」頁的 three.js 訂單流動畫
- [ ] 說得出訂單資料會影響畫面上的狀態、區域、金額、ETA
- [ ] 說得出 `OrderFlow.jsx` 是畫面元件，`styles.css` 管視覺狀態

## LINE OA Flex 真送

- [ ] `line-lab/.env` 已填入老師提供的 LINE OA 設定
- [ ] `LINE_REAL_SEND=1`
- [ ] 改完 `.env` 後已重啟 `npm run dev`
- [ ] 「LINE 推播中心」選到 `訂單資訊`
- [ ] 按「載入資料」後，畫面欄位與 `data-lab/orders.json` 一致
- [ ] 按「檢查資料合約」看到綠色通過
- [ ] 按「生成 Flex 預覽」看到 LINE 卡片
- [ ] 未勾人工審核時，推播按鈕不可按
- [ ] 勾選人工審核後，推播按鈕可按
- [ ] 按「推播 LINE Flex」後，LINE OA / 群組 / 手機真的收到 Flex Message
- [ ] 畫面顯示已送出

## 最少工程概念

- [ ] 說得出 Flex Message 是 LINE 卡片的資料結構
- [ ] 說得出 token 為什麼不能放前端或 commit
- [ ] 說得出今天的送出橋接是老師寫好的，學生主線不是重寫 API

## 收尾

- [ ] `cd web-lab && npm run build` 通過
- [ ] `.env` 沒有被 commit
- [ ] 可以截圖或展示 LINE 上收到的 Flex Message

## 加分排錯

- [ ] 完成 `STEP-03-react-debug.md`
- [ ] 能說出資料合約錯誤為什麼會擋下 Flex 推播
