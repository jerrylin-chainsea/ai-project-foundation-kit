import assert from 'node:assert/strict';
import { inventory, orders } from '../src/warehouseData.js';
import {
  buildActionQueue,
  getPendingLineOrders,
  summarizeWarehouse,
} from '../src/warehouseLogic.js';

const expectedPendingLineOrders = orders.filter(
  (order) => order.channel === 'LINE OA' && order.status !== '已出貨',
);
const actualPendingLineOrders = getPendingLineOrders(orders);

assert.deepEqual(
  actualPendingLineOrders.map((order) => order.id),
  expectedPendingLineOrders.map((order) => order.id),
  'getPendingLineOrders must return LINE OA orders that are not 已出貨.',
);

const summary = summarizeWarehouse(inventory, orders);
assert.equal(
  summary.linePendingCount,
  expectedPendingLineOrders.length,
  'summary.linePendingCount must match getPendingLineOrders result.',
);

const actionQueue = buildActionQueue(inventory, orders);
assert.ok(
  actionQueue.some((item) => item.title === 'LINE OA 訂單需要客服確認'),
  'action queue must include LINE OA customer confirmation.',
);
assert.ok(
  actionQueue.some((item) => item.title.includes('需要補貨')),
  'existing low-stock action must still exist.',
);
assert.ok(
  actionQueue.some((item) => item.title.includes('需要主管確認')),
  'existing blocked-order action must still exist.',
);

console.log('[pass] C2 warehouse logic test passed.');
