# U3 · Prompt 卡

只複製貼上，不自由改需求。

## 卡 1 ｜ Human-in-the-loop 審核（AI 只判斷，不改檔）

```text
請檢查目前推播中心的通知內容（Dashboard Flex 視覺預覽裡的欄位與內容）。
不要改檔。
請判斷這則通知是否適合送出，並列出：
1. 通知類型與對象
2. 內容有沒有明顯錯誤或不該送的資訊
3. 是否需要人工確認
4. 可不可以按「推播 LINE Flex」
```

**驗收**：AI 沒改檔、有明確說是否需要人工確認、沒有直接叫你送出。

## 卡 2 ｜ ReAct debug（先分析，不改檔）

```text
你現在扮演 debugger。
先不要改檔。

目前問題：
Dashboard 出現紅色擋牌：risk_level 變成中文「嚴重」，
但資料合約規定只能是 low / medium / high。

請用以下格式回答：
Expected：正確行為應該是什麼
Actual：目前實際發生什麼
Reason：你推測的原因
Act：你要查看哪些檔案 / 執行哪些指令
Observe：你預期看到什麼證據
Minimal Patch：你建議的最小修改
Verify：修正後的驗收方式
Blocker：哪裡需要人類決定
```

**驗收**：先分析、不改檔；Minimal Patch 只處理合約違反，不重構、不加功能。

## 卡 3 ｜ 放行最小修正

```text
同意你的 Minimal Patch。
請只修改必要檔案。
不要新增套件。
不要改 package.json。
不要重構。
修正目標：讓 report.json 重新符合資料合約（risk_level 回到 low / medium / high）。
完成後告訴我：改了哪裡、我要怎麼在畫面和終端機各驗收一次。
```

**驗收**：擋牌消失、`node line-lab/sendLineAlert.js --flex` 恢復 mock 成功、diff 只有 `report.json` 一行。

## 卡 4 ｜（進階組加做）請 AI 擴充 Dashboard

```text
你現在扮演 implementer。
任務：在 Dashboard 的 reviewer checklist 區塊，新增一項「<你想加的檢查項>」。

限制：
1. 只能修改：web-lab/src/Dashboard.jsx
2. 不要新增套件、不要改 package.json、不要重構
3. 不要動 reportContract.js（它和 line-lab/sendLineAlert.js 是雙胞胎）

完成後請固定回報：
A. 實際修改的檔案
B. 每個檔案改了什麼
C. 哪裡對應到資料合約
D. 我現在要怎麼手動驗收
E. 哪些地方你沒有改
```

> 完整版在 `prompts/04-debug.md`（ReAct）；本堂允許檔案清單見 `STEP-01-dashboard-buttons.md`。
