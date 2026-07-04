# U3 · STEP 02 ｜ 人工審核（Human-in-the-loop）與按鈕推播

> 通知要送到主管手機上。**系統產出內容、人決定送不送** —— 這就是 Human-in-the-loop。
> 今天最大的改變：推播是**畫面上一顆按鈕**，不是複製指令。

## 1. Button 4：勾選「我已人工審核這則通知內容」

先別勾。看一眼第 5 步「推播中心」的按鈕：**它現在是暗的、按不下去**。

現在認真看一遍第 3 步的 Flex 視覺預覽（就當你是要收這則通知的主管）：
數字對嗎？風險等級 / 訂單狀態合理嗎？altText 看得懂嗎？內容是給人的明確資訊嗎？

確認沒問題 → 勾選 checkbox。**推播按鈕就亮起來了。**

## 2. Button 5：按「推播 LINE Flex」

按下「推播 LINE Flex（營運異常）」。沒設定 token 時，你應該看到：

```
[mock] LINE_REAL_SEND is not 1, no request sent.
```

下面那句：「安全預設：沒設定 token / LINE_REAL_SEND≠1，後端沒有呼叫 api.line.me。」
**看到 `[mock]` 就是對**，不是手機收到 LINE 才是對。

## 3. 按鈕按下去，到底發生了什麼？（打開 F12 看）

按 F12 → **Network** 分頁 → 再按一次「推播 LINE Flex」。你會看到：

```
POST  localhost:5180/api/send-line-flex
  送出的內容：{ "template": "...", "reviewed": true }   ← 沒有 token、沒有收件對象
```

**整個瀏覽器分頁裡，沒有 `api.line.me` 這一支。** 為什麼？

- 瀏覽器只打**自己的後端** `/api/send-line-flex`（這是 dev server 的一小段程式）。
- 真正帶著 token 去打 `api.line.me` 的，是**後端**，token 只留在 `line-lab/.env`。
- 這就是真實產品的正確做法：**前端不持有第三方密鑰**。token 就像家裡鑰匙，不能貼在大門上。

## 4. 想真的送到手機？（有 LINE OA 的同學）

1. 複製 `line-lab/.env.example` 成 `line-lab/.env`。
2. 填入你自己的 `LINE_CHANNEL_ACCESS_TOKEN` 與 `LINE_TARGET_ID`，並把 `LINE_REAL_SEND` 改成 `1`。
3. **重新啟動 `npm run dev`**（重要！改完 `.env` 一定要重啟才生效）。
4. 回 Dashboard 按「推播 LINE Flex」→ 手機真的收到，畫面顯示 `✓ 已真送到你的 LINE OA（LINE API 200）`。

`.env` **不會被 commit**（`.gitignore` 已排除）。**沒有 LINE OA 完全不影響過關 —— 看到 `[mock]` 就是完成。**

## 5. 終端機做的是同一件事（對照，非必做）

推播按鈕做的事，等同終端機這行（老師示範或進階組）：

```bash
node line-lab/sendLineAlert.js --flex            # → [mock]（安全預設）
LINE_REAL_SEND=1 node line-lab/sendLineAlert.js --flex --confirm   # → 真送
```

按鈕與指令走的是**同一條後端 guard 階梯**，只是一個用點的、一個用打的。

→ 下一步：`STEP-03-react-debug.md`，親手把資料弄壞，再用 ReAct 修好。
