# U3 · STEP 03 ｜ 弄壞資料合約，再用 ReAct 修好

> ReAct = Reason → Act → Observe。先想清楚，再做一步，再看證據。

## 1. 製造指定錯誤

打開 `data-lab/report.json`，把：

```json
"risk_level": "high",
```

改成：

```json
"risk_level": "嚴重",
```

只改值，不改逗號與引號。

## 2. 看擋牌出現

回到「LINE 推播中心」。

你應該看到紅色擋牌：

```text
資料合約錯誤: risk_level 必須是 low / medium / high，目前是 "嚴重"
```

Flex 預覽與推播會被擋下。

## 3. 終端機對照

```bash
node line-lab/sendLineAlert.js --flex
```

同一份壞資料也會讓 CLI 擋下。這代表畫面與通知腳本使用同一套合約防線。

## 4. 貼 ReAct debug 卡

貼 `PROMPT-CARD.md` 的 ReAct debug 卡。AI 只能分析，不可直接改檔。

人審重點：Minimal Patch 應該只是把 `risk_level` 改回 `low / medium / high`，不是改驗證規則。

## 5. 放行最小修正

貼放行卡，或你自己把值改回：

```json
"risk_level": "high",
```

再驗收：

```bash
node line-lab/sendLineAlert.js --flex
cd web-lab
npm run build
```

最後看 `git diff`，確認只有預期變更。
