# 04 · Debug(用 ReAct 修錯:先想、再做、再看)

**什麼時候用:** 程式跑出來不對。例如 Dashboard 出現紅色擋牌、或 `node line-lab/sendLineAlert.js --flex` 報「資料合約錯誤」。

**ReAct = Reason(先想)+ Act(做一個動作)+ Observe(看結果)。**
**你要練的不是「會修 bug」,而是「只修規格違反,不順手重構」。**

**第一步:先別改,先分析。複製這段(`<>` 換成你看到的錯誤):**

```
你現在扮演 debugger。
先不要改檔。

目前問題:
<固定錯誤描述,例如:Dashboard 出現紅色擋牌,risk_level 變成「嚴重」,
但資料合約規定只能是 low / medium / high>

請用以下格式回答:
Expected:正確行為應該是什麼
Actual:目前實際發生什麼
Reason:你推測的原因
Act:你要查看哪些檔案 / 執行哪些指令
Observe:你預期看到什麼證據
Minimal Patch:你建議的最小修改
Verify:修正後的驗收方式
Blocker:哪裡需要人類決定
```

**人審重點:** 看它的 Minimal Patch —— 是「把資料改回合約允許值」這種最小修正,
還是想「順便」改邏輯、改畫面、加功能?後者不要放行。

**第二步:分析合理,才放行。複製這段:**

```
同意你的 Minimal Patch。
請只修改必要檔案。
不要新增套件。
不要改 package.json。
不要重構。
完成後告訴我:改了哪裡、我要怎麼在畫面和終端機各驗收一次。
```

> 修好後兩邊都驗:畫面擋牌消失、`node line-lab/sendLineAlert.js --flex` 恢復 mock 成功。
> Expected 和 Actual 分不清的時候,你修的就不是 bug,是在重新設計需求 —— 停下來問人。
