# U4 · STEP 04 ｜ MCP / Skills / Astro 技術紀錄

> **本堂主線**：讓 AI 接上三種外部能力，再把四堂課成果整理成可以給企業看的技術紀錄。

## 1. MCP 是什麼

MCP 可以理解成「讓 AI 使用外部工具的安全接口」。今天只做三台：

| MCP | 解決什麼問題 | 本課用法 |
|---|---|---|
| Chrome DevTools MCP | AI 能自己看 localhost、console、Network、截圖 | 驗收 BOBA TIDE 首頁、訂單看板、LINE 推播中心 |
| Context7 MCP | 查最新官方文件，降低過時 API 風險 | 查 Vite / Astro / three.js / LINE SDK 類文件 |
| Codebase Memory MCP | 讓 AI 建立專案地圖，回答檔案關係 | 查 `ShopConsole.jsx`、`shopLogic.js`、`Dashboard.jsx` 的關係 |

## 2. Chrome DevTools MCP 小任務

先跑：

```bash
cd web-lab
npm run dev
```

對 AI 說：

```text
請用 Chrome DevTools MCP 打開 http://localhost:5180。
檢查：
1. console 有沒有 error
2. 品牌入口是否有動態背景
3. 訂單看板是否有 canvas
4. LINE 推播中心是否能看到兩個推播範本
請回報驗收結果與一張截圖。
```

保底：裝不起來就人工 F12 + 手動截圖，不擋進度。

## 3. Context7 MCP 小任務

問文件時，句尾加：

```text
use context7
```

範例：

```text
Astro 部署到 GitHub Pages 的最新設定方式是什麼？use context7
```

驗收：答案要說明文件來源，不是憑印象亂答。

## 4. Codebase Memory MCP 小任務

對 AI 說：

```text
請索引這個專案，回答：
1. 備料控制台資料從哪裡來
2. action queue 的規則在哪裡
3. LINE 推播中心的 token 為什麼不會進前端
4. C2 改 shopLogic.js 會影響哪些畫面
```

驗收：回答必須引用到具體檔案，不是泛泛而談。

## 5. Skills 是什麼

Skill 是把一套固定工作法寫成可重用指令。這堂至少要做兩個：

- `/ops-check`：檢查 ops agent、LINE payload、artifact
- `/ship-check`：交付前檢查 git diff、build、風險與 commit message

如果 Claude Code commands 無法使用，就直接貼 `PROMPT-CARD.md` 裡的等價 prompt。

## 6. 接到 Astro 技術 blog

本專案已經提供 [`../blog-lab/`](../blog-lab/) Astro blog starter。你要新增或改寫一篇文章，主題不是「我做了一個 AI 專案」，而是：

```text
我如何用 AI coding agent 接手並交付一個 BOBA TIDE 手搖飲控制台系統
```

文章至少包含：

1. 問題拆解：企業題目如何拆成頁面、資料、規則、驗收。
2. 系統截圖：品牌入口、備料控制台、訂單看板、LINE 推播中心。
3. 技術說明：React component、CSS 狀態、API payload、token 邊界。
4. AI 工作流：AGENTS.md、CLAUDE.md、Plan Mode、reviewer。
5. 驗收證據：build、mock 推播、DevTools console/Network、diff。
6. 下一步：如果給企業實戰題，你會怎麼估範圍與風險。

Blog 可以放連結回你的 BOBA TIDE 系統 demo，或放截圖與 GitHub repo 連結。

→ 下一步：`STEP-05-blog-deploy.md`，本機預覽 blog，設定 GitHub Pages，部署公開網址。

## 7. MCP 權限三問

裝任何 MCP 前都先問：

1. 它能讀到什麼？
2. 它能不能寫入？
3. 會不會碰到正式資料或 token？

收束：MCP 和 skills 不是炫技，而是讓你能更穩定地讀專案、查文件、驗收畫面、整理成果。
