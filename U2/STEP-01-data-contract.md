# U2 · STEP 01 ｜ 資料合約：整個作品只有一份資料

> **這堂完成物**：看得懂資料合約、會用 planner 先出計畫、會用 allowed files 和人審把 AI coding agent 管在範圍內。
> **你現在在流水線**：`專案跑起來 → 【檢查資料 → 資料合約】→ AI 串接 → Dashboard → 修錯 → 驗收 → 交付`

## 1. 打開唯一的資料來源

打開 `data-lab/report.json`：

```json
{
  "report_date": "…",
  "risk_level": "high",
  "total_revenue": 128400,
  "anomaly_count": 5,
  "top_product": "耳掛咖啡",
  "top_channel": "LINE",
  "action_items": ["…", "…"]
}
```

這份檔就是「**資料合約**」：欄位固定、值有規則，給程式讀的，不是自由作文。

**合約規則（背這一條就好）**：`risk_level` 只能是 `low / medium / high`。

## 2. 資料合約 vs 自由作文

| | 自由作文 | 資料合約 |
|---|---|---|
| 欄位 | 每次不一樣 | 固定七欄 |
| 值 | 想寫什麼寫什麼 | `risk_level` 只有三種值 |
| 下游 | 人要重新看懂 | 程式可以直接接手（畫面、通知） |

**同一份 report.json，餵給兩個下游**：

```
data-lab/report.json ──► web-lab Dashboard（畫面）
                     └─► line-lab/sendLineAlert.js（LINE 通知）
```

親眼確認一次：啟動專案 → 切到「營運異常 Dashboard」→ 按「載入範例 report.json」。
畫面上的數字，就是你剛剛打開的那份檔 —— **畫面沒有另存一份資料**。

## 3. 為什麼要合約？

因為 U3 會發生這件事：有人把 `risk_level` 改成中文「嚴重」。
沒有合約 → 錯誤資料一路流到 LINE 通知，主管看到亂七八糟的訊息。
有合約 → 畫面出現紅色擋牌、通知在送出前被阻擋。**合約就是防線**。

→ 下一步：`STEP-02-workflow.md`，讓 AI 在 Dashboard 裡加一個倉儲推播準備功能，但只能改允許檔案。
