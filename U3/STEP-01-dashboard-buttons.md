# U3 · STEP 01 ｜ 用按鈕走完資料 → 畫面 → Flex 預覽（兩個範本）

> **這堂完成物**：在 Dashboard 的「推播中心」用按鈕走完「選範本 → 載入 → 檢查合約 → 視覺預覽 → 人工審核 → 推播」，而且**兩個範本都會走**（營運異常 / 訂單資訊）。
> **你現在在流水線**：`專案跑起來 → 檢查資料 → 資料合約 → 【按鈕推播 LINE Flex】→ 修錯 → 驗收 → 交付`
>
> **重點改了**：推播不再是「複製一長串指令到終端機」，而是**畫面上一顆按鈕**。沒設定 token 時按下去會看到 `[mock]`，這就算過關；設好 `.env` 的同學可以真的送到手機。

## 0. 本堂允許 AI 修改的檔案（貼給 AI 前先看一眼）

```
✅ 可以修改
  web-lab/src/Dashboard.jsx        （本堂主戰場）
  web-lab/src/styles.css           （只准在 Dashboard 區塊內追加）
  data-lab/report.json             （弄壞／修好練習專用）
  data-lab/orders.json             （訂單範本資料，練習用）
  line-lab/.env                    （只在你要「真送」時填自己的 token，且不會被 commit）

⛔ 不可修改
  web-lab/src/App.jsx、main.jsx、data.js、Beach.jsx（U1/U2 的範圍）
  web-lab/package.json、package-lock.json
  web-lab/vite.config.js、web-lab/src/reportContract.js、line-lab/sendLineAlert.js
    （這些是老師已寫好的「推播中心後端 + 雙胞胎」，今天不動；要動只在老師指定時）
```

> 小知識：`web-lab/src/reportContract.js`（畫面預覽用）和 `line-lab/sendLineAlert.js`（真送用）是**雙胞胎**——同一套資料合約，錯誤訊息逐字相同。今天兩邊都不改。

## 1. 啟動並切到 Dashboard

雙擊 `start-m11.bat`（macOS：`start-m11.command`）→ 網頁上方點「**營運異常 Dashboard**」。
最上面有一排「**推播範本**」：**營運異常** / **訂單資訊**。先用預設的「營運異常」。

## 2. Button 1：載入範例資料

按下「載入範例資料」。

**你應該看到**（營運異常範本）：報表日期、風險等級徽章（high 是紅橘色）、總營收 `NT$128,400`、異常筆數、Top product / channel、三條 action items，還有「低庫存推播準備」小區塊。

## 3. Button 2：檢查資料合約

按下「檢查資料合約」→ 綠色「資料合約通過：營運異常範本必要欄位齊全」。
（紅色擋牌長什麼樣？STEP-03 你會親手把它弄出來。）

## 4. Button 3：生成 LINE Flex 視覺預覽

按下「生成 Flex 預覽」。

**你應該看到**：一張像 LINE 上那樣的**卡片**（標題、分隔線、欄位、action items）。
按右上角「**看 JSON**」可以切成 LINE OA 真正會吃的 payload JSON；再按一次切回視覺預覽。

> 網頁預覽的 `to` 永遠是示範 ID —— 真送對象由 `line-lab/.env` 決定，**token 與對象都不會進前端**。

## 5. 換一個範本：訂單資訊

回到最上面點「**訂單資訊**」→ 流程會重置。再按一次 載入 → 檢查 → 生成預覽。

**你應該看到**：一樣的五步流程，但資料換成 `data-lab/orders.json`（訂單編號、客戶、通路、狀態、金額、品項）。
**這就是重點**：同一套「載入→檢查→預覽→人審→推播」流程，能推**不同的訊息**。

→ 下一步：`STEP-02-hitl-review.md`，人工審核與按鈕推播。
