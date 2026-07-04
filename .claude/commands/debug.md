---
description: 用 ReAct 修錯——先分析(不改)，同意後只改必要檔
argument-hint: [錯誤訊息或現象，例如：Dashboard 出現資料合約錯誤的紅色擋牌]
---

我遇到一個錯誤：$ARGUMENTS

請**先不要修改任何檔案**。先用 ReAct 的方式分析：

1. 這個問題可能是什麼意思
2. 可能原因有哪些
3. 可能相關的檔案
4. 你會怎麼確認問題（例如跑哪個指令、看哪一行）
5. 建議的修正方式

我看過你的分析、覺得合理，才會回你「同意，請修」。
你修的時候：只改必要檔案、改完告訴我改了哪裡、為什麼、我要怎麼確認修好了。

> 參考本專案的教學用固定錯誤：`data-lab/report.json` 的 risk_level 只能是 low / medium / high，
> 違反時 Dashboard 會出現擋牌、`node line-lab/sendLineAlert.js --flex` 會在送出前阻擋。
