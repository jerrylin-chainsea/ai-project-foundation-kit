# U3 · Prompt 卡

## 卡 1 ｜Flex Message 內容審核

```text
請檢查目前 LINE 推播中心的 Flex 視覺預覽。
不要改檔。

請用初學者看得懂的方式判斷：
1. 這張卡片要送給誰
2. 訂單編號、客戶、狀態、金額是否合理
3. 文字看起來像不像真的營運通知
4. 送出前還需要人類確認什麼
5. 可不可以按「推播 LINE Flex」

最後請給我一句可以放進報告的說明。
```

## 卡 2 ｜真送前安全檢查

```text
請幫我做真送前檢查。
不要改檔。
不要要求我把 token 貼給你。

請檢查我應該確認哪些事情：
1. line-lab/.env 是否存在
2. LINE_REAL_SEND 是否應該是 1
3. token 為什麼不能放前端
4. LINE_TARGET_ID 要確認什麼
5. 人工審核 checkbox 的意義是什麼
6. 成功後我要留下哪些驗收證據
```

## 卡 3 ｜ReAct debug（加分，先分析不改檔）

```text
你現在扮演 debugger。
先不要改檔。

目前問題：
LINE 推播中心出現紅色擋牌：risk_level 變成中文「嚴重」，
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

## 卡 4 ｜放行最小修正

```text
同意你的 Minimal Patch。
請只修改必要檔案。
不要新增套件。
不要改 package.json。
不要重構。
修正目標：讓 report.json 重新符合資料合約（risk_level 回到 low / medium / high）。
完成後告訴我：改了哪裡、我要怎麼在畫面和終端機各驗收一次。
```
