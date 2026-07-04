---
description: 依目前 git diff 產生一句清楚的 commit 訊息(講改了什麼、為什麼)
---

請先看目前的變更（先跑 `git status` 和 `git diff --staged`，若沒有 staged 就看 `git diff`），
然後**只產生一則 commit 訊息**，不要真的 commit、不要改任何檔。

格式：
- 第一行：一句 summary（動詞開頭、講「改了什麼」，50 字內）
- 空一行
- 選填：2–3 點說明「為什麼這樣改 / 影響範圍」

範例 summary：`修正 risk_level 輸出格式，改回 low/medium/high`

最後把可直接使用的指令印出來，例如：
`git commit -m "修正 risk_level 輸出格式，改回 low/medium/high"`
