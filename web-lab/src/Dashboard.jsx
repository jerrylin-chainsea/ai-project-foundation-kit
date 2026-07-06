// 營運異常 Dashboard(U3 主戰場)。
// 資料來源:data-lab/report.json(營運異常)與 data-lab/orders.json(訂單資訊)。畫面不另存副本,存檔後畫面會自動更新。
// 這裡沒有任何 LINE token。「推播 LINE Flex」按鈕呼叫的是本機後端 /api/send-line-flex,
// token 與收件對象都留在 line-lab/.env(伺服端),真正打 api.line.me 的是後端,不是這個網頁。
import { useState } from 'react';
import reportJson from '../../data-lab/report.json';
import ordersJson from '../../data-lab/orders.json';
import {
  validateReport,
  validateOrder,
  formatMoney,
  buildFlexPayload,
  buildOrderFlexPayload,
  REAL_SEND_COMMAND,
} from './reportContract.js';

// 兩個推播範本:同一套「載入 → 檢查 → 預覽 → 人審 → 推播」流程,能推不同訊息。
const TEMPLATES = {
  anomaly: { key: 'anomaly', label: '營運異常', dataFile: 'data-lab/report.json' },
  order: { key: 'order', label: '訂單資訊', dataFile: 'data-lab/orders.json' },
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
  const body = message.contents.body;
  return (
    <div className="flex-bubble" aria-label="LINE Flex 視覺預覽">
      <div className="flex-bubble-alt">altText:{message.altText}</div>
      <div className="flex-bubble-body">
        {body.contents.map((node, i) => (
          <FlexNode key={i} node={node} />
        ))}
      </div>
    </div>
  );
}

// 推播資料摘要。營運異常範本才顯示,讓學生看懂資料如何進入 Flex 前的人工審核。
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
        <strong>在推播中心人工審核後,按「推播 LINE Flex」送出</strong>
      </div>
    </div>
  );
}

// reviewer 檢查清單:送出前,人要親自看過的事。
function ReviewerChecklist() {
  const items = [
    '畫面上的數字與資料檔一致(report.json / orders.json)',
    '這則通知的內容、對象、語氣都適合送出',
    'Flex Message 的 altText、標題與內容都看得懂',
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
    return <BlockerBanner errors={result.errors} dataFile="資料檔" />;
  }
  return (
    <div className="dash-error">
      <strong>推播失敗{result.lineStatus ? `(LINE API ${result.lineStatus})` : ''}</strong>
      <p className="dash-caption">{result.body || result.message || '後端沒有回應(注意:npm run build/preview 沒有這個後端)。'}</p>
    </div>
  );
}

export default function Dashboard() {
  const [template, setTemplate] = useState('anomaly');
  const [loaded, setLoaded] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState(null);

  const isOrder = template === 'order';
  const tpl = TEMPLATES[template];
  const activeData = isOrder ? ordersJson : reportJson;
  // 驗證每次重新算(不是按鈕時存下來的):改壞資料檔存檔,擋牌會立刻出現。
  const validation = isOrder ? validateOrder(ordersJson) : validateReport(reportJson);
  const contractOk = validation.ok;
  const activePayload = isOrder ? buildOrderFlexPayload(activeData) : buildFlexPayload(activeData);

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
  }

  function switchTemplate(next) {
    if (next === template) return;
    setTemplate(next);
    resetFlow();
  }

  async function pushFlex() {
    setPushing(true);
    setPushResult(null);
    try {
      const res = await fetch('/api/send-line-flex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, reviewed: true }),
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
          「推播 LINE Flex」按鈕會呼叫本機後端 /api/send-line-flex;token 與收件對象留在 line-lab/.env(伺服端),
          永遠不進前端。真正打 api.line.me 的是後端,不是這個網頁。
        </p>
        <button className="dash-reset" type="button" onClick={resetFlow}>
          重設流程
        </button>
      </header>

      <div className="dash-tpl" role="tablist" aria-label="推播範本">
        <span className="dash-tpl-label">推播範本</span>
        {Object.values(TEMPLATES).map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={template === t.key}
            className={`dash-tpl-btn ${template === t.key ? 'active' : ''}`}
            onClick={() => switchTemplate(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <StepCard n={1} title={`載入範例資料（${tpl.dataFile}）`} done={loaded}>
        {!loaded ? (
          <button className="dash-btn" type="button" onClick={() => setLoaded(true)}>
            載入範例資料
          </button>
        ) : isOrder ? (
          <div className="dash-summary">
            <div className="dash-kv"><span>訂單編號</span><strong>{String(ordersJson.order_id ?? '(缺少)')}</strong></div>
            <div className="dash-kv"><span>客戶</span><strong>{String(ordersJson.customer ?? '(缺少)')}</strong></div>
            <div className="dash-kv"><span>通路</span><strong>{String(ordersJson.channel ?? '(缺少)')}</strong></div>
            <div className="dash-kv"><span>狀態</span><strong>{String(ordersJson.status ?? '(缺少)')}</strong></div>
            <div className="dash-kv"><span>金額</span><strong>{typeof ordersJson.amount === 'number' ? formatMoney(ordersJson.amount) : String(ordersJson.amount)}</strong></div>
            {Array.isArray(ordersJson.items) && (
              <ol className="dash-actions">
                {ordersJson.items.map((it) => (
                  <li key={it.name}>{it.name} ×{it.qty}　{formatMoney(it.price)}</li>
                ))}
              </ol>
            )}
          </div>
        ) : (
          <div className="dash-summary">
            <div className="dash-kv"><span>報表日期</span><strong>{String(reportJson.report_date ?? '(未提供)')}</strong></div>
            <div className="dash-kv"><span>風險等級</span><RiskBadge level={reportJson.risk_level} /></div>
            <div className="dash-kv"><span>總營收</span><strong>{typeof reportJson.total_revenue === 'number' ? formatMoney(reportJson.total_revenue) : String(reportJson.total_revenue)}</strong></div>
            <div className="dash-kv"><span>異常筆數</span><strong>{String(reportJson.anomaly_count ?? '(缺少)')}</strong></div>
            <div className="dash-kv"><span>Top product</span><strong>{String(reportJson.top_product ?? '(缺少)')}</strong></div>
            <div className="dash-kv"><span>Top channel</span><strong>{String(reportJson.top_channel ?? '(缺少)')}</strong></div>
            {Array.isArray(reportJson.action_items) && (
              <ol className="dash-actions">
                {reportJson.action_items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )}
            <PushReadiness report={reportJson} />
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
              <p className="dash-caption">送出前先看語氣、數字與內容是否合理。這是 LINE 上大概長怎樣。</p>
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
        <p className="dash-caption">AI / 系統做出來不算完成;你看過、勾了,才輪到推播按鈕亮起來。</p>
      </StepCard>

      <StepCard n={5} title="推播中心：按一顆按鈕送出 Flex" done={pushResult?.status === 'sent'} disabled={!canReview}>
        <div className="dash-push">
          <button className="dash-btn dash-push-btn" type="button" disabled={!canPush || pushing} onClick={pushFlex}>
            {pushing ? '推播中…' : `推播 LINE Flex（${tpl.label}）`}
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
