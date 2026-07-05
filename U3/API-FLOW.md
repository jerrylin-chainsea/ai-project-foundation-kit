# U3 · 真 LINE OA 推播流程圖

這份只講必要邊界，不把 C3 上成 API 課。

## 1. 今天的真送主線

```text
訂單資料 data-lab/orders.json
  ↓
LINE 推播中心產生 Flex Message
  ↓
人工審核 checkbox
  ↓
老師寫好的送出橋接
  ↓
讀取 line-lab/.env 的 LINE OA 設定
  ↓
LINE OA / 群組 / 手機真的收到 Flex Message
```

學生要記住的是：

- Flex Message 是 LINE 卡片的資料結構
- token 不能放在前端
- 真送前要有人審核內容

## 2. token 放哪裡

token 只放在：

```text
line-lab/.env
```

不要放：

- React component
- `data-lab/*.json`
- 簡報截圖
- Git commit
- 學習報告

## 3. 如果看到 mock

看到：

```text
[mock] LINE_REAL_SEND is not 1, no request sent.
```

代表流程有跑，但不是今天主線。

請回去檢查：

- `line-lab/.env` 是否存在
- `LINE_REAL_SEND=1`
- token / target 是否填好
- 是否已重啟 `npm run dev`

## 4. webhook 只講一句

今天做的是「我們主動把訊息推播出去」。

webhook 則是相反方向：使用者傳訊息給 LINE OA 時，LINE 把事件送回你的系統。

C3 不做 webhook server。
