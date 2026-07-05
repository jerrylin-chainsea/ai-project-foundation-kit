export function classifyInventoryItem(item) {
  if (item.stock <= 0) return 'out';
  if (item.stock <= item.reorderPoint) return 'low';
  return 'healthy';
}

export function getInventoryShortage(item) {
  return Math.max(item.reorderPoint - item.stock, 0);
}

export function getLowStockItems(items) {
  return items
    .filter((item) => classifyInventoryItem(item) !== 'healthy')
    .map((item) => ({
      ...item,
      status: classifyInventoryItem(item),
      shortage: getInventoryShortage(item),
      exposure: getInventoryShortage(item) * item.unitPrice,
    }))
    .sort((a, b) => b.exposure - a.exposure);
}

export function getBlockedOrders(items) {
  return items
    .filter((order) => order.status === '缺料等待' || order.priority === 'high')
    .sort((a, b) => b.amount - a.amount);
}

export function getPendingLineOrders(orderItems) {
  // C2-HOLE: 課堂要在這裡完成 LINE OA 客服確認規則。
  // 目標：回傳 channel === 'LINE OA' 且 status !== '已出貨' 的訂單。
  // 這個 helper 會同時影響 KPI、客服清單、action queue 三個畫面位置。
  return [];
}

export function summarizeWarehouse(items, orderItems) {
  const lowStockItems = getLowStockItems(items);
  const blockedOrders = getBlockedOrders(orderItems);
  const openOrders = orderItems.filter((order) => order.status !== '已出貨');
  const pendingLineOrders = getPendingLineOrders(orderItems);
  const revenueAtRisk = blockedOrders.reduce((sum, order) => sum + order.amount, 0);
  const linePendingRevenue = pendingLineOrders.reduce((sum, order) => sum + order.amount, 0);

  return {
    totalSku: items.length,
    lowStockCount: lowStockItems.length,
    outOfStockCount: lowStockItems.filter((item) => item.status === 'out').length,
    openOrderCount: openOrders.length,
    blockedOrderCount: blockedOrders.length,
    linePendingCount: pendingLineOrders.length,
    linePendingRevenue,
    revenueAtRisk,
    nextAction:
      blockedOrders.length > 0
        ? `先處理 ${blockedOrders[0].id}，避免 ${blockedOrders[0].customer} 延遲出貨`
        : '目前沒有高風險訂單，維持例行監控',
  };
}

export function buildActionQueue(items, orderItems) {
  const lowStockItems = getLowStockItems(items);
  const blockedOrders = getBlockedOrders(orderItems);
  const pendingLineOrders = getPendingLineOrders(orderItems);
  const actions = [];

  if (lowStockItems.length > 0) {
    const topItem = lowStockItems[0];
    actions.push({
      level: topItem.status === 'out' ? 'critical' : 'warning',
      title: `${topItem.product} 需要補貨`,
      detail: `${topItem.zone} 現有 ${topItem.stock}，安全量 ${topItem.reorderPoint}，負責人 ${topItem.owner}`,
    });
  }

  if (blockedOrders.length > 0) {
    const topOrder = blockedOrders[0];
    actions.push({
      level: 'critical',
      title: `${topOrder.id} 需要主管確認`,
      detail: `${topOrder.customer} / ${topOrder.status} / ETA ${topOrder.eta}`,
    });
  }

  if (pendingLineOrders.length > 0) {
    actions.push({
      level: 'warning',
      title: 'LINE OA 訂單需要客服確認',
      detail: `目前有 ${pendingLineOrders.length} 筆 LINE OA 訂單尚未出貨，請先確認收件人與 ETA`,
    });
  }

  return actions;
}

export function formatCurrency(value) {
  return `NT$${new Intl.NumberFormat('zh-TW').format(value)}`;
}
