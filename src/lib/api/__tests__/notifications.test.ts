import { getNotifications, markNotificationRead, type Notification } from '../notifications';

jest.mock('../client', () => ({
  apiFetch: jest.fn(),
}));

describe('notifications API stub', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getNotifications returns empty array (no throw)', async () => {
    const { apiFetch } = require('../client') as { apiFetch: jest.Mock };
    apiFetch.mockResolvedValueOnce({ notifications: [], unreadCount: 0 });

    const res = await getNotifications();
    expect(res.notifications).toEqual([]);
    expect(res.unreadCount).toBe(0);
  });

  it('markNotificationRead returns success (no throw)', async () => {
    const { apiFetch } = require('../client') as { apiFetch: jest.Mock };
    apiFetch.mockResolvedValueOnce({});

    await markNotificationRead('n1');
    expect(apiFetch).toHaveBeenCalledWith('/notifications/n1/read', { method: 'PATCH' });
  });

  it('Notification type accepts valid shape', () => {
    const n: Notification = {
      id: 'n1',
      type: 'order_status',
      title: 'Pesanan diproses',
      body: 'Pesananmu sedang diproses',
      isRead: false,
      createdAt: '2026-07-10T12:00:00Z',
      relativeTime: 'Baru saja',
      orderId: 'o1',
    };
    expect(n.type).toBe('order_status');
  });
});
