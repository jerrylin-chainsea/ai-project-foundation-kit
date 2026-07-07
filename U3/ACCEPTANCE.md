# U3 · 驗收單

## 訂單看板（會動）

- [ ] 按「開始營業」後，訂單持續進來、KPI 跳動、庫存自動往下掉
- [ ] 「暫停」能凍結畫面、「重置」能回到乾淨起點
- [ ] DevTools Network 看得到每 3 秒一次的 `GET /api/orders`，看得懂裡面的 JSON 大致長怎樣
- [ ] 在「備料水位」按「盤點 −5」，能讓某項原料變成「需要補貨」或「數字有誤」
- [ ] 說得出 `OrderBoard.jsx` 是 component，`styles.css` 管狀態樣式
- [ ] 沒開 dev 後端（build/preview）時，看板會退回靜態範例，不會白屏

## LINE Flex 主線（三種訊息）

- [ ] 說得出 `API-FLOW.md` 裡 mock send 的資料流：Browser → `/api/send-line-flex` → 本機後端 → LINE sender script → mock result
- [ ] 說得出 webhook 是 LINE Platform 主動 POST 回 bot server，方向和 push API（以及看板的輪詢）相反
- [ ] 說得出 token / env var 為什麼不能進前端或 commit
- [ ] 「訂單資訊」「庫存警示」「營運異常」三個範本都能切換，且顏色不同（藍/琥珀/紅）
- [ ] 按「載入資料」後，畫面欄位與資料來源一致
- [ ] 按「檢查資料合約」看到綠色通過
- [ ] 按「生成 Flex 預覽」看到對應顏色的 LINE 卡片，也能切 JSON
- [ ] 未勾人工審核時，推播按鈕不可按
- [ ] 勾選人工審核後，推播按鈕可按
- [ ] 按推播後看到 `[mock] LINE_REAL_SEND is not 1, no request sent.`
- [ ] DevTools Network 只看到 `/api/send-line-flex`，沒有前端直接呼叫 `api.line.me`

## ReAct 修錯

- [ ] 把 `risk_level` 改成「嚴重」後，紅色擋牌出現（「營運異常」範本）
- [ ] CLI `node line-lab/sendLineAlert.js --flex` 也被同一個合約擋下
- [ ] ReAct 卡先分析不改檔
- [ ] 放行後只做最小修正
- [ ] 修好後 build 通過

## DoD 對照

| 驗收面向 | 這堂的標準 |
|---|---|
| 畫面 | 看板會動、三種顏色的 Flex 預覽都正常、擋牌能出現也能消失 |
| 輸出 | `[mock]`、contract error、ReAct 格式、Network request |
| diff | 只動允許檔案 |
| build | `npm run build` 通過 |
| human review | checkbox 是你自己勾的、Minimal Patch 是你放行的 |
