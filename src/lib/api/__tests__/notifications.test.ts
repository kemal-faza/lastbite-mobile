import { fetchNotifications, markNotificationRead, type NotificationData } from '../notifications';

describe('notifications API stub', () => {
  it('fetchNotifications returns empty array (no throw)', async () => {
    const res = await fetchNotifications();
    expect(res.notifications).toEqual([]);
    expect(res.unreadCount).toBe(0);
  });

  it('markNotificationRead returns success (no throw)', async () => {
    const res = await markNotificationRead('n1');
    expect(res.success).toBe(true);
  });

  it('NotificationData type accepts valid shape', () => {
    const n: NotificationData = {
      id: 'n1',
      type: 'order_status',
      title: 'Pesanan diproses',
      body: 'Pesananmu sedang diproses',
      isRead: false,
      createdAt: '2026-07-10T12:00:00Z',
      data: { orderId: 'o1' },
    };
    expect(n.type).toBe('order_status');
  });
});
