// 資料合約(瀏覽器版)。
// 此檔的檢查規則與訊息文字,必須和 line-lab/sendLineAlert.js 的
// assertReportContract / buildAlertText / buildPayload 完全一致。
// 兩檔是雙胞胎:改其中一邊,請同步改另一邊。
// 這裡沒有任何 LINE token,也永遠不會呼叫 api.line.me。

export const REQUIRED_KEYS = [
  'risk_level',
  'total_revenue',
  'anomaly_count',
  'top_product',
  'top_channel',
  'action_items',
];

export const ALLOWED_RISK_LEVELS = ['low', 'medium', 'high'];

// 與 sendLineAlert.js 相同的示範收件人;瀏覽器版永遠不讀環境變數。
export const MOCK_TARGET_ID = 'Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

// 真送指令只給人複製到終端機用,網頁本身不會執行它。
export const REAL_SEND_COMMAND =
  'LINE_REAL_SEND=1 node line-lab/sendLineAlert.js --flex --confirm';
export const REAL_SEND_COMMAND_POWERSHELL =
  '$env:LINE_REAL_SEND="1"; node line-lab/sendLineAlert.js --flex --confirm';

// 檢查 report.json 是否符合合約。
// 和 sendLineAlert.js 不同的一點:node 版遇錯直接 throw,
// 這裡改成回傳 { ok, errors },讓畫面能把所有問題一次列出來。
// 錯誤訊息文字與 node 版逐字相同。
export function validateReport(report) {
  const errors = [];

  const missing = REQUIRED_KEYS.filter((key) => report[key] === undefined);
  if (missing.length > 0) {
    errors.push(`資料合約錯誤: report.json 缺少 ${missing.join(', ')}`);
  }

  if (report.risk_level !== undefined && !ALLOWED_RISK_LEVELS.includes(report.risk_level)) {
    errors.push(
      `資料合約錯誤: risk_level 必須是 low / medium / high，目前是 ${JSON.stringify(report.risk_level)}`
    );
  }

  if (report.action_items !== undefined && !Array.isArray(report.action_items)) {
    errors.push('資料合約錯誤: action_items 必須是陣列');
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, report };
}

export function formatMoney(value) {
  return `NT$${new Intl.NumberFormat('zh-TW').format(value)}`;
}

export function buildAlertText(report) {
  const actions = report.action_items.map((item, index) => `${index + 1}. ${item}`).join('\n');

  return [
    '[營運異常通知]',
    `風險等級: ${report.risk_level}`,
    `總營收: ${formatMoney(report.total_revenue)}`,
    `異常筆數: ${report.anomaly_count}`,
    `Top product: ${report.top_product}`,
    `Top channel: ${report.top_channel}`,
    'Action items:',
    actions,
    '',
    'Human review required before --confirm.',
  ].join('\n');
}

export function buildPayload(report) {
  return {
    to: MOCK_TARGET_ID,
    messages: [
      {
        type: 'text',
        text: buildAlertText(report),
      },
    ],
  };
}

// 三種訊息、三種顏色:訂單=藍、庫存警示=琥珀、營運異常=紅。
// report 類靠既有的 notification_theme 欄位分流(U4 ops 腳本產的低庫存報告會自動變琥珀),不加新欄位。
// line-lab/sendLineAlert.js 有同一張表,兩邊要逐字一致。
export const FLEX_THEMES = {
  order: { title: '訂單資訊', color: '#2764b5' },
  inventory: { title: '庫存警示', color: '#c87900' },
  anomaly: { title: '營運異常通知', color: '#b42318' },
};

export function reportTheme(report) {
  return report.notification_theme === 'low_stock_replenishment'
    ? FLEX_THEMES.inventory
    : FLEX_THEMES.anomaly;
}

function buildFlexField(label, value) {
  return {
    type: 'box',
    layout: 'baseline',
    spacing: 'sm',
    contents: [
      {
        type: 'text',
        text: label,
        color: '#666666',
        size: 'sm',
        flex: 2,
      },
      {
        type: 'text',
        text: String(value),
        color: '#111111',
        size: 'sm',
        flex: 4,
        wrap: true,
      },
    ],
  };
}

export function buildFlexMessage(report) {
  const theme = reportTheme(report);
  const actionItems =
    report.action_items.length > 0
      ? report.action_items.map((item, index) => `${index + 1}. ${item}`)
      : ['(none)'];

  return {
    type: 'flex',
    altText: theme.title,
    contents: {
      type: 'bubble',
      styles: { header: { backgroundColor: theme.color } },
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: theme.title,
            weight: 'bold',
            size: 'lg',
            color: '#ffffff',
            wrap: true,
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          buildFlexField('risk_level', report.risk_level),
          buildFlexField('total_revenue', formatMoney(report.total_revenue)),
          buildFlexField('anomaly_count', report.anomaly_count),
          buildFlexField('top_product', report.top_product),
          buildFlexField('top_channel', report.top_channel),
          { type: 'separator' },
          {
            type: 'text',
            text: 'action_items',
            weight: 'bold',
            size: 'sm',
            color: '#666666',
          },
          ...actionItems.map((item) => ({
            type: 'text',
            text: item,
            size: 'sm',
            color: '#111111',
            wrap: true,
          })),
        ],
      },
    },
  };
}

export function buildFlexPayload(report) {
  return {
    to: MOCK_TARGET_ID,
    messages: [buildFlexMessage(report)],
  };
}

// ── 訂單資訊範本(第二份資料合約)──────────────────────────
// 這是 line-lab/sendLineAlert.js 訂單 builder 的雙胞胎:欄位順序、中文錯誤字串、
// bubble 結構都要逐字一致。唯一差別是 to 永遠用示範 ID(前端不知道真的收件對象)。
export const ORDER_REQUIRED_KEYS = ['order_id', 'customer', 'channel', 'status', 'amount', 'items'];

export function validateOrder(order) {
  const errors = [];

  const missing = ORDER_REQUIRED_KEYS.filter((key) => order[key] === undefined);
  if (missing.length > 0) {
    errors.push(`資料合約錯誤: orders.json 缺少 ${missing.join(', ')}`);
  }

  if (order.items !== undefined && !Array.isArray(order.items)) {
    errors.push('資料合約錯誤: items 必須是陣列');
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, order };
}

export function buildOrderFlexMessage(order) {
  const theme = FLEX_THEMES.order;
  const itemLines =
    order.items.length > 0
      ? order.items.map((it) => `${it.name} ×${it.qty}  ${formatMoney(it.price)}`)
      : ['(none)'];

  return {
    type: 'flex',
    altText: theme.title,
    contents: {
      type: 'bubble',
      styles: { header: { backgroundColor: theme.color } },
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: theme.title,
            weight: 'bold',
            size: 'lg',
            color: '#ffffff',
            wrap: true,
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          buildFlexField('order_id', order.order_id),
          buildFlexField('customer', order.customer),
          buildFlexField('channel', order.channel),
          buildFlexField('status', order.status),
          buildFlexField('amount', formatMoney(order.amount)),
          { type: 'separator' },
          {
            type: 'text',
            text: 'items',
            weight: 'bold',
            size: 'sm',
            color: '#666666',
          },
          ...itemLines.map((item) => ({
            type: 'text',
            text: item,
            size: 'sm',
            color: '#111111',
            wrap: true,
          })),
        ],
      },
    },
  };
}

export function buildOrderFlexPayload(order) {
  return {
    to: MOCK_TARGET_ID,
    messages: [buildOrderFlexMessage(order)],
  };
}
