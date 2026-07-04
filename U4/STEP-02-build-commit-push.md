# U4 · STEP 02 ｜ GitHub Actions、reviewer、build：這才叫平台交付

## 1. 看 workflow 做了什麼

打開 `.github/workflows/u11-ops-check.yml`。它做四件事：

1. checkout 專案
2. 設定 Python 與 Node
3. 跑 `python ops-agent-lab/run_ops_check.py --write-report`
4. 跑 `node line-lab/sendLineAlert.js --flex`，上傳 `report.json` 與 `line-flex-payload.json`

注意：workflow **不會真送 LINE**。它只產 artifact，等人審核。

## 2. 本機先對照跑一次

```bash
python ops-agent-lab/run_ops_check.py --write-report
node line-lab/sendLineAlert.js --flex
cd web-lab
npm run build
cd ..
```

**你應該看到**：Flex payload 產生、build 通過。

## 3. 跑 reviewer

貼 `PROMPT-CARD.md` 的 **reviewer 卡**。

**你應該看到**：AI 以固定格式回報，第一行是 `Verdict：PASS 或 BLOCK`。

人審重點：

- U4 新增檔案是否只在允許範圍？
- `package.json` 是否沒被改？
- GitHub Actions 是否只產 artifact、不真送 LINE？
- `report.json` 是否仍符合資料合約？

## 4. commit / push

```bash
git status
git diff
git diff -- web-lab/package.json
git add .
git commit -m "新增 U11 ops agent 與 GitHub Actions 自動化"
git push
```

沒有遠端 → 跳過 push，commit 完成即算交付。若有遠端，push 後到 GitHub 的 Actions 分頁手動跑 `U11 Ops Agent Check`，下載 artifact 檢查兩個檔案。

## 這一步的完成定義

- ✅ 本機跑過 ops agent → Flex payload → build
- ✅ reviewer PASS，且人有抽查 diff
- ✅ GitHub Actions workflow 不含 token、不真送 LINE
- ✅ 一筆 commit，訊息講得出改了什麼、為什麼

→ 下一步：`STEP-03-skillize.md`，把 ops check 與 ship check 固化成指令。
