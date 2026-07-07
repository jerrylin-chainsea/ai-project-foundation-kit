// LINE 推播中心(U3 主戰場之二)。
// 三種訊息、三種顏色:訂單資訊(藍)/庫存警示(琥珀)/營運異常(紅)。
// 資料來源:訂單資訊與庫存警示優先吃 /api/orders 的即時資料(訂單看板同一份),
//          營運異常維持讀 data-lab/report.json(ReAct 修錯練習用它)。
// 這裡沒有任何 LINE token。「推播 LINE Flex」按鈕呼叫的是本機後端 /api/send-line-flex,
// 前端只送 template(+orderId)與 reviewed;token 與收件對象都留在 line-lab/.env(伺服端)。
import { useState } from 'react';
import reportJson from '../../data-lab/report.json';
import ordersJson from '../../data-lab/orders.json';
import {
  validateReport,
  validateOrder,
  formatMoney,
  buildFlexPayload,
  buildOrderFlexPayload,
  FLEX_THEMES,
  REAL_SEND_COMMAND,
} from './reportContract.js';

// 三個推播範本 = 三種訊息類型。同一套「載入 → 檢查 → 預覽 → 人審 → 推播」流程。
const TEMPLATES = {
  order: { key: 'order', label: '訂單資訊', tone: 'order', dataFile: '即時看板 /api/orders(沒開店時用 data-lab/orders.json)' },
  inventory: { key: 'inventory', label: '庫存警示', tone: 'inventory', dataFile: '/api/orders 的即時庫存' },
  anomaly: { key: 'anomaly', label: '營運異常', tone: 'anomaly', dataFile: 'data-lab/report.json' },
};

// 風險等級小徽章。遇到合約外的值(例如「嚴重」)會顯示灰色的「未知等級」。
function RiskBadge({ level }) {
  const known = ['low', 'medium', 'high'].includes(level);
  const className = known ? `risk-pill risk-${level}` : 'risk-pill risk-unknown';
  return <span className={className}>{known ? level : `未知等級(${String(level)})`}</span>;
}

// 一步一張卡:整條流程每次都照同一個順序走。
function StepCard({ n, title, done, disabled, children }) {
  const className = ['dash-step', done ? 'done' : '', disabled ? 'disabled' : ''].join(' ').trim();
  return (
    <section className={className} aria-disabled={disabled || undefined}>
      <div className="dash-step-head">
        <span className="dash-num">{done ? '✓' : n}</span>
        <h3>{title}</h3>
      </div>
      <div className="dash-step-body">{children}</div>
    </section>
  );
}

