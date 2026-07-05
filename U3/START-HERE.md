# U3 · START HERE ｜做一則真的會送到 LINE OA 的 Flex Message

這堂課的重點不是背 API 名詞。

今天要做的是一個看得到、收得到、能拿去展示的成果：

```text
從訂單資料 → 生成 LINE Flex Message → 人工審核 → 真正推播到 LINE OA
```

你會稍微看懂前端、後端、token 的邊界，但不會把這堂課上成 API 細節課。

## 0. 今天會完成什麼

你會送出一則真正的 LINE OA Flex Message。

主線使用：

- `訂單可視化`：看訂單資料怎麼變成畫面
- `LINE 推播中心`：把訂單資料變成 Flex Message
- `line-lab/.env`：放 LINE OA 的推播設定

老師會提供課堂用 LINE OA 的設定值，或示範一組可真送的環境。

## 1. 先設定真送環境

複製：

```text
line-lab/.env.example
```

成：

```text
line-lab/.env
```

填入老師提供的三個值：

```env
LINE_CHANNEL_ACCESS_TOKEN=老師提供
LINE_TARGET_ID=老師提供
LINE_REAL_SEND=1
```

注意：

- `.env` 不要 commit
- 改完 `.env` 後要重啟 `npm run dev`
- token 不要貼到前端、不貼到簡報、不貼到報告

## 2. 啟動專案

```bash
cd web-lab
npm install
npm run dev
```

打開本機網址後，先看兩個地方：

- `訂單可視化`
- `LINE 推播中心`

## 3. 先看訂單怎麼變成畫面

進 `訂單可視化`。

你要看懂一件事：

```text
訂單資料的 status / zone / amount / eta
會變成畫面上的狀態、位置、金額與時間
```

這裡可以讓學生感覺到：資料不是死表格，資料會變成互動畫面。

## 4. 製作 Flex Message

進 `LINE 推播中心`。

選：

```text
訂單資訊
```

照按鈕順序走：

```text
載入範例資料 → 檢查資料合約 → 生成 Flex 預覽 → 人工審核 → 推播 LINE Flex
```

這裡不要先講一堆 API。

先讓學生看到：原來一筆訂單可以變成一張 LINE 卡片，而且真的能送出去。

## 5. 真送前的人審

推播前一定要勾：

```text
我已人工審核這則通知內容
```

人審不是形式。

學生要看：

- 客戶名稱是否合理
- 訂單狀態是否合理
- 金額與 ETA 是否合理
- 是否真的可以送給這個對象

## 6. 送出後驗收

成功時要留下三個證據：

- LINE OA / 群組 / 手機真的收到 Flex Message
- 畫面顯示已送出
- `npm run build` 通過

## 7. 只需要懂的三句工程概念

1. Flex Message 是 LINE 卡片的資料結構，不是一段普通文字。
2. token 是 LINE OA 的鑰匙，只能放在 `.env`，不能放前端。
3. 前端按鈕只負責把資料交出去，真正送 LINE 的橋接程式已經由老師寫好。

## 8. 下一步

照順序看：

1. `STEP-01-dashboard-buttons.md`
2. `STEP-02-hitl-review.md`
3. `API-FLOW.md`
4. `ACCEPTANCE.md`

`STEP-03-react-debug.md` 是加分排錯練習，不是主線。
