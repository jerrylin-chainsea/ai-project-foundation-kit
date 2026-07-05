# U2 · 簡報截圖與備課畫面指南

> 這份是給老師備課用。Chrome DevTools MCP / DevTools 可以用來截圖、查 console、檢查畫面，但不要放進 C2 學生主線。

## 1. 必備截圖

| 截圖 | 用在哪裡 | 畫面重點 |
|---|---|---|
| 倉儲後台初始畫面 | 開場、需求導入 | KPI、警示燈、訂單資料表、處理佇列 |
| 訂單資料表局部 | 需求拆解 | `channel`、`status`、`eta` |
| `AGENTS.md` U2 範圍 | 守則檔講解 | C2 允許檔案與禁止範圍 |
| `CLAUDE.md` | Claude Code 補充 | 先讀 AGENTS、Plan Mode、回報格式 |
| `warehouseLogic.js` C2-HOLE | 實作入口 | `getPendingLineOrders(orderItems)` 的 `return []` |
| planner A-F 計畫 | Plan Mode | AI 只規劃、不改檔 |
| 測試腳本失敗 | 測試概念 | 完成 helper 前，測試應該失敗 |
| 測試腳本通過 | 測試概念 | helper 完成後，測試變綠 |
| `git diff` | 工程驗收 | 只動 C2 允許範圍 |
| `npm run build` 通過 | build 驗收 | Vite build successful |
| `dist/` 資料夾 | 部署概念 | build 後產出可部署檔案 |
| `npm run preview` | 部署概念 | 本機預覽 build 後結果 |

## 2. 可選：Chrome DevTools MCP / DevTools 截圖

這些畫面可幫簡報更像真實工程流程，但 C2 不要求學生操作：

- 桌機 viewport 的倉儲後台截圖
- 手機 viewport 的倉儲後台截圖
- Console 無錯誤
- Network 沒有呼叫 LINE API
- 滑鼠點 `LINE OA 待確認` 後明細變更

講法：

```text
老師這裡用 DevTools / Chrome DevTools MCP 做畫面驗收和截圖。
你們今天不用學 MCP，C4 會再正式介紹。
```

## 3. 推薦截圖順序

### 截圖 A：C2 為什麼不是 prompt 課

畫面：倉儲後台。

標記：

- KPI `LINE OA`
- `LINE OA 待確認`
- 訂單資料表
- 處理佇列

重點句：

```text
這不是叫 AI 做一個新頁面，而是在既有系統裡補一條可驗收規則。
```

### 截圖 B：資料在哪裡

畫面：`web-lab/src/warehouseData.js`

標記：

- `orders`
- `channel: 'LINE OA'`
- `status: '待出貨'`

重點句：

```text
需求不是從 prompt 來，而是從資料欄位來。
```

### 截圖 C：挖洞點

畫面：`web-lab/src/warehouseLogic.js`

標記：

- `getPendingLineOrders(orderItems)`
- `return []`

重點句：

```text
老師已經把 UI 接好，學生今天只補 business rule。
```

### 截圖 D：測試失敗到通過

畫面：terminal

指令：

```bash
cd web-lab
node scripts/check-warehouse-logic.mjs
```

完成前應該失敗；完成後應該通過。

重點句：

```text
測試不是為了炫技，是為了證明這條規則真的從資料算出來。
```

### 截圖 E：部署概念

畫面：terminal + `dist/` 資料夾

指令：

```bash
npm run build
npm run preview
```

重點句：

```text
build 會產出 dist/；deploy 是把 dist/ 放到公開網站平台。
C2 只講概念，正式部署後面再做。
```

## 4. 不建議放進 C2 投影片的畫面

- GitHub Actions YAML 細節
- Chrome DevTools MCP 設定流程
- LINE Channel Access Token
- webhook 設定
- 真送 LINE API
- 任何 `.env` 或 token 畫面

這些會讓 C2 發散，留到 C3/C4 比較穩。
