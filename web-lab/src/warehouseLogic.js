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

export function summarizeWarehouse(items, orderItems) {
  const lowStockItems = getLowStockItems(items);
  const blockedOrders = getBlockedOrders(orderItems);
  const openOrders = orderItems.filter((order) => order.status !== '已出貨');
  const revenueAtRisk = blockedOrders.reduce((sum, order) => sum + order.amount, 0);

  return {
    totalSku: items.length,
    lowStockCount: lowStockItems.length,
    outOfStockCount: lowStockItems.filter((item) => item.status === 'out').length,
    openOrderCount: openOrders.length,
    blockedOrderCount: blockedOrders.length,
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
  const lineOpenOrders = orderItems.filter((order) => order.channel === 'LINE OA' && order.status !== '已出貨');
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

  if (lineOpenOrders.length > 0) {
    actions.push({
      level: 'warning',
      title: 'LINE OA 訂單需要客服確認',
      detail: `${lineOpenOrders.length} 筆尚未出貨，請客服確認回覆與出貨狀態`,
    });
  }

  return actions;
}

export function formatCurrency(value) {
  return `NT$${new Intl.NumberFormat('zh-TW').format(value)}`;
}
