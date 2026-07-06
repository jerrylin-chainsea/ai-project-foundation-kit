# U4 · STEP 03 ｜ 把平台流程固化成 SOP：/ops-check 與 /ship-check

> 你現在已經把 AI coding agent、LINE OA Flex、ops agent、GitHub Actions 串成一條交付線。
> 最後一步是把它寫成 Skill / 自訂指令，讓下次不用靠記憶。

## 1. 建立 /ops-check

建立檔案 `.claude/commands/ops-check.md`，內容：

```text
請檢查 U11 ops agent 自動化流程。
不要改檔。

請根據目前檔案與輸出回答：
1. ops-agent-lab/run_ops_check.py 是否會產生符合 report.json 合約的資料？
2. line-lab/sendLineAlert.js --flex 是否仍是 mock 優先？
3. .github/workflows/u11-ops-check.yml 是否只產 artifact、不真送 LINE？
4. 人工審核前還缺哪一個證據？
```

存檔後在對話框打 `/ops-check`。

## 2. 建立 /ship-check

建立檔案 `.claude/commands/ship-check.md`，內容：

```text
請根據目前 git status、git diff 與 build 結果，
幫我做交付前檢查。
不要改檔。
請回答：
1. 是否可交付
2. 風險最高的是哪一點
3. commit 訊息建議
4. 如果要退回，最先該退哪個檔案
```

以後每次要 commit 前，一個指令就把「交付前四問」跑完。

自動化這段就收在這裡。**接下來是今天的主線** → `STEP-04-mcp.md`：親手裝三個 MCP，讓 AI 能自己開瀏覽器、查最新文件、記住整個專案。

## 3. 結業（做完 STEP-04 再回來看）

四堂課的完整弧線：

```text
U1 進得了專案
U2 管得住 AI coding agent(Agentic Engineering：控制輸出)
U3 接得上 LINE OA Flex(Agentic Engineering：控制行動)
U4 放得進 ops agent / GitHub Actions / Skill / MCP(Agentic Engineering：擴充能力)
```

這四堂課合起來，就是 **Agentic Engineering**（設計「會做事」的 AI 系統）的完整入門。

> **你不是只會問 AI，你是會管理 AI 做事的人。**
> AI 做出來不算完成，通過驗收才算完成。
