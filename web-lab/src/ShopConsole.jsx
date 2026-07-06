import { useMemo } from 'react';
import { shop, drinkMenuItems, drinkOrders, zones } from './shopData.js';
import {
  buildActionQueue,
  classifyIngredient,
  formatCurrency,
  getIngredientShortage,
  getLowStockIngredients,
  summarizeShop,
} from './shopLogic.js';
import { SpotlightCard, CountUp } from './uiEffects.jsx';

const statusLabel = {
  out: '缺貨',
  low: '低庫存',
  healthy: '正常',
};

function MetricCard({ label, value, note, tone = 'neutral', numeric }) {
  return (
    <SpotlightCard className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{numeric !== undefined ? <CountUp value={numeric} /> : value}</strong>
      <small>{note}</small>
    </SpotlightCard>
  );
}

function IngredientRow({ item }) {
  const status = classifyIngredient(item);
  return (
    <tr>
      <td>{item.sku}</td>
      <td>{item.product}</td>
      <td>{item.zone}</td>
      <td>{item.stock}</td>
      <td>{item.reorderPoint}</td>
      <td>
        <span className={`status-chip ${status}`}>{statusLabel[status]}</span>
      </td>
      <td>{item.owner}</td>
    </tr>
  );
}

function ActionItem({ item }) {
  return (
    <li className={`action-item ${item.level}`}>
      <strong>{item.title}</strong>
      <span>{item.detail}</span>
    </li>
  );
}

export default function ShopConsole() {
  const summary = useMemo(() => summarizeShop(drinkMenuItems, drinkOrders), []);
  const lowStockItems = useMemo(() => getLowStockIngredients(drinkMenuItems), []);
  const actionQueue = useMemo(() => buildActionQueue(drinkMenuItems, drinkOrders), []);

  return (
    <main className="admin-shell">
      <header className="admin-hero">
        <p className="eyebrow solid">C2 · AGENTS.md / CLAUDE.md / Plan Mode</p>
        <h2>{shop.name} 備料控制台</h2>
        <p>
          這一頁是 C2 的主戰場：學生會在既有控制台裡做小範圍開發，練習先規劃、再實作、最後驗證。
          C3 的訂單看板與 LINE Flex 會沿用這裡的資料語言。
        </p>
      </header>

      <section className="metric-grid" aria-label="備料摘要">
        <MetricCard label="品項總數" numeric={summary.totalSku} note="menu source" />
        <MetricCard label="低庫存品項" numeric={summary.lowStockCount} note={`${summary.outOfStockCount} 項缺貨`} tone="warn" />
        <MetricCard label="待處理訂單" numeric={summary.openOrderCount} note={`${summary.blockedOrderCount} 筆需介入`} tone="danger" />
        <MetricCard label="風險金額" value={formatCurrency(summary.revenueAtRisk)} note="blocked orders" tone="dark" />
      </section>

      <section className="admin-band">
        <div>
          <p className="eyebrow solid">next action</p>
          <h3>今日優先處理</h3>
          <p className="admin-lead">{summary.nextAction}</p>
        </div>
        <ol className="action-list">
          {actionQueue.map((item) => (
            <ActionItem item={item} key={`${item.level}-${item.title}`} />
          ))}
        </ol>
      </section>

      <section className="admin-grid">
        <article className="admin-panel">
          <div className="panel-head">
            <h3>備料區水位</h3>
            <span>{shop.date}</span>
          </div>
          <div className="zone-grid">
            {zones.map((zone) => (
              <div className={`zone-card ${zone.status}`} key={zone.id}>
                <div>
                  <strong>{zone.id}</strong>
                  <span>{zone.label}</span>
                </div>
                <meter min="0" max="100" value={zone.utilization} />
                <small>{zone.utilization}% utilization</small>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="panel-head">
            <h3>低庫存明細</h3>
            <span>{lowStockItems.length} rows</span>
          </div>
          <div className="compact-list">
            {lowStockItems.map((item) => (
              <div className="stock-line" key={item.sku}>
                <strong>{item.product}</strong>
                <span>
                  {item.zone} / 缺 {getIngredientShortage(item)} / {item.owner}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-panel">
        <div className="panel-head">
          <h3>品項資料表</h3>
          <span>readable by agent</span>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>品項</th>
                <th>Zone</th>
                <th>庫存</th>
                <th>安全量</th>
                <th>狀態</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {drinkMenuItems.map((item) => (
                <IngredientRow item={item} key={item.sku} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
