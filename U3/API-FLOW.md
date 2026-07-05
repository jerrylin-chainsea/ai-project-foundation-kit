# U3 · API / webhook / token / mock-vs-real 圖解

這份圖解只處理一件事：按下「推播 LINE Flex」時，資料到底怎麼走。

## 1. 課堂主線：mock send

```text
Browser / React
  |
  | POST /api/send-line-flex
  | payload: Flex Message JSON
  v
Vite dev middleware
  |
  | 呼叫 line-lab/sendLineAlert.js
  | 讀取 line-lab/.env
  v
LINE sender script
  |
  | LINE_REAL_SEND 不是 1
  v
Mock result
  |
  | 回傳 "[mock] LINE_REAL_SEND is not 1, no request sent."
  v
Browser 顯示推播結果
```

主線驗收看到 `[mock]` 就過關。這代表流程跑完了，而且沒有真的碰 LINE API。

## 2. 真送 LINE：只做進階示範

```text
Browser / React
  |
  | POST /api/send-line-flex
  v
Local backend / Vite middleware
  |
  | 讀 line-lab/.env
  | LINE_REAL_SEND=1
  | LINE_CHANNEL_ACCESS_TOKEN=...
  | LINE_TARGET_ID=...
  v
LINE Messaging API
  |
  | POST https://api.line.me/v2/bot/message/push
  v
LINE OA 收到 Flex Message
```

前端永遠不直接呼叫 `https://api.line.me`，也不會拿到 token。

## 3. webhook 是相反方向

推播是「我們送訊息出去」。webhook 是「LINE 把事件送回來」。

```text
使用者傳訊息給 LINE OA
  |
  v
LINE Platform
  |
  | HTTPS POST webhook event
  v
你的 bot server / n8n webhook / Cloudflare Worker
  |
  v
依事件內容決定要不要回覆或寫入資料表
```

本課 C3 主線不要求學生建 webhook server；只要知道方向與責任邊界。

## 4. 五個名詞

| 名詞 | 在本課的意思 | 學生要會說什麼 |
|---|---|---|
| API | 前端與後端約定好的呼叫入口 | 按推播時打的是 `/api/send-line-flex` |
| payload | 要送出去的結構化資料 | Flex Message 是 JSON，不是隨便一段文字 |
| token | 呼叫外部平台的密鑰 | 只能在 `.env`，不能進前端、不能 commit |
| env var | 不放進程式碼的環境設定 | `LINE_REAL_SEND` 控制 mock 或真送 |
| webhook | 外部平台主動打回來的事件通知 | LINE 使用者傳訊息時，LINE 會 POST 到 webhook URL |

## 5. mock-vs-real 決策表

| 狀態 | `LINE_REAL_SEND` | token | 結果 | 課堂定位 |
|---|---:|---|---|---|
| 預設 | 未設定或不是 `1` | 不需要 | 回 `[mock]` | 主線 |
| 真送準備不足 | `1` | 缺 token 或 target | 擋下或報錯 | 排錯示範 |
| 真送 | `1` | 有 token 與 target | 呼叫 LINE API | 教師 demo / 進階 |

## 6. DevTools 驗收

按 F12 → Network → 重新按一次推播。你要看到：

- Request URL 是 `/api/send-line-flex`
- Method 是 `POST`
- Payload 是 Flex Message JSON
- Response 有 `[mock]` 或 LINE API 結果
- Network 裡沒有前端直接呼叫 `api.line.me`

如果看到 `api.line.me` 從 browser 直接出去，代表 token 邊界錯了。
