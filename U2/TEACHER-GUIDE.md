# C2 教師導讀｜把 vibe coding 變成可交付開發流程

## 30 秒版本

C2 不要教成「貼 prompt 讓 AI 改一段 code」。

C2 要教的是：

```text
學生如何把一個模糊需求
拆成資料、規則、畫面、測試與驗收，
再用 AGENTS.md / CLAUDE.md / Plan Mode 管住 coding agent，
最後完成一個可以被 smoke test、diff、build 證明的小功能。
```

本堂成果不是大功能，而是學生第一次走完整的工程交付循環。

## 這堂正式教什麼

| 主題 | C2 的教法 |
|---|---|
| 受控 vibe coding | 自然語言可以驅動 AI，但每一步都要有規則與驗收 |
| `AGENTS.md` | 共用專案守則，說明允許檔案、禁止動作、驗收方式 |
| `CLAUDE.md` | Claude Code 專用補充，對齊 `AGENTS.md` |
| Plan Mode | planner 先讀檔與提出 A-F 計畫，不先改檔 |
| 人審 | 學生檢查檔案範圍、資料欄位、畫面影響、風險 |
| Implementer | 只完成 `getPendingLineOrders(orderItems)` |
| 測試 | smoke test + 畫面 + diff + build |
| 部署概念 | `npm run build`、`dist/`、`npm run preview`、public deploy 的差別 |

## 這堂不要教什麼

- 不教完整 DevOps
- 不教 GitHub Actions 設定
- 不教正式 GitHub Pages 部署
- 不教 LINE API 真送
- 不教 webhook
- 不教 token 管理
- 不教 MCP 操作主線

Chrome DevTools MCP 可以當老師備課、截圖、驗收畫面用；不要把它變成 C2 學生主線。MCP/skills 放到 C4 比較合理。

## 4 小時講法

### 0:00-0:25｜開場：從 C1 進到 C2

講法：

```text
C1 是進入專案：VS Code、Git、GitHub、Claude Code、Codex。
C2 開始不是再看工具，而是第一次讓 AI 真正改專案。
所以今天的重點不是 AI 多快，而是你怎麼讓 AI 不亂改。
```

投影片重點：

- Web 版 AI 是展示結果，IDE 是進入專案工作。
- AI coding agent 會讀檔、改檔、跑指令，所以更需要守則。
- 本堂成果是倉儲後台的一條可驗收規則。

### 0:25-0:55｜受控 vibe coding 與守則檔

講法：

```text
Vibe coding 不是不好。問題是如果沒有規則，它會變成隨機開發。
所以我們今天把 vibe coding 加上 guardrails。
```

要講清楚：

- `AGENTS.md`：寫給所有 coding agent 的專案守則。
- `CLAUDE.md`：Claude Code 的補充記憶。
- 它們是 context，不是保證 AI 不犯錯。
- 真正的保險是 Plan Mode、人審、測試、diff、build。

### 0:55-1:30｜導讀倉儲後台與資料

先打開畫面，不要先打開 prompt。

導讀順序：

1. KPI：商品貨號、開放訂單、LINE OA、風險金額。
2. 異常警示燈：點不同燈號，看明細會換。
3. 訂單資料表：找到 `channel`、`status`。
4. 庫存資料表：知道這不是今天主線，但會餵其他提醒。

然後回到 `warehouseData.js`：

```text
今天不是憑空新增一個提醒。
我們要從 orders 找出 channel 是 LINE OA 且尚未出貨的訂單。
```

### 1:30-2:15｜planner 與人審

學生貼 planner 卡。

老師要盯的不是 AI 回覆文筆，而是這幾點：

- 是否只改 `warehouseLogic.js`
- 是否知道 UI 已經接好
- 是否讀 `channel` 和 `status`
- 是否提到 KPI、LINE OA 明細、action queue
- 是否包含 smoke test、畫面、diff、build
- 是否沒有新增套件或接 LINE API

這段要讓學生體會：

```text
你現在不用會寫全部程式。
你要先學會判斷 AI 的計畫能不能放行。
```

### 2:15-2:55｜implementer 小範圍實作

人審通過後才貼 implementer 卡。

正確修改應集中在：

```js
export function getPendingLineOrders(orderItems) {
  return orderItems.filter(
    (order) => order.channel === 'LINE OA' && order.status !== '已出貨',
  );
}
```

講解重點：

- 這是一條 business rule。
- 它不是 UI 文案。
- 它不是假資料。
- 它會同時餵三個畫面。

### 2:55-3:30｜測試與驗收

這裡要補強，不然 C2 會像「貼 prompt 而已」。

驗收順序：

1. `node scripts/check-warehouse-logic.mjs`
2. 看倉儲後台三個位置
3. `git diff -- web-lab/src/warehouseLogic.js`
4. `git diff -- package.json`
5. `npm run build`
6. reviewer 卡

講法：

```text
測試不是只有大型 test framework。
新手第一步，是能用最小工具證明規則成立、畫面連動、專案能 build。
```

### 3:30-3:50｜部署概念

不要展開 DevOps，只講 mental model。

```text
開發模式：npm run dev
建置：npm run build
建置結果：dist/
本機預覽建置結果：npm run preview
公開部署：把 dist/ 交給 GitHub Pages / Netlify / Vercel 這類平台
```

強調：

- C1 是 GitHub repo 上傳。
- C2 是知道 build / preview / deploy 的差別。
- 正式公開部署流程留到後面課程。

### 3:50-4:00｜收束與 commit

收束句：

```text
今天真正學到的不是 LINE OA 那一行條件。
真正學到的是：如何讓 AI coding agent 在可控範圍內交付一個能被驗收的小功能。
```

## 建議簡報主線

1. 受控 vibe coding：快不是重點，可控才是重點。
2. AGENTS/CLAUDE：寫給 AI 的工作守則。
3. Plan Mode：不先改檔，先出計畫。
4. 倉儲後台：先看畫面與資料，不先貼 prompt。
5. 需求拆解：資料、規則、畫面、測試、驗收。
6. Implementer：只補 `getPendingLineOrders`。
7. 測試：smoke test、畫面、diff、build。
8. 部署概念：dev、build、dist、preview、deploy。
9. Reviewer：PASS / BLOCK。
10. Commit：交付一個乾淨改動。

## 老師要準備的畫面

看 [`SCREENSHOT-GUIDE.md`](./SCREENSHOT-GUIDE.md)。

建議至少準備這幾張：

1. 倉儲後台初始畫面。
2. `AGENTS.md` C2 允許檔案。
3. `CLAUDE.md` 指向 AGENTS 的補充。
4. `warehouseData.js` 的 LINE OA 訂單。
5. `warehouseLogic.js` 的 C2-HOLE。
6. planner A-F 計畫。
7. smoke test 失敗與通過。
8. `npm run build` 通過。
9. `dist/` 資料夾與 `npm run preview` 概念。

## 官方來源備註

- OpenAI Codex 官方文件說明 Codex 會讀 `AGENTS.md` 作為專案指令。
- Anthropic Claude Code 官方文件說明 `CLAUDE.md` 是專案記憶與上下文，不是強制鎖。
- Claude Code 官方 workflow 建議針對要先審核的修改使用 Plan Mode。
- Chrome DevTools MCP 官方定位是給 coding agent 做瀏覽器檢查與除錯；C2 可作老師截圖工具，學生主線放到 C4。
