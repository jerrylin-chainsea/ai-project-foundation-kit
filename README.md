# ai-project-foundation-kit

這是 M11/U11「**AI 驅動開發流程**」的練習專案。整門課使用同一個企業案例：

>  — 從接手 repo、規劃小範圍開發、完成倉儲後台功能、理解訂單可視化與 LINE OA Flex 推播，到最後用 MCP/skills 與 Astro blog 整理技術成果。

主線只有一條：

```text
接手 repo → Git / branch / commit → AGENTS.md / CLAUDE.md
      → Plan Mode → 倉儲後台改功能 → 訂單可視化
      → API / LINE Flex mock → ops agent → MCP 驗收 → Astro 技術紀錄
```

**學生從這裡開始：[`START-HERE.md`](./START-HERE.md)**。

## 資料夾

```text
ai-project-foundation-kit/
  START-HERE.md      # 學生入口:四堂課地圖 + DoD + 一鍵啟動
  start-m11.bat      # Windows 一鍵啟動
  start-m11.command  # macOS 一鍵啟動
  U1/ U2/ U3/ U4/    # 每堂:STEP-*.md / PROMPT-CARD.md / ACCEPTANCE.md / PITFALL.md
  web-lab/           # React/Vite 作品本體:NOVA 首頁、倉儲後台、訂單可視化、LINE 推播中心
  blog-lab/          # Astro 技術紀錄 starter:文章、截圖、GitHub Pages 部署
  data-lab/          # report.json / orders.json:LINE Flex 與資料合約練習
  line-lab/          # LINE OA Flex 通知腳本(mock 優先，真送雙重確認)
  ops-agent-lab/     # CrewAI-style 角色流程:庫存檢查 → 決策 → 推播文案
  .github/workflows/ # GitHub Actions:產 report / Flex payload artifact，部署 Astro blog
  prompts/           # 固定 prompt 卡完整版
  .claude/           # Claude Code commands / skills 範例
  .mcp.json          # MCP 設定範例
```

## 完成的定義（DoD）

> AI 做出來不算完成。通過驗收才算完成。
> 驗收包含：**畫面 / 輸出 / diff / build / human review**。

## web-lab

```bash
cd web-lab
npm install
npm run dev     # http://localhost:5180
npm run build
```

`web-lab` 有四個頁面：

| 頁面 | 課程用途 |
|---|---|
| 品牌入口 | C1：確認 starter repo 本身有完整企業情境與高質感首頁 |
| 倉儲後台 | C2：AGENTS.md、CLAUDE.md、Plan Mode、挖洞式小範圍開發 |
| 訂單可視化 | C3：components、CSS、src、資料驅動畫面、three.js 訂單流動畫 |
| LINE 推播中心 | C3-C4：資料合約、Flex payload、人工審核、mock / 真送邊界 |

## LINE OA 安全規則

- 預設 mock 模式，不真的發送 LINE。
- 真送只允許在後端/終端機發生，token 只放 `line-lab/.env`。
- 前端永遠不直接呼叫 `https://api.line.me`。
- 真送需要 `LINE_REAL_SEND=1` 且人工確認。

```bash
node line-lab/sendLineAlert.js --flex
```

看到 `[mock] LINE_REAL_SEND is not 1, no request sent.` 就是主線過關。

## ops-agent-lab

```bash
python ops-agent-lab/run_ops_check.py
python ops-agent-lab/run_ops_check.py --write-report
node line-lab/sendLineAlert.js --flex
```

`run_ops_check.py` 用三個角色模擬 CrewAI-style workflow：

| 角色 | 負責 |
|---|---|
| data_checker | 讀庫存 CSV，找低庫存與缺貨 |
| ops_decider | 判斷風險等級、異常數與主要通路 |
| push_writer | 產出主管看得懂的 action items |

## blog-lab

```bash
cd blog-lab
npm install
npm run dev
npm run build
```

`blog-lab` 是 U4 的 Astro 技術紀錄 starter。學生會把 C2-C4 的截圖、API 邊界、DevTools 驗收與 GitHub Actions 結果整理成一篇可公開展示的技術案例。

`npm install` 可能會顯示 audit warning；課堂不要跑 `npm audit fix --force`，先以 `npm run build` 是否通過為準。

部署主線是 GitHub Pages：push 到 GitHub 後，到 Settings → Pages 選 GitHub Actions，再執行 `Deploy Astro Blog to GitHub Pages` workflow。

## 需要的工具

- Node.js 18+
- Python 3
- VS Code
- Git / GitHub
- Claude Code 或 Codex
