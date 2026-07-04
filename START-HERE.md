# START HERE ｜ M11 · AI 驅動開發與平台整合實作課

歡迎！這份資料夾就是你四堂課的全部練習材料。**整門課只做一個作品**：

> **用 AI 完成一個「倉儲營運 Dashboard + LINE OA Flex 推播 + ops agent 自動化」：資料合約驅動畫面與通知 payload，
> 通過人工審核、ReAct 修錯、reviewer 檢查、GitHub Actions、build、commit，完成一次真正的交付。**

## 你現在在哪條流水線

```
資料進來 → 檢查資料 → 資料合約 → AI coding agent 改功能
      → Dashboard 呈現 → LINE Flex 推播 → ops agent 自動化
      → GitHub Actions → reviewer 驗收 → build / commit / push
```

| 堂 | 你會推進到哪裡 | 打開哪個資料夾 |
|---|---|---|
| U1 | 專案跑起來、看到最終成果、第一次修改與 commit | [`U1/`](./U1/) |
| U2 | 用 planner → 人審 → implementer 管住 AI coding agent，做倉儲後台小功能 | [`U2/`](./U2/) |
| U3 | 用 Codex/Claude Code 接 LINE OA Flex：載入 → 檢查 → 預覽 → 審核 → mock | [`U3/`](./U3/) |
| U4 | CrewAI-style ops agent + GitHub Actions + reviewer/build/Skill/MCP | [`U4/`](./U4/) |

每個資料夾裡都是同樣四種檔案：`STEP-*.md`（照著做）、`PROMPT-CARD.md`（直接複製貼上）、
`ACCEPTANCE.md`（怎樣算過關）、`PITFALL.md`（卡住先看這裡）。

## 完成的定義（DoD）—— 整門課只有這一條

> **AI 做出來不算完成。**
> **通過驗收才算完成。**
> **驗收包含：畫面 ／ 輸出 ／ diff ／ build ／ human review。**

每一堂、每一步，做完先問自己這五個字：畫面、輸出、diff、build、人審。

## 一鍵啟動

- **Windows**：雙擊 [`start-m11.bat`](./start-m11.bat)
- **macOS**：雙擊 [`start-m11.command`](./start-m11.command)（第一次被擋就右鍵 → 打開；或在終端機跑 `bash start-m11.command`）

第一次會自動安裝套件（約 1–2 分鐘），然後瀏覽器會自動打開 <http://localhost:5180>。
你會看到「海風小店」首頁；點上方的「營運異常 Dashboard」，就是你這門課要完成的作品主畫面。

不想用一鍵啟動？等價指令只有一組：

```bash
cd web-lab
npm install   # 只有第一次需要
npm run dev
```

## 你只要看三個地方

**左邊檔案樹**、跟 AI 講話的**對話框**、跑指令的**終端機**。其他都先忽略。

## 資料夾地圖

```text
ai-project-foundation-kit/
  START-HERE.md      ← 你在這裡
  start-m11.bat      ← Windows 一鍵啟動
  start-m11.command  ← macOS 一鍵啟動
  U1/ U2/ U3/ U4/    ← 每堂課的步驟、prompt 卡、驗收、保底
  web-lab/           ← 作品本體：海風小店 + 營運異常 Dashboard
  data-lab/          ← report.json：整個作品的唯一資料來源（資料合約）
  line-lab/          ← LINE OA Flex 通知腳本（mock 優先，真送要雙重確認）
  ops-agent-lab/     ← CrewAI-style 角色流程：庫存檢查 → 決策 → 推播文案
  .github/workflows/ ← GitHub Actions：排程產 report 與 Flex payload
  prompts/           ← 固定 prompt 卡的完整版
  .claude/           ← Claude Code commands / skills
```

## 安全三句（先記起來）

1. token 只放 `line-lab/.env`，不進程式碼、不進前端、不 commit。
2. 預設都是 mock；真送 LINE 需要 `LINE_REAL_SEND=1` **加** `--flex --confirm`，而且只在終端機發生。
3. AI 改完不要急著高興：先看畫面、看輸出、看 diff、跑 build，人審過了才算數。