// 資料合約沒過時的紅色擋牌。錯誤訊息與 line-lab/sendLineAlert.js 逐字相同。
function BlockerBanner({ errors, dataFile }) {
  return (
    <div className="dash-blocker" role="alert">
      <strong>資料合約沒過,流程已被擋下</strong>
      <ul>
        {errors.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
      <p>請修正 {dataFile} 後存檔,畫面會自動更新。</p>
      <p>已阻擋:在資料合約通過前,不能生成 payload、預覽或推播。</p>
    </div>
  );
}

// 把一則 Flex message 的 bubble 畫成 LINE 大概長怎樣的卡片(視覺預覽,不是給機器讀的 JSON)。
function FlexNode({ node }) {
  if (node.type === 'separator') return <div className="flex-sep" />;
  if (node.type === 'text') {
    const cls = ['flex-text', node.weight === 'bold' ? 'bold' : '', node.size === 'lg' ? 'lg' : node.size === 'sm' ? 'sm' : '']
      .join(' ')
      .trim();
    return <div className={cls} style={{ color: node.color || '#111111' }}>{node.text}</div>;
  }
  if (node.type === 'box' && node.layout === 'baseline') {
    return (
      <div className="flex-row">
        {node.contents.map((cell, i) => (
          <span key={i} className="flex-cell" style={{ color: cell.color, flex: cell.flex }}>{cell.text}</span>
        ))}
      </div>
    );
  }
  return null;
}

function FlexBubblePreview({ message }) {
  const bubble = message.contents;
  const headerColor = bubble.styles?.header?.backgroundColor;
  return (
    <div className="flex-bubble" aria-label="LINE Flex 視覺預覽">
      <div className="flex-bubble-alt">altText:{message.altText}</div>
      {bubble.header && (
        <div className="flex-bubble-header" style={{ background: headerColor }}>
          {bubble.header.contents.map((node, i) => (
            <div key={i} className="flex-text bold lg" style={{ color: node.color || '#ffffff' }}>{node.text}</div>
          ))}
        </div>
      )}
      <div className="flex-bubble-body">
        {bubble.body.contents.map((node, i) => (
          <FlexNode key={i} node={node} />
        ))}
      </div>
    </div>
  );
}

// 推播資料摘要(report 型範本用):讓學生看懂資料如何進入 Flex 前的人工審核。
function PushReadiness({ report }) {
  return (
    <div className="dash-ready" aria-label="推播資料摘要">
      <div>
        <span>推播主題</span>
        <strong>{report.anomaly_count > 0 ? '備料短缺提醒' : '備料狀態更新'}</strong>
      </div>
      <div>
        <span>推播通道</span>
        <strong>LINE OA Flex Message</strong>
      </div>
      <div>
        <span>下一步</span>
        <strong>人工審核後,按「推播 LINE Flex」送出</strong>
      </div>
    </div>
  );
}

// reviewer 檢查清單:送出前,人要親自看過的事。
function ReviewerChecklist() {
  const items = [
    '畫面上的數字與資料來源一致(即時看板 / report.json / orders.json)',
    '這則通知的內容、對象、語氣都適合送出',
    'Flex Message 的顏色與類型相符:訂單=藍、庫存=琥珀、異常=紅',
    '收件對象正確(真送前要確認 line-lab/.env 的 LINE_TARGET_ID)',
    '已完成人工審核,才按「推播 LINE Flex」',
    '沒有 LINE OA 時,看到 [mock] 也算過關',
  ];
  return (
    <section className="dash-checklist">
      <h3>Reviewer 檢查清單</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

// 推播結果:依後端回傳的 status 顯示不同顏色與說明。前端只認 status,不碰 token。
function PushResult({ result }) {
  if (result.status === 'mock') {
    return (
      <div className="dash-mock">
        <code>{result.message}</code>
        <p className="dash-caption">
          安全預設:沒設定 token / LINE_REAL_SEND≠1,後端沒有呼叫 api.line.me。想真送 → 設好 line-lab/.env 再重啟 dev。
        </p>
      </div>
    );
  }
  if (result.status === 'sent') {
    return (
      <div className="dash-sent">
        <strong>✓ 已真送到你的 LINE OA(LINE API {result.lineStatus})</strong>
        <p className="dash-caption">後端帶著 line-lab/.env 的 token 打了 api.line.me;token 全程沒進前端。</p>
      </div>
    );
  }
  if (result.status === 'blocked') {
    const reasonText = {
      not_reviewed: '尚未完成人工審核,不能送出。',
      missing_token_or_target: 'LINE_REAL_SEND=1 但少了 token 或 LINE_TARGET_ID(在 line-lab/.env 補齊再重啟 dev)。',
    }[result.reason] || result.message;
    return (
      <div className="dash-warn">
        <strong>已阻擋</strong>
        <p className="dash-caption">{reasonText}</p>
      </div>
    );
  }
  if (result.status === 'contract_error') {
    return <BlockerBanner errors={result.errors} dataFile="資料來源" />;
  }
  return (
    <div className="dash-error">
      <strong>推播失敗{result.lineStatus ? `(LINE API ${result.lineStatus})` : ''}</strong>
      <p className="dash-caption">{result.body || result.message || '後端沒有回應(注意:npm run build/preview 沒有這個後端)。'}</p>
    </div>
  );
}

export default function Dashboard() {
  const [template, setTemplate] = useState('order');
  const [loaded, setLoaded] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState(null);

  // 即時資料:載入那一刻從 /api/orders 拍下來的快照(載入後不再自己變,方便一步一步驗收)。
  const [liveOrders, setLiveOrders] = useState(null); // null = 用靜態範例
  const [liveReport, setLiveReport] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loadNote, setLoadNote] = useState(null);

  const isOrder = template === 'order';
  const isInventory = template === 'inventory';
  const tpl = TEMPLATES[template];

  const selectedLiveOrder =
    liveOrders?.find((order) => order.order_id === selectedOrderId) ?? null;

  // 決定目前這個範本的「作用中資料」與合約檢查(每次 render 重新算:改壞資料檔,擋牌會立刻出現)。
  let activeData;
  let validation;
  if (isOrder) {
    activeData = selectedLiveOrder ?? ordersJson;
    validation = validateOrder(activeData);
  } else if (isInventory) {
    activeData = liveReport;
    validation = liveReport ? validateReport(liveReport) : { ok: false, errors: [] };
  } else {
    activeData = reportJson;
    validation = validateReport(reportJson);
  }
  const contractOk = validation.ok;
  const activePayload = contractOk
    ? isOrder
      ? buildOrderFlexPayload(activeData)
      : buildFlexPayload(activeData)
    : null;

  const canCheck = loaded;
  const canPreview = loaded && checked && contractOk;
  const canReview = canPreview && showPayload;
  const canPush = canReview && reviewed && contractOk;

  function resetFlow() {
    setLoaded(false);
    setChecked(false);
    setShowPayload(false);
    setReviewed(false);
    setShowJson(false);
    setPushResult(null);
    setLiveOrders(null);
    setLiveReport(null);
    setSelectedOrderId(null);
    setLoadNote(null);
  }

  function switchTemplate(next) {
    if (next === template) return;
    setTemplate(next);
    resetFlow();
  }

  // Button 1:載入資料。訂單/庫存範本先問 /api/orders;拿不到就退回靜態範例並說明原因。
  async function loadData() {
    if (template === 'anomaly') {
      setLoaded(true);
      return;
    }
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const snap = await res.json();
      if (isOrder) {
        const candidates = snap.orders.map((order) => ({
          order_id: order.id,
          customer: order.customer,
          channel: order.channel,
          status: order.status,
          amount: order.amount,
          items: order.items,
        }));
        const lineWaiting = candidates.filter((o) => o.channel === 'LINE OA' && o.status !== '已取餐');
        if (candidates.length === 0) {
          setLiveOrders(null);
          setLoadNote('看板目前沒有訂單(還沒開始營業?),先用 data-lab/orders.json 靜態範例。');
        } else {
          setLiveOrders(candidates);
          const preferred = lineWaiting.at(-1) ?? candidates.at(-1);
          setSelectedOrderId(preferred.order_id);
          setLoadNote(
            lineWaiting.length > 0
              ? `已自動選最新一筆 LINE OA 未取餐訂單(共 ${lineWaiting.length} 筆待處理)。`
              : '看板上目前沒有 LINE OA 未取餐訂單,先選了最新一筆。'
          );
        }
      } else {
        setLiveReport(snap.inventoryReport);
        setLoadNote('這份報告由伺服端依「現在的庫存」即時組成,欄位跟 report.json 同一份合約。');
      }
      setLoaded(true);
    } catch {
      if (isOrder) {
        setLiveOrders(null);
        setLoadNote('連不到 /api/orders(不是 npm run dev?),退回 data-lab/orders.json 靜態範例。');
        setLoaded(true);
      } else {
        setLoadNote('連不到 /api/orders:庫存警示需要 dev 後端。請在 npm run dev 下使用,或先用另外兩個範本。');
      }
    }
  }

  async function pushFlex() {
    setPushing(true);
    setPushResult(null);
    // 前端只送 template / orderId / reviewed;資料本體由伺服端權威提供。
    const body =
      isOrder && selectedLiveOrder
        ? { template: 'live-order', orderId: selectedLiveOrder.order_id, reviewed: true }
        : { template, reviewed: true };
    try {
      const res = await fetch('/api/send-line-flex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setPushResult(await res.json());
    } catch (error) {
      setPushResult({ status: 'network_error', message: String(error) });
    } finally {
      setPushing(false);
    }
  }

  return (
    <div className="dash">
      <header className="dash-header">
        <p className="eyebrow">U3 · 營運通知推播中心</p>
        <h2>營運 Dashboard · 推播中心</h2>
        <p className="dash-sub">
          三種訊息、三種顏色:訂單=藍、庫存=琥珀、異常=紅。「推播 LINE Flex」按鈕會呼叫本機後端
          /api/send-line-flex;token 與收件對象留在 line-lab/.env(伺服端),永遠不進前端。
        </p>
        <button className="dash-reset" type="button" onClick={resetFlow}>
          重設流程
        </button>
      </header>

      <div className="dash-tpl" role="tablist" aria-label="推播範本">
        <span className="dash-tpl-label">訊息類型</span>
        {Object.values(TEMPLATES).map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={template === t.key}
            className={`dash-tpl-btn ${template === t.key ? 'active' : ''}`}
            onClick={() => switchTemplate(t.key)}
          >
            <span className="tpl-dot" style={{ background: FLEX_THEMES[t.tone].color }} />
            {t.label}
          </button>
        ))}
      </div>

      <StepCard n={1} title={`載入資料(${tpl.dataFile})`} done={loaded}>
        {!loaded ? (
          <>
            <button className="dash-btn" type="button" onClick={loadData}>
              載入資料
            </button>
            {loadNote && <p className="dash-caption">{loadNote}</p>}
          </>
        ) : (
          <div className="dash-summary">
            {loadNote && <p className="dash-caption dash-loadnote">{loadNote}</p>}
            {isOrder ? (
              <>
                {liveOrders && (
                  <label className="dash-pick">
                    <span>看板訂單</span>
                    <select
                      value={selectedOrderId ?? ''}
                      onChange={(event) => setSelectedOrderId(event.target.value)}
                    >
                      {liveOrders.map((order) => (
                        <option value={order.order_id} key={order.order_id}>
                          {order.order_id}｜{order.customer}｜{order.channel}｜{order.status}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <div className="dash-kv"><span>訂單編號</span><strong>{String(activeData.order_id ?? '(缺少)')}</strong></div>
                <div className="dash-kv"><span>客戶</span><strong>{String(activeData.customer ?? '(缺少)')}</strong></div>
                <div className="dash-kv"><span>通路</span><strong>{String(activeData.channel ?? '(缺少)')}</strong></div>
                <div className="dash-kv"><span>狀態</span><strong>{String(activeData.status ?? '(缺少)')}</strong></div>
                <div className="dash-kv"><span>金額</span><strong>{typeof activeData.amount === 'number' ? formatMoney(activeData.amount) : String(activeData.amount)}</strong></div>
                {Array.isArray(activeData.items) && (
                  <ol className="dash-actions">
                    {activeData.items.map((it) => (
                      <li key={it.name}>{it.name} ×{it.qty}　{formatMoney(it.price)}</li>
                    ))}
                  </ol>
                )}
              </>
            ) : (
              activeData && (
                <>
                  <div className="dash-kv"><span>報表日期</span><strong>{String(activeData.report_date ?? '(未提供)')}</strong></div>
                  <div className="dash-kv"><span>風險等級</span><RiskBadge level={activeData.risk_level} /></div>
                  <div className="dash-kv"><span>{isInventory ? '已收營業額' : '總營收'}</span><strong>{typeof activeData.total_revenue === 'number' ? formatMoney(activeData.total_revenue) : String(activeData.total_revenue)}</strong></div>
                  <div className="dash-kv"><span>異常筆數</span><strong>{String(activeData.anomaly_count ?? '(缺少)')}</strong></div>
                  <div className="dash-kv"><span>Top product</span><strong>{String(activeData.top_product ?? '(缺少)')}</strong></div>
                  <div className="dash-kv"><span>Top channel</span><strong>{String(activeData.top_channel ?? '(缺少)')}</strong></div>
                  {Array.isArray(activeData.action_items) && (
                    <ol className="dash-actions">
                      {activeData.action_items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  )}
                  <PushReadiness report={activeData} />
                </>
              )
            )}
          </div>
        )}
      </StepCard>

      <StepCard n={2} title="檢查資料合約" done={checked && contractOk} disabled={!canCheck}>
        {!checked ? (
          <button className="dash-btn" type="button" disabled={!canCheck} onClick={() => setChecked(true)}>
            檢查資料合約
          </button>
        ) : contractOk ? (
          <div className="dash-pass">
            資料合約通過:{tpl.label}範本必要欄位齊全。
          </div>
        ) : (
          <BlockerBanner errors={validation.errors} dataFile={tpl.dataFile} />
        )}
      </StepCard>

      <StepCard n={3} title="生成 LINE Flex 預覽" done={showPayload && contractOk} disabled={!canPreview}>
        {!showPayload || !contractOk ? (
          <button className="dash-btn" type="button" disabled={!canPreview} onClick={() => setShowPayload(true)}>
            生成 Flex 預覽
          </button>
        ) : (
          <div className="dash-preview">
            <div className="dash-preview-head">
              <p className="dash-caption">送出前先看顏色、語氣、數字是否合理。這是 LINE 上大概長怎樣。</p>
              <button className="dash-copy" type="button" onClick={() => setShowJson((v) => !v)}>
                {showJson ? '看視覺預覽' : '看 JSON'}
              </button>
            </div>
            {showJson ? (
              <pre className="dash-pre">{JSON.stringify(activePayload, null, 2)}</pre>
            ) : (
              <FlexBubblePreview message={activePayload.messages[0]} />
            )}
            <p className="dash-caption">
              網頁預覽的 to 永遠是示範 ID;真送對象由 line-lab/.env 決定,token 與對象都不會出現在前端。
            </p>
          </div>
        )}
      </StepCard>

      <StepCard n={4} title="人工審核" done={reviewed && contractOk} disabled={!canReview}>
        <label className="dash-review">
          <input
            type="checkbox"
            checked={reviewed}
            disabled={!canReview}
            onChange={(event) => setReviewed(event.target.checked)}
          />
          我已人工審核這則通知內容
        </label>
        <p className="dash-caption">系統只會「建議」推播;你看過、勾了,推播按鈕才會亮起來。</p>
      </StepCard>

      <StepCard n={5} title="推播中心:按一顆按鈕送出 Flex" done={pushResult?.status === 'sent'} disabled={!canReview}>
        <div className="dash-push">
          <button className="dash-btn dash-push-btn" type="button" disabled={!canPush || pushing} onClick={pushFlex}>
            {pushing ? '推播中…' : `推播 LINE Flex(${tpl.label})`}
          </button>
          {!canPush && <p className="dash-caption">先完成上面 1–4 步(含勾選人工審核),按鈕才會亮。</p>}
          {pushResult && <PushResult result={pushResult} />}
          <p className="dash-caption dash-xref">
            這顆按鈕做的事,等同終端機:<code>node line-lab/sendLineAlert.js --flex --confirm</code>。
            真送指令參考:<code>{REAL_SEND_COMMAND}</code>
          </p>
        </div>
      </StepCard>

      <ReviewerChecklist />
    </div>
  );
}
