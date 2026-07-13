# START HERE ｜ M11 · AI 驅動開發與平台整合實作課

這份資料夾就是你四堂課的練習材料。整門課只做一個作品：

> **BOBA TIDE 手搖飲備料控制台**<br>
> 從接手 repo、Git 工作流、AI coding agent 規劃與驗收，到備料控制台、訂單可視化、LINE OA Flex、MCP/skills 與技術 blog。

## 你現在在哪條流水線

```text
接手 repo → Git / branch / commit → AGENTS.md / CLAUDE.md
      → Plan Mode → 備料控制台改功能 → 訂單可視化
      → API / LINE Flex mock → ops agent → MCP 驗收 → Astro 技術紀錄
```

| 堂 | 你會推進到哪裡 | 打開哪個資料夾 |
|---|---|---|
| U1 | 從 zip 建本機 repo，專案跑起來，看懂 VS Code / Git / Codex / Claude Code，並推上 GitHub | [`U1/`](./U1/) |
| U2 | 用 AGENTS.md、CLAUDE.md、Plan Mode 管住 AI，完成備料控制台小範圍修改 | [`U2/`](./U2/) |
| U3 | 看懂訂單資料如何驅動畫面，並用 LINE OA Flex 完成 mock 推播 | [`U3/`](./U3/) |
| U4 | ops agent、GitHub Actions、MCP/skills，最後整理成 Astro 技術紀錄 | [`U4/`](./U4/) |

這門課預設你拿到的是 zip，不是 `git clone`。第一次上課不要從整包亂找檔案。請先打開：

```text
U1/README.md
```

它會告訴你 C1 要照哪個順序做，第一步會先把 zip 變成自己的本機 Git repo。每個資料夾都有：`README.md` 或 `STEP-*.md`、`PROMPT-CARD.md`、`ACCEPTANCE.md`、`PITFALL.md`。

## 完成的定義（DoD）

> **AI 做出來不算完成。**
> **通過驗收才算完成。**
> **驗收包含：畫面 / 輸出 / diff / build / human review。**

## 一鍵啟動

- **Windows**：雙擊 [`start-m11.bat`](./start-m11.bat)
- **macOS**：雙擊 [`start-m11.command`](./start-m11.command)

第一次會自動安裝套件，然後打開 <http://localhost:5180>。

如果你是在 VS Code 裡操作，也可以用 Terminal 跑：

```bash
cd web-lab
npm install
npm run dev
```

看到終端機出現 `Local: http://localhost:5180/`，就用瀏覽器打開那個網址。若 port 不是 5180，以終端機顯示為準。

你應該看到四個頁面：

1. **品牌入口**：BOBA TIDE 首頁。
2. **備料控制台**：C2 會修改的後台管理系統。
3. **訂單可視化**：C3 會用來理解 component、CSS、資料狀態與 three.js 動畫。
4. **LINE 推播中心**：C3 會走完載入、檢查、Flex 預覽、人工審核、mock 推播。

U4 還會使用 [`blog-lab/`](./blog-lab/)：把前面的備料控制台、API 邊界、MCP 驗收與截圖整理成 Astro 技術紀錄，最後部署到 GitHub Pages。

Blog 等價指令：

```bash
cd blog-lab
npm install
npm run dev
```

## 安全三句

1. token 只放 `line-lab/.env`，不進程式碼、不進前端、不 commit。
2. 預設都是 mock；真送 LINE 需要 `LINE_REAL_SEND=1` 和人工確認。
3. AI 改完不要急著高興：先看畫面、看輸出、看 diff、跑 build，人審過了才算數。
