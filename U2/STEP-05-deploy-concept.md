# U2 · STEP 05 ｜部署概念：build、dist、preview、public deploy

> C2 不做完整部署自動化，但要讓學生知道「可以在本機跑」和「可以交付上線」中間差在哪裡。

## 1. 三個狀態

| 狀態 | 意思 | C2 要做嗎 |
|---|---|---|
| 開發模式 | `npm run dev`，給開發者即時看修改 | 要 |
| 建置結果 | `npm run build` 產出 `dist/` | 要 |
| 公開部署 | 把 `dist/` 放到 GitHub Pages / Netlify / Vercel 等平台 | 只講概念，正式流程後面再做 |

## 2. build 是什麼

```bash
cd web-lab
npm run build
```

build 會把 React/Vite 專案整理成瀏覽器可以直接讀的靜態檔案，通常放在：

```text
web-lab/dist/
```

你可以把它想成：

```text
src/ 原始碼
  -> npm run build
  -> dist/ 可被網站平台託管的檔案
```

## 3. preview 是什麼

```bash
npm run preview
```

preview 不是重新開發，而是用本機伺服器看 `dist/` 的結果。它比較接近「上線後使用者會看到的版本」。

C2 可以讓學生知道這件事，但不用要求每個人公開部署。

## 4. GitHub repo、build、deploy 的差別

| 名詞 | 白話 |
|---|---|
| GitHub repo | 放原始碼的地方 |
| `npm run build` | 把原始碼變成可交付網站檔案 |
| `dist/` | build 後的靜態網站成品 |
| deploy | 把 `dist/` 放到公開網址 |
| GitHub Pages | 一種可部署靜態網站的平台 |

C1 做的是 GitHub repo 上傳。

C2 補的是 build / preview / deployment mental model。

後面課程才會把公開網址、GitHub Actions、GitHub Pages 流程完整串起來。

## 5. 今天要記住的部署觀念

```text
AI 改完 code 不等於能交付。
至少要 build 過，才知道專案能被打包。
能 build，不等於已部署。
部署，是把 build 出來的 dist/ 放到一個公開可訪問的位置。
```

回到 [`ACCEPTANCE.md`](./ACCEPTANCE.md) 完成 C2 驗收。
