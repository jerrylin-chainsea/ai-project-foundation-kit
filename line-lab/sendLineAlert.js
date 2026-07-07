#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const REPORT_PATH = path.join(ROOT, "data-lab", "report.json");
const ORDERS_PATH = path.join(ROOT, "data-lab", "orders.json");
const PAYLOAD_PATH = path.join(__dirname, "line-alert-payload.json");
const FLEX_PAYLOAD_PATH = path.join(__dirname, "line-flex-payload.json");
const ENV_PATH = path.join(__dirname, ".env");
const LINE_PUSH_URL = "https://api.line.me/v2/bot/message/push";
const ALLOWED_RISK_LEVELS = new Set(["low", "medium", "high"]);
const MOCK_TARGET_ID = "Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

function loadLocalEnv() {
  if (!fs.existsSync(ENV_PATH)) return;

  const lines = fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function readReport() {
  return JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
}

function readOrders() {
  return JSON.parse(fs.readFileSync(ORDERS_PATH, "utf8"));
}

// 注意:web-lab/src/reportContract.js 是這段檢查的雙胞胎,改其中一邊請同步改另一邊。
function assertReportContract(report) {
  const missing = [
    "risk_level",
    "total_revenue",
    "anomaly_count",
    "top_product",
    "top_channel",
    "action_items",
  ].filter((key) => report[key] === undefined);

  if (missing.length > 0) {
    throw new Error(`資料合約錯誤: report.json 缺少 ${missing.join(", ")}`);
  }

  if (!ALLOWED_RISK_LEVELS.has(report.risk_level)) {
    throw new Error(
      `資料合約錯誤: risk_level 必須是 low / medium / high，目前是 ${JSON.stringify(report.risk_level)}`
    );
  }

  if (!Array.isArray(report.action_items)) {
    throw new Error("資料合約錯誤: action_items 必須是陣列");
  }
}

// 訂單資訊範本的資料合約。web-lab/src/reportContract.js 的 validateOrder 是它的雙胞胎。
function assertOrderContract(order) {
  const missing = [
    "order_id",
    "customer",
    "channel",
    "status",
    "amount",
    "items",
  ].filter((key) => order[key] === undefined);

  if (missing.length > 0) {
    throw new Error(`資料合約錯誤: orders.json 缺少 ${missing.join(", ")}`);
  }

  if (!Array.isArray(order.items)) {
    throw new Error("資料合約錯誤: items 必須是陣列");
  }
}

function formatMoney(value) {
  return `NT$${new Intl.NumberFormat("zh-TW").format(value)}`;
}

function buildAlertText(report) {
  const actions = report.action_items.map((item, index) => `${index + 1}. ${item}`).join("\n");

  return [
    "[營運異常通知]",
    `風險等級: ${report.risk_level}`,
    `總營收: ${formatMoney(report.total_revenue)}`,
    `異常筆數: ${report.anomaly_count}`,
    `Top product: ${report.top_product}`,
    `Top channel: ${report.top_channel}`,
    "Action items:",
    actions,
    "",
    "Human review required before --confirm.",
  ].join("\n");
}

function buildPayload(report) {
  return {
    to: process.env.LINE_TARGET_ID || MOCK_TARGET_ID,
    messages: [
      {
        type: "text",
        text: buildAlertText(report),
      },
    ],
  };
}

// 三種訊息、三種顏色:訂單=藍、庫存警示=琥珀、營運異常=紅。
// report 類靠既有的 notification_theme 欄位分流(U4 ops 腳本產的低庫存報告會自動變琥珀),不加新欄位。
// web-lab/src/reportContract.js 有同一張表,兩邊要逐字一致。
const FLEX_THEMES = {
  order: { title: "訂單資訊", color: "#2764b5" },
  inventory: { title: "庫存警示", color: "#c87900" },
  anomaly: { title: "營運異常通知", color: "#b42318" },
};

function reportTheme(report) {
  return report.notification_theme === "low_stock_replenishment"
    ? FLEX_THEMES.inventory
    : FLEX_THEMES.anomaly;
}

function buildFlexField(label, value) {
  return {
    type: "box",
    layout: "baseline",
    spacing: "sm",
    contents: [
      {
        type: "text",
        text: label,
        color: "#666666",
        size: "sm",
        flex: 2,
      },
      {
        type: "text",
        text: String(value),
        color: "#111111",
        size: "sm",
        flex: 4,
        wrap: true,
      },
    ],
  };
}

function buildFlexMessage(report) {
  const theme = reportTheme(report);
  const actionItems =
    report.action_items.length > 0
      ? report.action_items.map((item, index) => `${index + 1}. ${item}`)
      : ["(none)"];

  return {
    type: "flex",
    altText: theme.title,
    contents: {
      type: "bubble",
      styles: { header: { backgroundColor: theme.color } },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: theme.title,
            weight: "bold",
            size: "lg",
            color: "#ffffff",
            wrap: true,
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          buildFlexField("risk_level", report.risk_level),
          buildFlexField("total_revenue", formatMoney(report.total_revenue)),
          buildFlexField("anomaly_count", report.anomaly_count),
          buildFlexField("top_product", report.top_product),
          buildFlexField("top_channel", report.top_channel),
          { type: "separator" },
          {
            type: "text",
            text: "action_items",
            weight: "bold",
            size: "sm",
            color: "#666666",
          },
          ...actionItems.map((item) => ({
            type: "text",
            text: item,
            size: "sm",
            color: "#111111",
            wrap: true,
          })),
        ],
      },
    },
  };
}

