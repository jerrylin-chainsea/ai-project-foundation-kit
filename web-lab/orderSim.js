// 訂單模擬引擎(老師檔,dev-only)。
// 由 vite.config.js 的 /api/orders 系列端點使用;只活在 npm run dev 的伺服端記憶體,
// 不進前端 bundle、不寫任何檔案、不碰 token。
//
// 它做的事:讓 BOBA TIDE「營業起來」——
//   訂單持續進來 → 沿 待製作→製作中→待取餐→已取餐 前進 → 製作時扣原料庫存
//   → 庫存低於安全量(或被盤點成負數)→ 警示出現 → 推播中心跳出「庫存警示」建議。
// 可控:start / pause / reset;在場訂單數有上限;種子化偽隨機,每次 reset 流程相似。
// 狀態枚舉與欄位語言完全沿用 shopData.js(U2 的 C2-HOLE 依賴 status !== '已取餐',不可改詞)。

import { drinkMenuItems } from './src/shopData.js';

// ── 種子化偽隨機(mulberry32):同一個種子跑出同一串數字,課堂示範可重現 ──
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 菜單池:每杯飲料用到哪些原料(sku 對應 shopData.drinkMenuItems),製作時各扣 1。
const MENU = [
  { name: '黑糖珍珠鮮奶', price: 65, uses: ['BT-P01', 'BT-S01', 'BT-C01'] },
  { name: '波霸鮮奶茶', price: 70, uses: ['BT-P02', 'BT-S01', 'BT-C01'] },
  { name: '無糖綠茶', price: 45, uses: ['BT-S02', 'BT-C01'] },
  { name: '珍珠綠茶', price: 55, uses: ['BT-P01', 'BT-S02', 'BT-C01'] },
  { name: '厚鮮奶波霸', price: 75, uses: ['BT-P02', 'BT-S01', 'BT-C02'] },
];

const CUSTOMERS = ['陳同學', '林小姐', '王先生', '校園咖啡社', '吳教練', '游泳隊', '黃老師', '劉阿姨'];
const CHANNELS = ['LINE OA', '外送平台', '櫃台', 'LINE OA']; // LINE OA 出現率調高,推播情境比較常見

const MAX_ACTIVE_ORDERS = 12;
const BEAT_MS = 3000; // 一拍 3 秒:跟前端輪詢節奏一致

const SEED = 20260707;

