import { useMemo, useState } from 'react';
import { warehouse, inventory, orders, zones } from './warehouseData.js';
import OpsParticleField from './OpsParticleField.jsx';
import {
  buildActionQueue,
  classifyInventoryItem,
  formatCurrency,
  getBlockedOrders,
  getLowStockItems,
  getPendingLineOrders,
  summarizeWarehouse,
} from './warehouseLogic.js';

const statusLabel = {
  out: '缺貨',
  low: '低庫存',
  healthy: '正常',
};

const priorityLabel = {
  high: '高',
  medium: '中',
  low: '低',
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

function AlertTile({ alert, active, onSelect }) {
  return (
    <button
      type="button"
      className={`alert-tile ${alert.tone} ${active ? 'active' : ''}`}
      onClick={onSelect}
    >
      <span className="alert-light" aria-hidden="true" />
      <span className="alert-copy">
        <strong>{alert.label}</strong>
        <small>{alert.note}</small>
      </span>
      <b>{alert.value}</b>
    </button>
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

function OrderRow({ order }) {
  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.customer}</td>
      <td>{order.channel}</td>
      <td>{order.status}</td>
      <td>
        <span className={`status-chip priority-${order.priority}`}>
          {priorityLabel[order.priority]}
        </span>
      </td>
      <td>{order.zone}</td>
      <td>{formatCurrency(order.amount)}</td>
      <td>{order.eta}</td>
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

function IssueDetail({ selected, lowStockItems, blockedOrders, pendingLineOrders }) {
  const outItems = lowStockItems.filter((item) => item.status === 'out');
  const lowItems = lowStockItems.filter((item) => item.status === 'low');
  const details = {
    out: {
      title: '缺貨商品',
      rows: outItems.map((item) => ({
        title: `${item.sku} / ${item.product}`,
        meta: `${item.zone} / 現有 ${item.stock} / 安全量 ${item.reorderPoint} / ${item.owner}`,
      })),
    },
    low: {
      title: '低庫存商品',
      rows: lowItems.map((item) => ({
        title: `${item.sku} / ${item.product}`,
        meta: `${item.zone} / 缺 ${item.shortage} / ${item.owner}`,
      })),
    },
    blocked: {
      title: '需介入訂單',
      rows: blockedOrders.map((order) => ({
        title: `${order.id} / ${order.customer}`,
        meta: `${order.channel} / ${order.status} / ETA ${order.eta} / ${formatCurrency(order.amount)}`,
      })),
    },
    line: {
      title: 'LINE OA 待確認',
      rows: pendingLineOrders.map((order) => ({
        title: `${order.id} / ${order.customer}`,
        meta: `${order.status} / ETA ${order.eta} / ${formatCurrency(order.amount)}`,
      })),
    },
  };
  const detail = details[selected] ?? details.blocked;

  return (
    <article className="issue-panel">
      <div className="panel-head">
        <h3>{detail.title}</h3>
        <span>{detail.rows.length} items</span>
      </div>
      <div className="compact-list">
        {detail.rows.length === 0 ? (
          <div className="stock-line muted">
            <strong>目前沒有資料</strong>
            <span>完成 C2 規則後，相關訂單會出現在這裡</span>
          </div>
        ) : (
          detail.rows.map((row) => (
            <div className="stock-line" key={row.title}>
              <strong>{row.title}</strong>
              <span>{row.meta}</span>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

export default function WarehouseAdmin() {
  const [selectedIssue, setSelectedIssue] = useState('blocked');
  const summary = useMemo(() => summarizeWarehouse(inventory, orders), []);
  const lowStockItems = useMemo(() => getLowStockItems(inventory), []);
  const blockedOrders = useMemo(() => getBlockedOrders(orders), []);
  const pendingLineOrders = useMemo(() => getPendingLineOrders(orders), []);
  const actionQueue = useMemo(() => buildActionQueue(inventory, orders), []);
  const outOfStockItems = lowStockItems.filter((item) => item.status === 'out');
  const warningStockItems = lowStockItems.filter((item) => item.status === 'low');
  const alerts = [
    {
      id: 'out',
      label: '缺貨商品',
      value: outOfStockItems.length,
      note: '採購確認',
      tone: outOfStockItems.length > 0 ? 'critical' : 'ok',
    },
    {
      id: 'low',
      label: '低庫存商品',
      value: warningStockItems.length,
      note: '安全量以下',
      tone: warningStockItems.length > 0 ? 'warning' : 'ok',
    },
    {
      id: 'blocked',
      label: '需介入訂單',
      value: blockedOrders.length,
      note: '缺料或高優先',
      tone: blockedOrders.length > 0 ? 'critical' : 'ok',
    },
    {
      id: 'line',
      label: 'LINE OA 待確認',
      value: pendingLineOrders.length,
      note: '客服回覆前檢查',
      tone: pendingLineOrders.length > 0 ? 'warning' : 'pending',
    },
  ];

  return (
    <main className="admin-shell">
      <OpsParticleField />
      <header className="admin-hero">
        <div>
          <p className="eyebrow solid">warehouse operations</p>
          <h2 className="admin-title">
            <span>{warehouse.name}</span>
            <span>控制台</span>
          </h2>
        </div>
        <div className="admin-meta">
          <span>{warehouse.date}</span>
          <strong>{warehouse.owner}</strong>
          <small>SLA {warehouse.slaTarget}</small>
        </div>
      </header>

      <section className="metric-grid" aria-label="倉儲摘要">
        <MetricCard label="商品貨號" value={summary.totalSku} note="庫存品項" />
        <MetricCard label="開放訂單" value={summary.openOrderCount} note={`${summary.blockedOrderCount} 筆需介入`} tone="danger" />
        <MetricCard label="LINE OA" value={summary.linePendingCount} note={`${formatCurrency(summary.linePendingRevenue)} 待確認`} tone="warn" />
        <MetricCard label="風險金額" value={formatCurrency(summary.revenueAtRisk)} note="blocked orders" tone="dark" />
      </section>

      <section className="ops-workbench">
        <div className="alert-board" aria-label="異常警示">
          {alerts.map((alert) => (
            <AlertTile
              alert={alert}
              active={selectedIssue === alert.id}
              key={alert.id}
              onSelect={() => setSelectedIssue(alert.id)}
            />
          ))}
        </div>
        <IssueDetail
          selected={selectedIssue}
          lowStockItems={lowStockItems}
          blockedOrders={blockedOrders}
          pendingLineOrders={pendingLineOrders}
        />
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
            <h3>處理佇列</h3>
            <span>{actionQueue.length} actions</span>
          </div>
          <ol className="action-list">
            {actionQueue.map((item) => (
              <ActionItem item={item} key={`${item.level}-${item.title}`} />
            ))}
          </ol>
        </article>
      </section>

      <section className="admin-panel">
        <div className="panel-head">
          <h3>訂單資料表</h3>
          <span>{orders.length} rows</span>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>訂單</th>
                <th>客戶</th>
                <th>通路</th>
                <th>狀態</th>
                <th>優先</th>
                <th>Zone</th>
                <th>金額</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow order={order} key={order.id} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-head">
          <h3>庫存資料表</h3>
          <span>{inventory.length} rows</span>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>商品貨號</th>
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
