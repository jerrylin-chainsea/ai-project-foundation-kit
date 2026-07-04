# U2 · STEP 02 ｜ 今日工作流：planner → 人審 → implementer → reviewer

> 你不用會寫程式。你只要會看三件事：**它要改哪些檔、會不會越界、驗收怎麼做**。

## 0. 先痛一次：AI 為什麼需要守則

老師會示範一次「沒有護欄的 AI」：只叫它加一個倉儲提示，它順手改路由、裝套件、重排整個版面。
記住那個 diff 的樣子 —— 這就是為什麼專案裡有 `AGENTS.md` / `CLAUDE.md`（AI 的工作守則檔），
以及為什麼每次動手前都要先跑 planner。

**花 60 秒打開專案根目錄的 `AGENTS.md` 看一眼**：工作順序、永遠禁止、各堂允許檔案、DoD ——
之後 AI 每次越界，你都可以指著這份檔把它拉回來。

## 1. 今日固定流程（之後每堂都一樣）

```
你提需求 → 🧠 planner 出計畫（不改檔）
        → 🙋 你人審計畫（四題防呆）
        → 🔧 implementer 照計畫改（只改允許檔案）
        → 🔍 reviewer 檢查 diff
        → ✅ 你看畫面 + diff → commit
```

## 2. 實際走一輪（任務固定，全班一樣）

**任務**：在「營運異常 Dashboard」的載入結果下方，新增一個「低庫存推播準備」小區塊，列出三件事：

1. 推播主題：低庫存補貨提醒
2. 推播通道：LINE OA Flex Message
3. 下一步：到 U3 由人工審核後 mock 送出

**本堂允許檔案**：

```text
web-lab/src/Dashboard.jsx
web-lab/src/styles.css（只准在 Dashboard 區塊追加樣式）
```

1. 切到 **Plan mode**（`shift+tab`），貼 `PROMPT-CARD.md` 的 **planner 卡**。
2. AI 回計畫後，**先不要同意**。用四題防呆自問：
   - 它要改的檔案，在允許清單內嗎？
   - 有沒有要新增套件？
   - 有沒有要動 `package.json`？
   - 有沒有重構傾向（「順便幫你整理…」）？
3. 四題都安全 → 切離 Plan mode，貼 **implementer 卡**。
4. AI 回報完成後，照它的回報逐項對：Dashboard 看到新區塊？`git status` 只有允許檔案？`git diff` 沒動資料合約與 LINE 腳本？
5. 都對 → `cd web-lab && npm run build` → `git add .` → `git commit -m "新增低庫存推播準備區塊"`。

## 3. 第二輪需求變更（重點：仍走同一流程）

老師會再給一個小變更（例如把「推播通道」改成「LINE OA Flex + 手動審核」）。**不管改動多小，流程一樣**：
planner → 人審 → implementer → 驗收。這就是「可交付」和「碰運氣」的差別。

## 這一步的完成定義

- ✅ 你拿到過一份「會改哪些檔」的計畫，而且否決權在你手上
- ✅ 修改只落在 Dashboard 允許檔案內
- ✅ diff 乾淨、build 通過、commit 完成

> **收束一句**：AI 不是不能改，是**不能一開始就改**。你驗收過，才算完成。
