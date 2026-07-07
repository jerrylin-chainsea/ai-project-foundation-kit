import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import { sim } from './orderSim.js';

// createRequire 讓這個 ESM 設定檔能 require 到 line-lab/ 的 CommonJS 腳本(不必改它的模組格式)。
const require = createRequire(import.meta.url);

// 共用:讀 POST body(限制大小、擋壞 JSON),回 JSON。
function readJsonBody(req, res, onBody) {
  let raw = '';
  req.on('data', (chunk) => {
    raw += chunk;
    if (raw.length > 1e6) req.destroy(); // 擋掉異常大的 body
  });
  req.on('end', () => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    let body;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      res.statusCode = 200;
      res.end(JSON.stringify({ status: 'contract_error', errors: ['請求格式錯誤:不是合法 JSON'] }));
      return;
    }
    onBody(body);
  });
}

// dev-only 後端之一:訂單模擬(U3 的「營業中」資料來源)。
// 引擎在 orderSim.js(老師檔);這裡只是把它接上三個 HTTP 端點:
//   GET  /api/orders            → 目前快照(orders / inventory / alerts / inventoryReport)
//   POST /api/orders/control    → { action: 'start' | 'pause' | 'reset' }
//   POST /api/inventory/adjust  → { sku, delta }(學員在網頁上「改個數字」的入口)
// 這些端點只在 npm run dev 存在;build 出來的靜態網站沒有它們,前端要能優雅降級。
function orderFeedApi() {
  return {
    name: 'order-feed-api',
    configureServer(server) {
      server.middlewares.use('/api/inventory/adjust', (req, res, next) => {
        if (req.method !== 'POST') return next();
        readJsonBody(req, res, (body) => {
          res.statusCode = 200;
          res.end(JSON.stringify(sim.adjustInventory(body.sku, Number(body.delta))));
        });
      });

      server.middlewares.use('/api/orders', (req, res, next) => {
        // 這個 mount 也會接到 /api/orders/control(req.url 會是 '/control')
        if (req.method === 'POST' && req.url === '/control') {
          readJsonBody(req, res, (body) => {
            res.statusCode = 200;
            res.end(JSON.stringify(sim.control(body.action)));
          });
          return;
        }
        if (req.method !== 'GET') return next();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = 200;
        res.end(JSON.stringify(sim.snapshot()));
      });
    },
  };
}

// dev-only 後端之二:讓 Dashboard 的「推播 LINE Flex」按鈕真的能送出。
// token 與收件對象都留在 line-lab/.env(伺服端讀),永遠不進前端 bundle。
// 這個 endpoint 只在 npm run dev 存在;npm run build 產出的靜態檔沒有它 —— 這正是
// 「前端不持有第三方密鑰、真正打 api.line.me 的後端在別處」這一課。
//
// 三種訊息類型,前端一律只送 template(+orderId)與 reviewed,資料由伺服端權威提供:
//   live-order → 從訂單模擬取那筆訂單(orders.json 同款合約)
//   inventory  → 由模擬庫存組成 report.json 同款七欄合約
//   order / anomaly → 照舊讀 data-lab/ 的靜態範例檔
function lineFlexApi() {
  return {
    name: 'line-flex-api',
    configureServer(server) {
      server.middlewares.use('/api/send-line-flex', (req, res, next) => {
        if (req.method !== 'POST') return next();
        readJsonBody(req, res, async (body) => {
          try {
            // 伺服端唯一權威:合約檢查、payload 組裝、guard 階梯、真正的 fetch 都在這裡。
            const line = require('../line-lab/sendLineAlert.js');

            const extra = {};
            if (body.template === 'live-order') {
              const order = sim.getOrderContract(body.orderId);
              if (!order) {
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    status: 'contract_error',
                    template: 'live-order',
                    errors: ['找不到這筆即時訂單:它可能已完成或模擬已重置。請回訂單看板重新選一筆。'],
                  })
                );
                return;
              }
              extra.order = order;
            } else if (body.template === 'inventory') {
              extra.report = sim.inventoryReport();
            }

            const result = await line.handlePush({
              template: body.template,
              reviewed: body.reviewed === true,
              ...extra,
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
  plugins: [react(), orderFeedApi(), lineFlexApi()],
  build: {
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 5180,
    open: false,
    fs: { allow: ['..'] }, // 允許讀取上一層的 data-lab/report.json(唯一資料來源)
  },
});
