# U2 · STEP 03（加映，可跳過）｜ 把 planner/reviewer prompt 存成 sub-agent + 裝 Claude HUD

> **這一步是加映**，大約 20 分鐘，不算進 C2 的必過關卡。時間不夠可以直接跳過，回 [`ACCEPTANCE.md`](./ACCEPTANCE.md) 收尾；有時間再回來做。

## 1. 先看 `/agents` 面板，只看位置不建立

在 Claude Code 輸入：

```text
/agents
```

你會看到三個位置：

- **Running**：目前正在跑的背景 agent（通常是空的）
- **Library**：可以用的 agent，分 user / project / built-in
- **Create new agent**：把 prompt 固化成 agent 的入口

## 2. 建立 Project agent：直接沿用剛剛的 planner/reviewer prompt

選 **Create new agent** → 位置選 **Project (.claude/agents/)** → 生成方式選 **Generate with Claude**。

描述 agent 任務時，不用重新想措辭，直接沿用 `PROMPT-CARD.md` 卡 1（planner）和卡 3（reviewer）的內容：

```text
請建立一個 beginner-ai-project-workflow agent。

when to use：初學者要 AI 讀專案、規劃、驗收 starter project 時。

behavior（直接沿用卡 1 planner + 卡 3 reviewer）：
- planner 階段：先讀 AGENTS.md / CLAUDE.md / 相關檔案，只回 A-F 計畫，不改檔。
- 人審通過後才 implement，且只改允許檔案。
- 完成後用 reviewer 卡檢查：Verdict / Changed Files / Scope Check / Package Check / Data Check / Next Step。
```

## 3. 工具權限與記憶：先保守

- **Tools**：planner / reviewer 用途優先選 **read-only**（只讀規格、看 diff、回 PASS/BLOCK）；不需要 edit tools。
- **Memory**：選 **Project scope**（`.claude/agent-memory/`），讓這個 repo 的流程被記住，不污染你個人的全域設定。
- **Confirm and save** 前檢查三件事：名稱要說明用途（不要叫 test-agent）、位置是 `.claude/agents/`、警告不是錯誤（它提醒你權限和 prompt 長度）。

## 4. 打開存下來的檔案，看懂每個欄位是做什麼用的

存檔後，打開 `.claude/agents/beginner-ai-project-workflow.md`。這一步只看檔案「結構」在幹嘛，不用細讀裡面每一句行為指示：

| 欄位 | 是做什麼用的 |
|---|---|
| `name` | 這個 agent 的識別名稱，之後用 `@agent-名稱` 呼叫它 |
| `description` | 什麼情境該叫它、附上例子——Claude 會依這段自動判斷要不要用它 |
| `model` | 這個 agent 執行時要用哪個模型 |
| `memory` | 記憶存在 project 層級還是使用者層級 |
| 下面的內容 | 兩個 `---` 之間是 frontmatter；再往下全部都是這個 agent 的行為指示，等於一份永久保存的 system prompt，每次被呼叫都會先讀這段 |

## 5. 實際呼叫一次

```text
@agent-beginner-ai-project-workflow 請檢視 web-lab，告訴我備料控制台的資料從哪裡來。
```

**可以交給 agent**：讀專案、整理檔案用途、檢查 prompt 是否符合 U2 範圍。
**不能交給 agent**：自動放行 implementer、自動 commit、跳過人審或驗收——這些永遠要你自己拍板。

## 6. 裝 Claude HUD（選用）

Claude HUD 是 Claude Code 的 statusline plugin，會把 context、usage、active tools、running agents 與 todo progress 顯示在輸入框下方，讓你更早發現 context 快滿、或背景 agent 卡住的狀況。

```bash
/plugin marketplace add jarrodwatts/claude-hud
/plugin install claude-hud

# 重開 Claude Code
/claude-hud:setup
```

現場如果看不到 `setup` 指令，先補跑 README 裡的 `/reload-plugins`；Windows 若顯示沒有 JavaScript runtime，先安裝 Node.js LTS。

## 7. 這一步的完成定義（選用，不影響 C2 主線驗收）

- `.claude/agents/beginner-ai-project-workflow.md` 已建立，且你能說出 name/description、model/memory、核心工作流程、保底機制各在幹嘛
- 用 `@agent-beginner-ai-project-workflow` 呼叫過一次
- （選用）Claude HUD 已安裝，輸入框下方看得到狀態列

→ 沒有加映也沒關係，回 [`ACCEPTANCE.md`](./ACCEPTANCE.md) 對照 C2 主線驗收；C3 會延續同一套 planner/implementer/reviewer 工作流。