function buildFlexPayload(report) {
  return {
    to: process.env.LINE_TARGET_ID || MOCK_TARGET_ID,
    messages: [buildFlexMessage(report)],
  };
}

// 訂單資訊 Flex bubble。與 web-lab/src/reportContract.js 的 buildOrderFlexMessage 逐字一致。
function buildOrderFlexMessage(order) {
  const theme = FLEX_THEMES.order;
  const itemLines =
    order.items.length > 0
      ? order.items.map((it) => `${it.name} ×${it.qty}  ${formatMoney(it.price)}`)
      : ["(none)"];

  return {
    type: "flex",
    altText: theme.title,
    contents: {
      type: "bubble",
      styles: { header: { backgroundColor: theme.color } },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: theme.title,
            weight: "bold",
            size: "lg",
            color: "#ffffff",
            wrap: true,
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          buildFlexField("order_id", order.order_id),
          buildFlexField("customer", order.customer),
          buildFlexField("channel", order.channel),
          buildFlexField("status", order.status),
          buildFlexField("amount", formatMoney(order.amount)),
          { type: "separator" },
          {
            type: "text",
            text: "items",
            weight: "bold",
            size: "sm",
            color: "#666666",
          },
          ...itemLines.map((item) => ({
            type: "text",
            text: item,
            size: "sm",
            color: "#111111",
            wrap: true,
          })),
        ],
      },
    },
  };
}

function buildOrderFlexPayload(order) {
  return {
    to: process.env.LINE_TARGET_ID || MOCK_TARGET_ID,
    messages: [buildOrderFlexMessage(order)],
  };
}

function writePayload(payload, payloadPath = PAYLOAD_PATH) {
  fs.writeFileSync(payloadPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`payload written: ${path.relative(ROOT, payloadPath)}`);
}