function todayStamp() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function etaFromNow(minutes) {
  const d = new Date(Date.now() + minutes * 60000);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function freshState() {
  return {
    running: false,
    rng: mulberry32(SEED),
    lastBeatAt: Date.now(),
    counter: 31, // 接在 shopData 靜態範例(…-031)之後
    orders: [],
    doneCount: 0,
    revenue: 0,
    // 庫存以 shopData.drinkMenuItems 為種子,深拷貝成伺服端活狀態。
    // 注意:shopData.js 有幾項(如波霸)原本就寫死庫存 0,那是 U2 靜態教材的示範值,
    // 不動它;但「營業中」是持續消耗的即時模擬,起始庫存拉到安全量之上,
    // 讓警示是「開店後真的被訂單吃光」才出現,不是一開店就已經缺貨。
    inventory: drinkMenuItems.map((item) => ({
      sku: item.sku,
      product: item.product,
      zone: item.zone,
      stock: Math.max(item.stock, item.reorderPoint + 10),
      reorderPoint: item.reorderPoint,
      owner: item.owner,
    })),
  };
}

let state = freshState();

function pick(arr) {
  return arr[Math.floor(state.rng() * arr.length)];
}

function findInv(sku) {
  return state.inventory.find((item) => item.sku === sku);
}

// 這張訂單需要的原料現在夠不夠?(缺料的訂單會停在「缺料等待」,補貨後自動恢復)
function ingredientsAvailable(order) {
  return order.items.every((line) =>
    line.uses.every((sku) => {
      const inv = findInv(sku);
      return inv && inv.stock >= line.qty;
    })
  );
}

function consumeIngredients(order) {
  for (const line of order.items) {
    for (const sku of line.uses) {
      const inv = findInv(sku);
      if (inv) inv.stock = Math.max(0, inv.stock - line.qty); // 製作只能用到 0,不會扣成負數
    }
  }
}

function makeOrder() {
  const lineCount = state.rng() < 0.3 ? 2 : 1;
  const items = [];
  for (let i = 0; i < lineCount; i += 1) {
    const menu = pick(MENU);
    const qty = state.rng() < 0.25 ? 2 : 1;
    items.push({ name: menu.name, qty, price: menu.price, uses: menu.uses });
  }
  const amount = items.reduce((sum, line) => sum + line.qty * line.price, 0);
  const channel = pick(CHANNELS);
  const firstInv = findInv(items[0].uses[0]);

  state.counter += 1;
  return {
    id: `BT-${todayStamp()}-${String(state.counter).padStart(3, '0')}`,
    customer: pick(CUSTOMERS),
    channel,
    status: '待製作',
    priority: amount >= 200 ? 'high' : channel === 'LINE OA' ? 'medium' : 'low',
    zone: firstInv ? firstInv.zone : '吧台區',
    amount,
    eta: etaFromNow(15 + Math.floor(state.rng() * 10)),
    items,
    bornAt: Date.now(),
  };
}

// 供應商小額到貨:每拍小機率讓某項原料 +1,避免熱門品項一路歸零後永遠回不來。
// 這不是自動補滿,只是讓警示有「這陣子回穩了/又緊張了」的起伏,而不是單調歸零。
function trickleRestock() {
  if (state.rng() < 0.4) {
    const item = pick(state.inventory);
    if (item.stock < item.reorderPoint + 10) item.stock += 1;
  }
}

// 一拍:舊訂單往前走一步、可能來一張新單、已取餐的歸檔。
function beat() {
  trickleRestock();
  for (const order of state.orders) {
    const roll = state.rng();
    if (order.status === '待製作') {
      if (!ingredientsAvailable(order)) {
        order.status = '缺料等待';
        order.priority = 'high';
      } else if (roll < 0.55) {
        consumeIngredients(order);
        order.status = '製作中';
      }
    } else if (order.status === '製作中') {
      if (roll < 0.5) order.status = '待取餐';
    } else if (order.status === '待取餐') {
      if (roll < 0.45) order.status = '已取餐';
    } else if (order.status === '缺料等待') {
      if (ingredientsAvailable(order)) order.status = '待製作'; // 補貨到位,自動恢復排隊
    }
  }

  // 已取餐的停留一拍讓學生看得到,再歸檔成統計數字
  const done = state.orders.filter((o) => o.status === '已取餐' && Date.now() - o.bornAt > BEAT_MS * 2);
  for (const order of done) {
    state.doneCount += 1;
    state.revenue += order.amount;
  }
  state.orders = state.orders.filter((o) => !done.includes(o));

  if (state.orders.length < MAX_ACTIVE_ORDERS && state.rng() < 0.65) {
    state.orders.push(makeOrder());
  }
}

// 依實際流逝時間補拍(輪詢驅動,不開伺服端 timer;暫停時時鐘凍結)
function advance() {
  const now = Date.now();
  if (!state.running) {
    state.lastBeatAt = now;
    return;
  }
  let beats = Math.floor((now - state.lastBeatAt) / BEAT_MS);
  if (beats > 5) beats = 5; // 睡太久不補一大串,醒來最多補 5 拍
  for (let i = 0; i < beats; i += 1) beat();
  if (beats > 0) state.lastBeatAt = now;
}

// ── 警示:伺服端算好,前端與推播中心共用同一份 ──
function computeAlerts() {
  const lineWaiting = state.orders.filter(
    (o) => o.channel === 'LINE OA' && o.status !== '已取餐'
  );
  const lowStock = state.inventory.filter((item) => item.stock <= item.reorderPoint && item.stock >= 0);
  const invalidStock = state.inventory.filter((item) => item.stock < 0); // 盤點按過頭:數字有誤

  return {
    lineWaitingCount: lineWaiting.length,
    lineWaitingIds: lineWaiting.map((o) => o.id),
    lowStock: lowStock.map(({ sku, product, stock, reorderPoint, owner }) => ({ sku, product, stock, reorderPoint, owner })),
    invalidStock: invalidStock.map(({ sku, product, stock, owner }) => ({ sku, product, stock, owner })),
  };
}

// 庫存警示組成 report.json 同款七欄合約(不發明新合約;跟 U4 的 ops 腳本產出同一種形狀)。
function inventoryReport() {
  const alerts = computeAlerts();
  const problems = [...alerts.invalidStock, ...alerts.lowStock];
  const outOfStock = alerts.lowStock.filter((item) => item.stock === 0);

  let riskLevel = 'low';
  if (alerts.invalidStock.length > 0 || outOfStock.length > 0) riskLevel = 'high';
  else if (alerts.lowStock.length > 0) riskLevel = 'medium';

  const worst = problems[0];
  const actionItems = [];
  for (const item of alerts.invalidStock) {
    actionItems.push(`盤點 ${item.product}: 庫存出現 ${item.stock},數字有誤,請 ${item.owner} 立刻重盤。`);
  }
  for (const item of alerts.lowStock.slice(0, 3)) {
    actionItems.push(
      `補貨 ${item.product}: 目前庫存 ${item.stock}, 安全量 ${item.reorderPoint}, 請 ${item.owner} 先確認採購與到貨日。`
    );
  }
  if (actionItems.length === 0) {
    actionItems.push('庫存都高於安全量,今天不用推播。');
  } else {
    actionItems.push('送出 LINE Flex 通知前，請主管人工確認補貨數量與收件對象。');
  }

  return {
    report_date: todayIso(),
    risk_level: riskLevel,
    total_revenue: state.revenue,
    anomaly_count: problems.length,
    top_product: worst ? worst.product : '無',
    top_channel: 'LINE OA',
    action_items: actionItems,
    notification_theme: 'low_stock_replenishment',
  };
}

// ── 對外介面(vite middleware 用)─────────────────────────
export const sim = {
  snapshot() {
    advance();
    const alerts = computeAlerts();
    return {
      running: state.running,
      stats: {
        totalToday: state.doneCount + state.orders.length,
        active: state.orders.filter((o) => o.status !== '已取餐').length,
        blocked: state.orders.filter((o) => o.status === '缺料等待').length,
        doneCount: state.doneCount,
        revenue: state.revenue,
      },
      orders: state.orders.map(({ bornAt, items, ...order }) => ({
        ...order,
        items: items.map(({ name, qty, price }) => ({ name, qty, price })), // uses 是內部欄位,不外流
      })),
      inventory: state.inventory,
      alerts,
      inventoryReport: inventoryReport(),
    };
  },

  control(action) {
    if (action === 'start') {
      state.running = true;
      state.lastBeatAt = Date.now();
      if (state.orders.length === 0) beat(); // 開店馬上有第一張單,不用乾等
    } else if (action === 'pause') {
      advance();
      state.running = false;
    } else if (action === 'reset') {
      state = freshState();
    }
    return this.snapshot();
  },

  adjustInventory(sku, delta) {
    const inv = findInv(sku);
    if (inv && Number.isFinite(delta)) {
      inv.stock += Math.trunc(delta); // 允許被扣成負數:這正是「改個數字改出錯」的教學情境
    }
    return this.snapshot();
  },

  // 推播中心「即時訂單」用:把看板上的一筆訂單轉成 data-lab/orders.json 同款合約物件。
  getOrderContract(orderId) {
    advance();
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return null;
    return {
      order_id: order.id,
      customer: order.customer,
      channel: order.channel,
      status: order.status,
      amount: order.amount,
      items: order.items.map(({ name, qty, price }) => ({ name, qty, price })),
    };
  },

  inventoryReport() {
    advance();
    return inventoryReport();
  },
};
