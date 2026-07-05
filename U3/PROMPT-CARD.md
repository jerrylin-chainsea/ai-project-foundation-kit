# U3 · Prompt 卡

## 卡 1 ｜ API 邊界解釋

```text
請根據 U3/API-FLOW.md 和目前專案，
用初學者聽得懂的方式解釋：
1. 按「推播 LINE Flex」時資料怎麼走
2. payload 是什麼
3. token 為什麼不能放在前端
4. mock send 和 real send 差在哪
5. webhook 和 push API 的方向差在哪

不要改檔。
請最後給我一句可以放進報告的總結。
```

## 卡 2 ｜ Human-in-the-loop 審核

```text
請檢查目前 LINE 推播中心的 Flex 視覺預覽。
不要改檔。

請判斷：
1. 通知類型與對象
2. 內容有沒有明顯錯誤
3. 是否需要人工確認
4. 可不可以按「推播 LINE Flex」
5. 如果不能送，原因是什麼
```

## 卡 3 ｜ ReAct debug（先分析，不改檔）

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

## 卡 4 ｜ 放行最小修正

```text
同意你的 Minimal Patch。
請只修改必要檔案。
不要新增套件。
不要改 package.json。
不要重構。
修正目標：讓 report.json 重新符合資料合約（risk_level 回到 low / medium / high）。
完成後告訴我：改了哪裡、我要怎麼在畫面和終端機各驗收一次。
```
