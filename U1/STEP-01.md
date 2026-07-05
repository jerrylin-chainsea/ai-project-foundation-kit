# U1 · STEP 01 ｜ 接手老師給的 repo，先把專案跑起來

> **這堂完成物**：專案能跑、你看得懂四個頁面、認得 VS Code / Git / Codex / Claude Code 的工作位置，並完成第一次小範圍修改。

## 1. 一鍵啟動

- Windows：雙擊 `start-m11.bat`
- macOS：雙擊 `start-m11.command`

**你應該看到**：瀏覽器打開 <http://localhost:5180>，首頁是 **NOVA WAREHOUSE**，背景有會動的倉儲 3D 場景。

如果 5180 被占用，Vite 會在終端機顯示另一個網址。以終端機顯示的網址為準。

## 2. 先看四個頁面

上方導覽有四個頁面：

| 頁面 | 今天先看什麼 |
|---|---|
| 品牌入口 | starter repo 本身已經是高質感企業案例，不是空白練習頁 |
| 倉儲後台 | C2 會用 AGENTS.md / CLAUDE.md / Plan Mode 做小範圍修改 |
| 訂單可視化 | C3 會看資料如何驅動畫面與 three.js 訂單流動畫 |
| LINE 推播中心 | C3 會走完 Flex 預覽、人工審核、mock 推播 |

今天不用改後三個頁面，只要知道它們是後面三堂會一路接上的主線。

## 3. 認識 VS Code 三個區

用 VS Code 開 `ai-project-foundation-kit` 資料夾，認出三個區：

- **Explorer**：左邊檔案樹
- **Editor**：中間編輯區
- **Terminal**：下面跑指令的地方

今天主要會碰：

| 檔案 | 它管什麼 |
|---|---|
| `web-lab/src/data.js` | 首頁文案與四堂課卡片；C1 安全修改範圍 |
| `web-lab/src/WarehouseScene.jsx` | 首頁 3D 倉儲動畫；今天不改 |
| `AGENTS.md` | AI coding agent 的工作守則 |
| `CLAUDE.md` | Claude Code 補充守則 |
| `START-HERE.md` | 整門課地圖 |

## 4. 先請 AI 讀，不要改

貼 `PROMPT-CARD.md` 的「讀專案」卡給 Codex 或 Claude Code。驗收標準只有一個：

```bash
git status
```

AI 讀完專案後，`git status` 仍然乾淨，才代表它有遵守「先讀，不要改」。

→ 下一步：打開 `STEP-02.md`，做第一次可見修改與 Git 快照。
