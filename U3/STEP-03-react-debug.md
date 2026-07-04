# U3 · STEP 03 ｜ 弄壞它，再用 ReAct 修好它

> ReAct = Reason（先想）→ Act（做一步）→ Observe（看結果）。
> 你要練的不是「會修 bug」，而是「**只修規格違反，不順手重構**」。

## 1. 製造指定錯誤（改值，不改語法！）

打開 `data-lab/report.json`，把：

```json
"risk_level": "high",
```

改成：

```json
"risk_level": "嚴重",
```

存檔。**注意**：只改引號內的值。逗號、引號都不要動（動到語法會出現 Vite 的全螢幕錯誤，那是另一種錯，改回來就好）。

## 2. 看擋牌自己出現

**不用按任何按鈕**，切回瀏覽器看 Dashboard：

- 紅色擋牌出現：`資料合約錯誤: risk_level 必須是 low / medium / high，目前是 "嚴重"`
- Flex 視覺預覽、推播按鈕**全部關閉** —— 合約沒過，下游全部被擋（按推播也只會回 `contract_error`）

終端機對照：跑 `node line-lab/sendLineAlert.js --flex`，**同一句錯誤**出現在終端機。
一份合約、兩道防線（畫面 + 腳本），這就是 U2 說的「合約就是防線」。

## 3. 貼 ReAct 卡（先分析，不改檔）

貼 `PROMPT-CARD.md` 的 **ReAct debug 卡**。

**你應該看到**：AI 按 Expected / Actual / Reason / Act / Observe / Minimal Patch / Verify / Blocker 格式回答，而且**沒有改任何檔**。

**人審重點**：它的 Minimal Patch 是「把 report.json 的值改回合約允許值」嗎？
如果它想「順便」改驗證邏輯、改畫面、加功能 —— 那就是越界，不要放行。

## 4. 放行最小修正

貼 **放行卡**。AI 把 `risk_level` 改回 `high`（或由你手動改回，一行的事）。

**你應該看到**：擋牌消失、綠色通過回來、Flex 視覺預覽與推播按鈕重新出現。

## 5. 收尾：build + diff + commit

```bash
cd web-lab
npm run build
cd ..
git status
git diff
git diff -- web-lab/package.json
git add .
git commit -m "完成 Dashboard 通知流程與 ReAct 修錯練習"
```

**你應該看到**：build 綠色通過；diff 只有本堂預期變更；`git diff -- web-lab/package.json` **沒有輸出**。

> **收束一句**：今天你看到 Flex payload、看到 `[mock]`、看到擋牌出現又消失、build 通過、diff 乾淨 —— 這就是「平台功能能交付」的完整證據。
