# U4 · STEP 04（本堂主線）｜ 親手裝三個 MCP

> **MCP = 幫 AI 接上外部工具的「安全的線」**，也像給 AI 一張你公司的門禁卡：在你授權範圍內，它能自己去讀，不用你一直複製貼上。
> 今天裝三個，每個都同一個節奏：**先看它解決什麼痛 → 一行裝 → 用一次 → `/mcp` 驗收 → 裝不起來的保底**。
> starter 的 `.mcp.json` 已附前兩台（用 Claude Code 打開資料夾會問你要不要啟用）。

## 前置

- 需要 Node 18+（`node -v` 確認）。chrome-devtools MCP 還需要本機有 Chrome。
- 裝完任何一台，打 `/mcp` 檢查它有沒有出現。

---

## MCP 一 · chrome-devtools（讓 AI 自己驗收畫面）

**痛**：AI 說「改好了」，但你得自己開瀏覽器、自己按 F12 看有沒有錯。
**接上之後**：AI 自己開 Chrome、看 console、截圖回報。本課那些 localhost 截圖就是它拍的。

```bash
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

**用一次**：先 `cd web-lab && npm run dev` 跑起 web-lab，再對 AI 說：

```text
請用 Chrome DevTools 開 http://localhost:5180，列出 console 有沒有錯誤，截一張首頁的圖。
```

**驗收**：`/mcp` 列出 `chrome-devtools`；AI 真的回報 console 狀況 + 一張截圖。
**保底**：連不上 → 自己在瀏覽器按 F12 看 console，不擋進度。

---

## MCP 二 · context7（給 AI 最新官方文件）

**痛**：套件改版很快，AI 憑舊記憶用過時 API 寫給你，照著做一直報錯。
**接上之後**：把「最新官方文件」餵給它，它照現在的用法回答。

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp
```

**用一次**：問套件用法時，句尾加 `use context7`：

```text
用 vite 設定 dev server 埠號，請參考最新官方文件。use context7
```

**驗收**：`/mcp` 列出 `context7`；答案附上文件出處。
**保底**：沒金鑰被限流 → 改看官方網站，或 `/model` 換更強模型。（免費金鑰：context7.com/dashboard）

---

## MCP 三 · codebase-memory（讓 AI 記住整個專案）

**痛**：專案一大，問「Dashboard 被誰用？」AI 得一檔一檔翻、常猜錯，改東西還誤傷別的檔。
**接上之後**：先把專案索引成「地圖」，架構、呼叫關係一問秒答。全本地執行、免 API key。

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
# Windows PowerShell：下載 install.ps1 後執行（見 repo README）
```
（安裝腳本會自動幫 Claude Code 設定好，不用寫進 `.mcp.json`。）

**用一次**：

```text
請先索引這個專案，然後告訴我：整體架構長怎樣？Dashboard.jsx 被誰使用？
```

**驗收**：`/mcp` 列出 `codebase-memory`；架構問題答得出檔案關係。
**保底**：裝不起來 → 用 `/init` 讓 AI 讀專案，或直接看 README，不擋進度。

---

## 收：MCP 權限三問（安全）

MCP 讓 AI 能碰外部資料，很方便，但**權限要給得剛剛好**。裝任何一台之前先問：

1. **它能讀到什麼？**
2. **它能不能寫入？**（能改的權限要更小心）
3. **會不會碰到正式資料？**（別讓它直接動真實營運資料庫）

## 結業

```text
U1 進得了專案
U2 管得住 AI coding agent
U3 接得上 LINE OA Flex（Dashboard 按鈕推播）
U4 放得進 ops agent / Actions，還幫 AI 接上三個 MCP
```

> **你不是只會問 AI，你是會管理 AI、還會幫它裝備的人。**
> AI 做出來不算完成，通過驗收才算完成。
