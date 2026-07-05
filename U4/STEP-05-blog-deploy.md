# U4 · STEP 05 ｜ Astro Blog 與 GitHub Pages 部署

> **這一步完成物**：一篇可以公開展示的 NOVA WAREHOUSE 技術紀錄，以及一個 GitHub Pages 公開網址。

## 1. 打開 blog-lab

```bash
cd blog-lab
npm install
npm run dev
```

打開終端機顯示的本機網址。你應該看到：

- `NOVA WAREHOUSE 技術紀錄` 首頁
- 一篇 `我如何用 AI coding agent 接手並交付 NOVA WAREHOUSE 倉儲系統` 文章

## 2. 改文章，不改成空泛心得

打開：

```text
blog-lab/src/content/blog/nova-warehouse-case.md
```

文章至少要補上：

1. 企業題目如何拆成資料、規則、畫面、驗收。
2. C2 倉儲後台改了什麼規則。
3. C3 API flow：Browser → `/api/send-line-flex` → 本機後端 → mock result。
4. token / env var 為什麼不進前端。
5. DevTools Network、mock result、build、git diff 的驗收證據。
6. 如果接真實企業資料，下一步要確認什麼。

不要寫「我使用 AI 做了一個很棒的系統」這種句子。每段都要有具體證據。

## 3. 放截圖

把截圖放到：

```text
blog-lab/public/images/
```

文章裡這樣引用：

```md
![倉儲後台 action queue](/images/warehouse-admin.png)
```

建議至少放：

- NOVA 首頁
- 倉儲後台 action queue
- 訂單可視化
- LINE Flex preview
- DevTools Network 的 `/api/send-line-flex`
- `npm run build` 成功
- GitHub Actions / Pages 部署成功

## 4. 本機 build

```bash
cd blog-lab
npm run build
```

build 通過後才可以部署。

## 5. GitHub Pages 設定

把整個 repo push 到 GitHub 後：

1. 打開 GitHub repo。
2. 到 Settings → Pages。
3. Source 選 `GitHub Actions`。
4. 到 Actions 分頁。
5. 執行 `Deploy Astro Blog to GitHub Pages`。

這個 workflow 會從 `blog-lab/` build Astro，並把 `blog-lab/dist` 部署到 GitHub Pages。

## 6. base path 為什麼不用手改

`blog-lab/astro.config.mjs` 會在 GitHub Actions 裡讀取 repo 名稱：

```js
const base = process.env.BASE_PATH ?? (repositoryName && !isUserPage ? `/${repositoryName}/` : '/');
```

所以：

- 本機預覽：`base` 是 `/`
- GitHub project Pages：`base` 會變成 `/<repo-name>/`
- `<帳號>.github.io` repo：`base` 維持 `/`

如果部署後連結或樣式壞掉，第一個檢查 `astro.config.mjs` 與 GitHub Pages URL。

## 7. 部署驗收

完成後請截圖：

1. Blog 首頁。
2. 技術案例文章。
3. GitHub Pages Settings，Source 是 GitHub Actions。
4. Actions workflow 成功。
5. 公開網址打得開。

收束：公開網址不是最終目的。真正要交付的是一篇能說清楚「我如何拆題、實作、驗證、控風險」的技術案例。
