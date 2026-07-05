# U3 · STEP 02 ｜ LINE Flex、API、token 與 Human-in-the-loop

先打開 [`API-FLOW.md`](./API-FLOW.md)。這份圖解會先把 API、webhook、token、env var、mock-vs-real 的責任邊界講清楚，再回到畫面操作。

## 1. Button 1：載入範例資料

在「LINE 推播中心」選「營運異常」或「訂單資訊」，按「載入範例資料」。

你應該看到畫面顯示資料檔裡的欄位：

- `report.json`：風險等級、營收、異常數、top product、action items
- `orders.json`：訂單編號、客戶、通路、狀態、金額、品項

## 2. Button 2：檢查資料合約

按「檢查資料合約」。綠色通過代表必要欄位存在，且 `risk_level` 是 `low / medium / high`。

資料合約沒過時，後面的 Flex 預覽與推播會被擋下。

## 3. Button 3：生成 Flex 預覽

按「生成 Flex 預覽」。你會看到 LINE 卡片樣式，也可以切到 JSON。

這就是 payload：前端與後端都要看得懂的結構化資料。

## 4. Button 4：人工審核

先不要勾 checkbox。你會看到推播按鈕是暗的。

認真檢查 Flex 卡片後，勾選：

```text
我已人工審核這則通知內容
```

通知不是 AI 產生就能送出，而是人審後才送。

## 5. Button 5：推播 LINE Flex

按「推播 LINE Flex」。沒設定 token 時，應該看到：

```text
[mock] LINE_REAL_SEND is not 1, no request sent.
```

看到 `[mock]` 就是主線過關，不是手機收到才算過關。

## 6. 用 DevTools 看 API 邊界

按 F12 → Network → 再按一次推播。

你應該看到瀏覽器只打本機 API：

```text
POST /api/send-line-flex
```

瀏覽器不會直接打 `api.line.me`，也不會帶 token。token 只在 `line-lab/.env`，真正打 LINE 的是後端。

請對照 [`API-FLOW.md`](./API-FLOW.md) 的 mock flow：

```text
Browser / React → /api/send-line-flex → Vite dev middleware → line-lab/sendLineAlert.js → mock result
```

這張 flow 是 C3 最重要的觀念圖。學生要能說出：前端只送 payload，token 留在後端，mock 是主線，真送是進階。

## 7. 真送是進階，不是主線

有 LINE OA 的同學才做：

1. 複製 `line-lab/.env.example` 成 `line-lab/.env`
2. 填 `LINE_CHANNEL_ACCESS_TOKEN` 與 `LINE_TARGET_ID`
3. 設 `LINE_REAL_SEND=1`
4. 重啟 `npm run dev`
5. 人工審核後再按推播

沒有 LINE OA 完全不影響過關。
