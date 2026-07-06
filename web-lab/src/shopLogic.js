export function classifyIngredient(item) {
  if (item.stock <= 0) return 'out';
  if (item.stock <= item.reorderPoint) return 'low';
  return 'healthy';
}

export function getIngredientShortage(item) {
  return Math.max(item.reorderPoint - item.stock, 0);
}

export function getLowStockIngredients(items) {
  return items
    .filter((item) => classifyIngredient(item) !== 'healthy')
    .map((item) => ({
      ...item,
      status: classifyIngredient(item),
      shortage: getIngredientShortage(item),
      exposure: getIngredientShortage(item) * item.unitPrice,
    }))
    .sort((a, b) => b.exposure - a.exposure);
}

export function getBlockedOrders(orderItems) {
  return orderItems
    .filter((order) => order.status === '缺料等待' || order.priority === 'high')
    .sort((a, b) => b.amount - a.amount);
}

export function summarizeShop(items, orderItems) {
  const lowStockItems = getLowStockIngredients(items);
  const blockedOrders = getBlockedOrders(orderItems);
  const openOrders = orderItems.filter((order) => order.status !== '已取餐');
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
        ? `先處理 ${blockedOrders[0].id}，避免 ${blockedOrders[0].customer} 久候`
        : '目前沒有高風險訂單，維持例行監控',
  };
}

export function buildActionQueue(items, orderItems) {
  const lowStockItems = getLowStockIngredients(items);
  const blockedOrders = getBlockedOrders(orderItems);
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

  // C2-HOLE: 課堂要在這裡新增第三條規則。
  // 目標：從 orderItems 找出 channel === 'LINE OA' 且 status !== '已取餐' 的訂單。
  // 驗收：action queue 出現「LINE OA 訂單需要主動聯絡客人」，而且數字必須由資料算出來。

  return actions;
}

export function formatCurrency(value) {
  return `NT$${new Intl.NumberFormat('zh-TW').format(value)}`;
}
