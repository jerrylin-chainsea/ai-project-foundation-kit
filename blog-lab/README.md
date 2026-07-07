# Blog Lab

這是 U4 使用的 Astro 技術紀錄 starter。用途不是做一個漂亮空殼，而是把前面完成的倉儲系統整理成可以對企業說明的案例文章。

## 本機預覽

```bash
cd blog-lab
npm install
npm run dev
```

打開終端機顯示的網址，應該看到首頁與一篇 案例草稿。

## 寫文章

主要文章在：

```text
src/content/blog/nova-warehouse-case.md
```

請把課堂截圖放到：

```text
public/images/
```

文章裡用：

```md
![倉儲後台截圖](/images/warehouse-admin.png)
```

如果部署到 GitHub project Pages，GitHub Actions 會自動替你處理 repo base path。本機預覽維持 `/`。

## GitHub Pages 部署

1. 把整個 repo push 到 GitHub。
2. 到 repo 的 Settings → Pages。
3. Source 選 GitHub Actions。
4. 到 Actions 分頁執行 `Deploy Astro Blog to GitHub Pages`。
5. 完成後打開部署 URL，確認首頁與文章可以讀取。

公開前請檢查：不要放 token、個資、未授權企業資料或內部截圖。
