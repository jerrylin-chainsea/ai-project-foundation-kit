// 訂單看板(U3 主戰場):一間「營業中」的店。
// 按「開始營業」後,前端每 3 秒向本機 dev 後端 GET /api/orders 拉一次快照(輪詢 polling)。
// 打開 DevTools → Network 就能看到每一次請求與 JSON payload —— 這就是 U3 要教的 API/payload。
// 對照:webhook 是反方向(平台主動推過來);我們這裡是自己去拉。
// 這裡沒有任何 LINE token;推播都在「LINE 推播中心」人審後才送。
import { useCallback, useEffect, useRef, useState } from 'react';
import { drinkOrders } from './shopData.js';
import { formatCurrency } from './shopLogic.js';
import OrderBoardCanvas from './OrderBoardCanvas.jsx';
import { TiltedCard, GlareHover, CountUp } from './uiEffects.jsx';

const POLL_MS = 3000;

const statusStep = {
  待製作: 1,
  製作中: 2,
  待取餐: 3,
  缺料等待: 0,
  已取餐: 4,
};

function OrderLane({ order, isNew }) {
  const step = statusStep[order.status] ?? 0;
  const card = (
    <article className={`order-lane priority-${order.priority} ${isNew ? 'order-enter' : ''}`.trim()}>
      <div className="order-lane-head">
        <strong>{order.id}</strong>
        <span>{order.customer}</span>
      </div>
      <div className="flow-track" aria-label={`${order.id} fulfillment progress`}>
        {['接單', '製作', '搖製', '取餐'].map((label, index) => (
          <div className={`flow-dot ${index <= step ? 'done' : ''}`} key={label}>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="order-meta">
        <span>{order.status}</span>
        <span>{order.channel}</span>
        <span>{formatCurrency(order.amount)}</span>
        <span>ETA {order.eta}</span>
      </div>
    </article>
  );

  return order.priority === 'high' ? (
    <GlareHover className="order-lane-wrap">
      <TiltedCard className="order-lane-tilt">{card}</TiltedCard>
    </GlareHover>
  ) : (
    <TiltedCard className="order-lane-tilt">{card}</TiltedCard>
  );
}

// 備料水位面板:學員在這裡「改個數字」。
// 進貨 + / 盤點 − 都是真的 POST /api/inventory/adjust;改到低於安全量,警示馬上亮。
function InventoryPanel({ inventory, onAdjust }) {
  return (
    <section className="inv-panel" aria-label="備料水位">
      <div className="inv-head">
        <h3>備料水位(伺服端即時庫存)</h3>
        <p>訂單進入「製作中」會自動扣原料;你也可以自己改數字,看警示什麼時候亮。</p>
      </div>
      <div className="inv-rows">
        {inventory.map((item) => {
          const state = item.stock < 0 ? 'bad' : item.stock <= item.reorderPoint ? 'low' : 'ok';
          return (
            <div className={`inv-row inv-${state}`} key={item.sku}>
              <span className="inv-name">
                <strong>{item.product}</strong>
                <small>{item.sku}・{item.zone}</small>
              </span>
              <span className="inv-stock">
                庫存 <strong>{item.stock}</strong> / 安全量 {item.reorderPoint}
              </span>
              <span className="inv-flag">
                {state === 'bad' ? '數字有誤' : state === 'low' ? '需要補貨' : '正常'}
              </span>
              <span className="inv-actions">
                <button type="button" onClick={() => onAdjust(item.sku, 5)}>進貨 +5</button>
                <button type="button" onClick={() => onAdjust(item.sku, -5)}>盤點 −5</button>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function OrderBoard() {
  const [snapshot, setSnapshot] = useState(null);
  const [apiDown, setApiDown] = useState(false);
  const seenIds = useRef(new Set());
  const newIds = useRef(new Set());

  const applySnapshot = useCallback((data) => {
    // 記住哪些訂單是這一輪才出現的,讓它們帶進場動畫
    const incoming = new Set(data.orders.map((o) => o.id));
    newIds.current = new Set([...incoming].filter((id) => !seenIds.current.has(id) && seenIds.current.size > 0));
    seenIds.current = incoming;
    setSnapshot(data);
    setApiDown(false);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      applySnapshot(await res.json());
    } catch {
      setApiDown(true);
    }
  }, [applySnapshot]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  async function control(action) {
    try {
      const res = await fetch('/api/orders/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      applySnapshot(await res.json());
    } catch {
      setApiDown(true);
    }
  }

  async function adjust(sku, delta) {
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, delta }),
      });
      applySnapshot(await res.json());
    } catch {
      setApiDown(true);
    }
  }

  const live = !apiDown && snapshot;
  const orders = live ? snapshot.orders : drinkOrders;
  const running = live ? snapshot.running : false;
  const alerts = live ? snapshot.alerts : null;
  const alertCount = alerts ? alerts.lineWaitingCount + alerts.lowStock.length + alerts.invalidStock.length : 0;

  return (
    <main className="flow-shell">
      <header className="flow-hero">
        <div>
          <p className="eyebrow solid">C3 · 營業中 · API / payload / 推播</p>
          <h2>訂單狀態看板</h2>
          <p>
            按「開始營業」,訂單就會持續進來、庫存自己往下掉。畫面每 3 秒向本機後端
            GET /api/orders 拉一次資料 —— 打開 DevTools → Network,親眼看 API 與 payload 長什麼樣。
          </p>
        </div>
        <aside className="flow-alert">
          <span>needs review</span>
          <strong>{alertCount}</strong>
          <small>LINE OA 未取餐 + 庫存警示</small>
        </aside>
      </header>

      {apiDown ? (
        <section className="live-fallback" role="note">
          <strong>目前看不到即時資料(顯示靜態範例)。</strong>
          <p>
            /api/orders 只活在 <code>npm run dev</code> 的本機後端;如果你在 <code>npm run
            build/preview</code> 或後端沒開,看板會退回這份靜態訂單。回到 dev 模式就會動起來。
          </p>
        </section>
      ) : (
        <>
          <section className="live-controls" aria-label="營業模擬控制">
            <div className="live-btns">
              <button type="button" className={`live-btn ${running ? '' : 'primary'}`} onClick={() => control('start')} disabled={running}>
                開始營業
              </button>
              <button type="button" className="live-btn" onClick={() => control('pause')} disabled={!running}>
                暫停
              </button>
              <button type="button" className="live-btn danger" onClick={() => control('reset')}>
                重置
              </button>
            </div>
            <span className={`live-status ${running ? 'on' : ''}`}>
              {running ? '● 營業中:訂單持續進來' : '○ 暫停中:畫面凍結,方便講解'}
            </span>
          </section>

          {snapshot && (
            <section className="kpi-strip" aria-label="今日營運數字">
              <div className="kpi-card">
                <span>今日訂單數</span>
                <strong><CountUp value={snapshot.stats.totalToday} /></strong>
              </div>
              <div className="kpi-card">
                <span>進行中</span>
                <strong>{snapshot.stats.active}</strong>
              </div>
              <div className={`kpi-card ${snapshot.stats.blocked > 0 ? 'warn' : ''}`}>
                <span>缺料等待</span>
                <strong>{snapshot.stats.blocked}</strong>
              </div>
              <div className="kpi-card">
                <span>已收營業額</span>
                <strong>NT$<CountUp value={snapshot.stats.revenue} /></strong>
              </div>
            </section>
          )}

          {alerts && (alerts.lineWaitingCount > 0 || alerts.lowStock.length > 0 || alerts.invalidStock.length > 0) && (
            <section className="live-alerts" role="alert">
              <strong>推播建議</strong>
              <ul>
                {alerts.lineWaitingCount > 0 && (
                  <li>LINE OA 訂單 {alerts.lineWaitingCount} 筆尚未取餐 → 推播中心「訂單資訊」</li>
                )}
                {alerts.lowStock.length > 0 && (
                  <li>{alerts.lowStock.map((i) => i.product).join('、')} 低於安全量 → 推播中心「庫存警示」</li>
                )}
                {alerts.invalidStock.length > 0 && (
                  <li>{alerts.invalidStock.map((i) => i.product).join('、')} 庫存數字有誤(負數)→ 推播中心「庫存警示」</li>
                )}
              </ul>
              <p>系統只「建議」;要不要真的送出,永遠是切到上方「LINE 推播中心」人工審核後決定。</p>
            </section>
          )}
        </>
      )}

      <section className="flow-visual" aria-label="訂單流動動畫">
        <OrderBoardCanvas />
        <div>
          <p className="eyebrow solid">live map</p>
          <h3>把訂單狀態變成看得懂的路徑</h3>
          <p>
            紅色杯代表缺料等待,藍色/綠色/橘色杯代表不同履約狀態。
            資料每 3 秒更新一次,畫面就跟著資料走 —— 資料驅動畫面。
          </p>
        </div>
      </section>

      <section className="flow-board" aria-label="訂單流程板">
        {orders.map((order) => (
          <OrderLane order={order} key={order.id} isNew={newIds.current.has(order.id)} />
        ))}
        {live && orders.length === 0 && (
          <p className="live-empty">還沒有訂單。按上面的「開始營業」,第一張單馬上進來。</p>
        )}
      </section>

      {live && snapshot && <InventoryPanel inventory={snapshot.inventory} onAdjust={adjust} />}

      <section className="flow-note">
        <h3>接到推播中心的兩條線</h3>
        <div>
          <p>
            資料線:看板每 3 秒 GET /api/orders,訂單與庫存都由伺服端提供;前端只負責把資料變成畫面。
          </p>
          <p>
            推播線:警示只是「建議」。切到 LINE 推播中心,人工審核後,前端也只送 template 與 orderId,
            token 留在 line-lab/.env,真正打 api.line.me 的是後端。
          </p>
        </div>
      </section>
    </main>
  );
}