async function sendToLine(payload) {
  const response = await fetch(LINE_PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  return {
    ok: response.ok,
    lineStatus: response.status,
    statusText: response.statusText,
    body,
  };
}

// 送出前的護欄階梯:mock 是安全預設,真送要 LINE_REAL_SEND=1 + confirmed + token/target 都齊。
// CLI 的 --confirm 與 Dashboard 的「已人工審核」都對應到這裡的 confirmed。
// 回傳固定 status 物件,絕不含 token 或收件對象。CLI 與 API 共用同一條階梯。
async function sendWithGuards(payload, confirmed) {
  const realSend = process.env.LINE_REAL_SEND === "1";

  if (!realSend) {
    return {
      status: "mock",
      message: "[mock] LINE_REAL_SEND is not 1, no request sent.",
    };
  }

  if (!confirmed) {
    return {
      status: "blocked",
      reason: "not_confirmed",
      message: "[blocked] LINE_REAL_SEND=1 but --confirm missing; no request sent.",
    };
  }

  if (!process.env.LINE_CHANNEL_ACCESS_TOKEN || !process.env.LINE_TARGET_ID) {
    return {
      status: "blocked",
      reason: "missing_token_or_target",
      message: "LINE real send requires LINE_CHANNEL_ACCESS_TOKEN and LINE_TARGET_ID.",
    };
  }

  const result = await sendToLine(payload);
  if (!result.ok) {
    return {
      status: "line_api_error",
      lineStatus: result.lineStatus,
      statusText: result.statusText,
      body: result.body,
    };
  }

  return { status: "sent", lineStatus: result.lineStatus, body: result.body };
}

// Dashboard「推播中心」按鈕的入口(由 web-lab/vite.config.js 的 /api/send-line-flex 呼叫)。
// 前端只傳 template 與 reviewed(即時訂單多帶 orderId,由中介層換成 order 物件);
// token 與收件對象一律留在伺服端 .env,不回傳給前端。
// order / report 物件只會由 vite 中介層傳入(即時訂單、即時庫存);
// 不管資料從哪來,都走同一套雙胞胎合約檢查——資料來源變多,防線不變。
async function handlePush({ template, reviewed, order, report } = {}) {
  loadLocalEnv();

  if (reviewed !== true) {
    return { status: "blocked", reason: "not_reviewed", message: "尚未完成人工審核,不能送出。" };
  }

  const isOrderKind = template === "order" || template === "live-order";
  const kind = isOrderKind ? template : template === "inventory" ? "inventory" : "anomaly";
  let payload;
  try {
    if (isOrderKind) {
      const data = order ?? readOrders();
      assertOrderContract(data);
      payload = buildOrderFlexPayload(data);
    } else {
      const data = report ?? readReport();
      assertReportContract(data);
      payload = buildFlexPayload(data);
    }
  } catch (error) {
    return { status: "contract_error", template: kind, errors: [error.message] };
  }

  const result = await sendWithGuards(payload, true);
  return { ...result, template: kind };
}

// 只有 CLI 直接執行時才印到終端機;被 vite middleware require 進來時不印,也不動 exitCode。
function logCliResult(result) {
  switch (result.status) {
    case "mock":
      console.log(result.message);
      break;
    case "blocked":
      if (result.reason === "missing_token_or_target") {
        console.error(result.message);
        process.exitCode = 1;
      } else {
        console.log(result.message);
      }
      break;
    case "sent":
      console.log(`LINE API success: ${result.lineStatus}`);
      if (result.body) console.log(result.body);
      break;
    case "line_api_error":
      console.error(`LINE API failed: ${result.lineStatus} ${result.statusText}`);
      console.error(result.body || "(empty response body)");
      process.exitCode = 1;
      break;
    default:
      break;
  }
}

async function main() {
  loadLocalEnv();

  const report = readReport();
  assertReportContract(report);

  const flexMode = process.argv.includes("--flex");
  const payload = flexMode ? buildFlexPayload(report) : buildPayload(report);
  writePayload(payload, flexMode ? FLEX_PAYLOAD_PATH : PAYLOAD_PATH);

  const confirmed = process.argv.includes("--confirm");
  const result = await sendWithGuards(payload, confirmed);
  logCliResult(result);
}

// require.main === module:只有「直接 node 執行」才跑 main();被 require 進來(vite middleware)只定義函式,不送任何東西。
if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  handlePush,
  sendWithGuards,
  loadLocalEnv,
  readReport,
  readOrders,
  assertReportContract,
  assertOrderContract,
  buildFlexPayload,
  buildOrderFlexPayload,
};
