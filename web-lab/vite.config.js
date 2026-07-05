import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';

// createRequire 讓這個 ESM 設定檔能 require 到 line-lab/ 的 CommonJS 腳本(不必改它的模組格式)。
const require = createRequire(import.meta.url);

// dev-only 後端:讓 Dashboard 的「推播 LINE Flex」按鈕真的能送出。
// token 與收件對象都留在 line-lab/.env(伺服端讀),永遠不進前端 bundle。
// 這個 endpoint 只在 npm run dev 存在;npm run build 產出的靜態檔沒有它 —— 這正是
// 「前端不持有第三方密鑰、真正打 api.line.me 的後端在別處」這一課。
function lineFlexApi() {
  return {
    name: 'line-flex-api',
    configureServer(server) {
      server.middlewares.use('/api/send-line-flex', (req, res, next) => {
        if (req.method !== 'POST') return next();

        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
          if (raw.length > 1e6) req.destroy(); // 擋掉異常大的 body
        });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');

          let body;
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {
            res.statusCode = 200;
            res.end(JSON.stringify({ status: 'contract_error', errors: ['請求格式錯誤:不是合法 JSON'] }));
            return;
          }

          try {
            // 伺服端唯一權威:合約檢查、payload 組裝、guard 階梯、真正的 fetch 都在這裡。
            const line = require('../line-lab/sendLineAlert.js');
            const result = await line.handlePush({
              template: body.template,
              reviewed: body.reviewed === true,
            });
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (error) {
            res.statusCode = 200;
            res.end(JSON.stringify({ status: 'line_api_error', message: error.message }));
          }
        });
      });
    },
  };
}

// 這是網頁專案的設定檔。你今天不用改它。
export default defineConfig({
  plugins: [react(), lineFlexApi()],
  build: {
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 5180,
    open: false,
    fs: { allow: ['..'] }, // 允許讀取上一層的 data-lab/report.json(唯一資料來源)
  },
});
