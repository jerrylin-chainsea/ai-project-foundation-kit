---
name: "source-command-ship-check"
description: "根據 git status、git diff 與 build 結果做交付前檢查"
---

# source-command-ship-check

Use this skill when the user asks to run the migrated source command `ship-check`.

## Command Template

請根據目前 git status、git diff 與 build 結果，
幫我做交付前檢查。
不要改檔。

請回答：
1. 是否可交付
2. 風險最高的是哪一點
3. commit 訊息建議
4. 如果要退回，最先該退哪個檔案
