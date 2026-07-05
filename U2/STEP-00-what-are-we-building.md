# U2 · STEP 00 ｜這堂到底在做什麼

> 一句話：C2 教的是「用 AI agent 做有紀律的開發流程」，不是「貼 prompt 讓 AI 幫你改字」。

## 1. C1 到 C2 的差別

C1 的重點是進入專案：

- 用 VS Code 看專案
- 用 terminal 跑指令
- 用 Git / GitHub 做版本控制
- 知道 Claude Code / Codex 是 coding agent

C2 開始，才真的讓 AI 修改專案。但修改前要先建立規則。

```text
C1：我會打開專案、跑起來、看懂基本工具
C2：我會控制 AI，在指定範圍內完成一個可驗收修改
```

## 2. 為什麼不是直接貼 prompt

如果你只貼一句：

```text
幫我把倉儲後台加上 LINE OA 訂單提醒
```

AI 可能會：

- 改到不該改的檔案
- 新增不需要的套件
- 重寫 UI，結果 C3 接不起來
- 寫死假資料，看起來有畫面但驗收不了
- 把 C3 才要做的 LINE API / token 提前亂接

所以 C2 的重點不是「AI 多會寫」，而是「人怎麼管住 AI」。

## 3. 今天的開發流程

```text
先看現況
  -> 拆需求
  -> 讀 AGENTS.md / CLAUDE.md
  -> 進 Plan Mode
  -> 人類審核 A-F 計畫
  -> implementer 做最小修改
  -> 測試腳本 / 畫面 / diff / build
  -> reviewer Pass 或 Block
  -> commit
```

這就是受控 vibe coding。

## 4. 今天做的需求

營運主管提出需求：

```text
倉儲後台要看得出目前有哪些 LINE OA 訂單尚未出貨，
讓客服可以先確認收件人與 ETA。
```

這句話不能直接丟給 AI 寫。要先拆成：

| 面向 | 拆解 |
|---|---|
| 資料 | 訂單資料表 `orders` |
| 欄位 | `channel`、`status`、`id`、`customer`、`eta`、`amount` |
| 規則 | `channel === 'LINE OA'` 且 `status !== '已出貨'` |
| 畫面 | KPI、LINE OA 待確認明細、action queue |
| 驗收 | 三個畫面都被同一條規則帶動；diff 只動允許檔案；build 通過 |

## 5. 今天不是要做什麼

C2 不做這些：

- 不真的串 LINE API
- 不放 token
- 不碰 webhook
- 不做完整部署自動化或 CI/CD
- 不把部署平台設定完
- 不讓 AI 重寫整個後台

C2 會補「測試」和「部署概念」，但只到這個程度：

- 測試：用測試腳本、畫面、diff、build 證明功能成立。
- 部署概念：知道 source code 需要 build 成 `dist/`，再交給 hosting 平台；正式公開部署留到後面課程。

下一步：[`STEP-01-controlled-vibe-coding.md`](./STEP-01-controlled-vibe-coding.md)。
