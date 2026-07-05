# U3 · STEP 02 ｜製作、審核、真送 LINE Flex

先確認你已經完成：

```text
U3/START-HERE.md 的 .env 設定
```

這一步會真的推播 LINE OA，不是只看 mock。

## 1. Button 1：載入資料

在「LINE 推播中心」選：

```text
訂單資訊
```

按：

```text
載入範例資料
```

你應該看到畫面出現訂單資料，例如：

- 訂單編號
- 客戶
- 通路
- 狀態
- 金額
- 商品明細

## 2. Button 2：檢查資料合約

按：

```text
檢查資料合約
```

綠色通過代表這筆資料可以拿來做 Flex Message。

如果沒有通過，不要硬送。先看錯誤訊息。

## 3. Button 3：生成 Flex 預覽

按：

```text
生成 Flex 預覽
```

你會看到 LINE 卡片大概長什麼樣。

這裡要檢查：

- 客戶名稱是否正確
- 金額是否正確
- 訂單狀態是否正確
- 卡片文字是否像人會看得懂的通知

## 4. Button 4：人工審核

先不要勾 checkbox。

你會看到推播按鈕不能按。

確認內容沒問題後，勾：

```text
我已人工審核這則通知內容
```

這一步的意思是：AI 可以幫你產生，但最後送出前仍要有人負責。

## 5. Button 5：推播 LINE Flex

按：

```text
推播 LINE Flex
```

主線成功時，你應該真的在 LINE OA / 群組 / 手機上收到 Flex Message。

畫面也應該顯示已送出。

如果看到 `[mock]`，代表 `.env` 沒有進入真送模式。回去檢查：

- `line-lab/.env` 是否存在
- `LINE_REAL_SEND=1`
- token 與 target 是否已填
- `npm run dev` 是否有重啟

## 6. 最少要懂的邊界

這不是 API 細節課，但你要知道：

```text
畫面按鈕 → 專案裡老師寫好的送出橋接 → LINE OA
```

前端畫面不應該拿到 token。

token 只放在：

```text
line-lab/.env
```

## 7. 終端機驗收

真送前，也可以用終端機確認橋接程式可以跑：

```bash
node line-lab/sendLineAlert.js --flex --confirm
```

最後確認專案能 build：

```bash
cd web-lab
npm run build
```

下一步：`ACCEPTANCE.md`。
