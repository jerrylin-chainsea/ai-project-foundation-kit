# U2 · 卡住了？先看這裡

| 狀況 | 解法 |
|---|---|
| `shift+tab` 切不到 Plan mode（Windows 常見） | 點面板底部的模式字樣直接選 Plan |
| AI 在 Plan mode 還是把檔案改了 | `git status` 看範圍 → `git restore <檔>` 還原 → 重新進 Plan mode 貼卡 |
| AI 的計畫想改一堆檔 | 不要同意。貼：「請縮小範圍，這次只修改 <允許檔案>，其他都不要動。」再看一次計畫 |
| AI 說要新增套件 | 一律拒絕。本課所有任務都不需要新套件 |
| AI 想改 `line-lab/sendLineAlert.js` | U2 不需要。這堂只做 Dashboard 準備區塊，LINE Flex 到 U3 |
| AI 想直接串 LINE OA | 不放行。U2 只做畫面與工作流，真送規則在 U3 |
| implementer 改完沒有回報 A–E | 貼：「請用固定格式回報：A 實際修改的檔案 B 各改了什麼 C 對應資料合約 D 如何手動驗收 E 哪些沒改」 |
| 對話越來越亂、AI 開始忘記限制 | `/compact` 壓縮；還是亂 → `/clear` 重來，重貼 planner 卡 |
| 不敢按同意 | 就對了 —— 用人審四題判斷，四題都安全才同意。不確定就舉手 |
| 亂按同意改壞了 | 不用怕：`git restore <檔>` 就回得來。這就是 U1 先學 Git 的原因 |

> 原則：**AI 越界不是你的錯，放行前沒檢查才是**。四題防呆永遠來得及。
