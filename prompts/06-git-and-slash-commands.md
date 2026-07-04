# 06 · Git 驗收與交付小抄

**什麼時候用:** 一次修改完成,要驗收、存檔、交付的時候。

## 交付前四問(每次交付都問)

```
1. 畫面 / 輸出對了嗎?
2. git diff 只有預期變更嗎?
3. build 過了嗎?
4. commit 訊息是否說得出「改了什麼、為什麼」?
```

## /ship-check(交付前檢查 prompt,可建成自訂指令)

```
請根據目前 git status、git diff 與 build 結果,
幫我做交付前檢查。
不要改檔。
請回答:
1. 是否可交付
2. 風險最高的是哪一點
3. commit 訊息建議
4. 如果要退回,最先該退哪個檔案
```

> 建成指令:把上面這段存成 `.claude/commands/ship-check.md`,以後打 `/ship-check` 就好。

## /ops-check(U4 平台自動化檢查 prompt,可建成自訂指令)

```
請檢查 U11 ops agent 自動化流程。
不要改檔。

請根據目前檔案與輸出回答:
1. ops-agent-lab/run_ops_check.py 是否會產生符合 report.json 合約的資料?
2. line-lab/sendLineAlert.js --flex 是否仍是 mock 優先?
3. .github/workflows/u11-ops-check.yml 是否只產 artifact、不真送 LINE?
4. 人工審核前還缺哪一個證據?
```

> 建成指令:把上面這段存成 `.claude/commands/ops-check.md`,以後打 `/ops-check` 就好。

## Git 最小包

```bash
git init
git status
git diff
git diff -- package.json   # 這條必須沒有輸出
git add .
git commit -m "完成一次可驗收修改"
```

遠端指令先會白話:

```bash
git clone <repo-url>    # 複製遠端專案
git fetch origin        # 抓遠端更新資訊,先不合併
git pull                # 抓遠端更新並合併
git push                # 把 commit 送上遠端(交付的最後一步)
```

## slash commands

| 指令 | 用途 |
|---|---|
| `/init` | 先認識專案 |
| `/plan` | 先計畫,不要直接改 |
| `/model` | 換模型或思考深度 |
| `/permissions` | 看 AI 權限 |
| `/diff` | 看 AI 改了什麼 |
| `/status` | 看目前狀態 |
| `/clear` | 清空對話 |
| `/compact` | 壓縮上下文 |
| `/mcp` | 看外部工具連線 |
| `/skills` | 看固定 SOP |

> 不用背指令。照順序:先讀、先計畫、放行修改、reviewer 檢查、最後四問 → commit。
> 看到 diff 乾淨、build 通過、commit 成功,這次才叫交付。
