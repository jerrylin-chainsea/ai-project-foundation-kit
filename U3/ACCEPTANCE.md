# U3 · 驗收單

## 主線（全班必過，到 mock 為止）

- [ ] 「推播範本」兩個都會切：**營運異常** 讀 report.json、**訂單資訊** 讀 orders.json
- [ ] 按「載入範例資料」，畫面顯示與資料檔一致的欄位
- [ ] 按「檢查資料合約」，看到綠色通過
- [ ] 按「生成 Flex 預覽」，看到 LINE 卡片樣的**視覺預覽**；按「看 JSON」可切成 payload JSON
- [ ] 知道網頁上的 `to` 永遠是示範 ID，真送對象由 `line-lab/.env` 決定
- [ ] 未勾人工審核 checkbox 時，「推播 LINE Flex」按鈕是**暗的、按不下去**
- [ ] 勾選 checkbox 後，推播按鈕亮起來
- [ ] 按「推播 LINE Flex」，看到 `[mock] LINE_REAL_SEND is not 1, no request sent.`
- [ ] F12 → Network：只有一支 `POST localhost:5180/api/send-line-flex`；**沒有** `api.line.me`
- [ ] 看得懂：瀏覽器只打自己的後端，真正打 LINE 的是後端；token 只在 `line-lab/.env`，前端 bundle 沒有
- [ ]（可選加分）設好 `line-lab/.env` + 重啟 dev 後，按鈕真送成功，畫面顯示 `✓ 已真送（LINE API 200）`

## ReAct 修錯

- [ ] `risk_level` 改成「嚴重」存檔後，擋牌**不按按鈕就出現**，錯誤訊息是
      `資料合約錯誤: risk_level 必須是 low / medium / high，目前是 "嚴重"`
- [ ] 擋牌出現時，Flex 預覽與推播按鈕全部關閉（按推播只回 `contract_error`）
- [ ] 同一壞檔跑 `node line-lab/sendLineAlert.js --flex`，終端機印出同一句錯誤
- [ ] ReAct 卡先分析不改檔；放行後只做最小修正
- [ ] 修好後畫面恢復綠色通過

## 收尾

- [ ] `npm run build` 通過
- [ ] `git diff -- web-lab/package.json` 沒有輸出
- [ ] `git diff` 沒有超出本堂允許檔案；`.env` 沒有被 commit
- [ ] 完成 commit

## DoD 對照

| 驗收面向 | 這堂的標準 |
|---|---|
| 畫面 | 兩範本五步卡全綠、視覺預覽正常、擋牌能出現也能消失 |
| 輸出 | `[mock]`（或設好 .env 後 `sent`）、`contract_error`、`[blocked]` 都親眼看過 |
| diff | 只動允許檔案 |
| build | `npm run build` 綠色通過、bundle grep 不到 token |
| human review | checkbox 是你自己勾的、Minimal Patch 是你放行的 |

## 保底（任一成立仍算過關）

- 沒有 LINE OA → 看到 `[mock]` 即過關（真送是加分）
- 按鈕沒反應 / 回 network error → 多半在 build/preview 模式（沒有後端），回到 `npm run dev`
- 改了 `.env` 沒生效 → 忘了重啟 `npm run dev`
- AI 產出不穩 → 用 starter 內建的標準版 Dashboard 完成驗收
