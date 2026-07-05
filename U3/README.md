# U3 ｜訂單可視化到 LINE OA Flex 真推播

學生請先看：

```text
U3/START-HERE.md
```

這堂課的成果是一則真的送到 LINE OA 的 Flex Message。

主線不是 API 細節課，而是讓學生看到：

```text
訂單資料 → 互動畫面 → Flex Message → 人工審核 → LINE OA 真推播
```

## 檔案用途

| 檔案 | 用途 |
|---|---|
| `START-HERE.md` | 學生主線入口 |
| `STEP-01-dashboard-buttons.md` | 從訂單可視化進到 Flex Message |
| `STEP-02-hitl-review.md` | 製作、審核、真送 LINE Flex |
| `API-FLOW.md` | 只講必要邊界：Flex、token、送出橋接 |
| `PROMPT-CARD.md` | Flex 內容審核與真送前安全檢查 |
| `ACCEPTANCE.md` | 完成定義 |
| `PITFALL.md` | 卡住時看這裡 |

## 老師備課提醒

U3 主線需要一組可用的 LINE OA 設定：

- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_TARGET_ID`
- `LINE_REAL_SEND=1`

不要把 token 放進 repo、簡報截圖或學生報告。
