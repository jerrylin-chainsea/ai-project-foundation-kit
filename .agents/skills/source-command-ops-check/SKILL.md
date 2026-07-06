---
name: "source-command-ops-check"
description: "檢查 U11 ops agent、LINE Flex 與 GitHub Actions artifact 流程"
---

# source-command-ops-check

Use this skill when the user asks to run the migrated source command `ops-check`.

## Command Template

請檢查 U11 ops agent 自動化流程。
不要改檔。

請根據目前檔案與輸出回答：
1. ops-agent-lab/run_ops_check.py 是否會產生符合 report.json 合約的資料？
2. line-lab/sendLineAlert.js --flex 是否仍是 mock 優先？
3. .github/workflows/u11-ops-check.yml 是否只產 artifact、不真送 LINE？
4. 人工審核前還缺哪一個證據？
