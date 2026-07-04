# U3 · 卡住了？先看這裡

## 畫面類

| 狀況 | 解法 |
|---|---|
| 整個畫面變成紅底錯誤（Vite overlay） | 你改壞了 JSON **語法**（多半是引號或逗號）。把資料檔改回原樣存檔即恢復。本堂練習只改「值」，不改語法 |
| 改了 report.json / orders.json 畫面沒反應 | 確認存檔；dev server 還在跑；重新整理頁面再看一次 |
| 擋牌沒出現 | 確認你改的是對的資料檔、值真的不在 low/medium/high 內 |
| 按鈕是灰的按不了 | 前面的步驟還沒完成 —— 照 1→2→3→4 的順序來，合約沒過或沒勾人審時後面鎖住是**正常設計** |
| 「推播 LINE Flex」按鈕是暗的 | 要先生成 Flex 預覽、**勾選**人工審核 checkbox，而且合約要是通過狀態 |
| 切換範本後前面的勾都不見了 | 正常：切範本會重置流程，因為換了一份資料合約 |

## 推播 / 後端類

| 狀況 | 解法 |
|---|---|
| 按推播後回 `network error` / 沒反應 | 你可能在 `npm run build`/`npm run preview` 模式 —— 那沒有後端。回到 `npm run dev`（後端只在 dev 存在） |
| 設好 `.env` 卻還是 `[mock]` | `LINE_REAL_SEND` 沒設成 `1`，或**改完 `.env` 忘了重啟 `npm run dev`**（伺服端只在啟動時讀一次） |
| 真送回 `line_api_error` 401/403 | token 錯或過期。看 status code 與 response body 就好，這本身就是學習點；token 重發到 LINE Developers Console |
| 沒有 LINE OA / 不知道 targetId | **不用處理**。看到 `[mock]` 就過關 |

## 終端機類（對照用）

| 狀況 | 解法 |
|---|---|
| `LINE_REAL_SEND=1 node ...` 在 PowerShell 報錯 | PowerShell 語法不同：`$env:LINE_REAL_SEND="1"; node line-lab/sendLineAlert.js --flex --confirm` |
| 跑完真送測試後，之後每次都想真送 | PowerShell 的環境變數會留著：`Remove-Item Env:LINE_REAL_SEND` 清掉 |
| `node` 找不到 | 裝 Node.js LTS；裝完重開終端機 |
| 想把 token 貼進程式碼「先動起來」 | 停。token 只能放 `line-lab/.env`，這是紅線 |

## AI 類

| 狀況 | 解法 |
|---|---|
| AI 修錯時想順便重構 | 不放行。貼：「只做 Minimal Patch，其他都不要動。」 |
| AI 想改 `reportContract.js`、`sendLineAlert.js` 或 `vite.config.js` | 本堂不允許 —— 它們是老師寫好的雙胞胎與後端，改了會讓畫面/腳本/推播不同步 |
| AI 把資料手寫進 Dashboard.jsx | 不放行。資料只有兩個來源：`report.json`、`orders.json` |

> 原則：**今天看到 `[mock]` 才算對，不是手機收到 LINE 才算對**（真送是加分）。
