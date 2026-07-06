import { drinkOrders } from './shopData.js';
import { formatCurrency } from './shopLogic.js';
import OrderBoardCanvas from './OrderBoardCanvas.jsx';
import { TiltedCard, GlareHover } from './uiEffects.jsx';

const statusStep = {
  待製作: 1,
  製作中: 2,
  待取餐: 3,
  缺料等待: 0,
  已取餐: 4,
};

function OrderLane({ order }) {
  const step = statusStep[order.status] ?? 0;
  const card = (
    <article className={`order-lane priority-${order.priority}`}>
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
        <span>{order.zone}</span>
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

export default function OrderBoard() {
  const blocked = drinkOrders.filter((order) => order.status === '缺料等待' || order.priority === 'high');

  return (
    <main className="flow-shell">
      <header className="flow-hero">
        <div>
          <p className="eyebrow solid">C3 · API / webhook / token / visual state</p>
          <h2>訂單狀態看板</h2>
          <p>
            這裡把訂單拆成「狀態、金額、備料區、ETA」四種可以被前端與 LINE Flex 共用的資訊。
            課堂會從這裡連到 `/api/send-line-flex`，理解前端送 payload、後端帶 token 的邊界。
          </p>
        </div>
        <aside className="flow-alert">
          <span>needs review</span>
          <strong>{blocked.length}</strong>
          <small>high priority or blocked orders</small>
        </aside>
      </header>

      <section className="flow-visual" aria-label="訂單流動動畫">
        <OrderBoardCanvas />
        <div>
          <p className="eyebrow solid">live map</p>
          <h3>把訂單狀態變成看得懂的路徑</h3>
          <p>
            紅色杯代表缺料等待，藍色/綠色/橘色杯代表不同履約狀態。
            C3 可以用這個畫面講清楚資料如何驅動畫面，而不是只看靜態表格。
          </p>
        </div>
      </section>

      <section className="flow-board" aria-label="訂單流程板">
        {drinkOrders.map((order) => (
          <OrderLane order={order} key={order.id} />
        ))}
      </section>

      <section className="flow-note">
        <h3>會接到 C3 的兩條線</h3>
        <div>
          <p>
            畫面線：前端元件讀資料，決定狀態點、警示色與欄位顯示。這是學生認識 components、CSS、src 的入口。
          </p>
          <p>
            平台線：推播按鈕只送 template/reviewed 到本機後端，LINE token 留在 `line-lab/.env`，不進瀏覽器。
          </p>
        </div>
      </section>
    </main>
  );
}
