import { useMemo } from 'react';
import { warehouse, inventory, orders, zones } from './warehouseData.js';
import {
  buildActionQueue,
  classifyInventoryItem,
  formatCurrency,
  getInventoryShortage,
  getLowStockItems,
  summarizeWarehouse,
} from './warehouseLogic.js';

const statusLabel = {
  out: '缺貨',
  low: '低庫存',
  healthy: '正常',
};

function MetricCard({ label, value, note, tone = 'neutral' }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function InventoryRow({ item }) {
  const status = classifyInventoryItem(item);
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

export default function WarehouseAdmin() {
  const summary = useMemo(() => summarizeWarehouse(inventory, orders), []);
  const lowStockItems = useMemo(() => getLowStockItems(inventory), []);
  const actionQueue = useMemo(() => buildActionQueue(inventory, orders), []);

  return (
    <main className="admin-shell">
      <header className="admin-hero">
        <p className="eyebrow solid">C2 · AGENTS.md / CLAUDE.md / Plan Mode</p>
        <h2>{warehouse.name} 後台倉儲管理系統</h2>
        <p>
          這一頁是 C2 的主戰場：學生會在既有後台裡做小範圍開發，練習先規劃、再實作、最後驗證。
          C3 的訂單可視化與 LINE Flex 會沿用這裡的資料語言。
        </p>
      </header>

      <section className="metric-grid" aria-label="倉儲摘要">
        <MetricCard label="SKU 總數" value={summary.totalSku} note="inventory source" />
        <MetricCard label="低庫存 SKU" value={summary.lowStockCount} note={`${summary.outOfStockCount} 項缺貨`} tone="warn" />
        <MetricCard label="開放訂單" value={summary.openOrderCount} note={`${summary.blockedOrderCount} 筆需介入`} tone="danger" />
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
            <h3>區域水位</h3>
            <span>{warehouse.date}</span>
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
                  {item.zone} / 缺 {getInventoryShortage(item)} / {item.owner}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-panel">
        <div className="panel-head">
          <h3>庫存資料表</h3>
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
              {inventory.map((item) => (
                <InventoryRow item={item} key={item.sku} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
