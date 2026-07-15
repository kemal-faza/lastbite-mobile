import { mapNotification, formatRelativeTime } from '../../src/lib/api/notifications';
import type { RawNotification, Notification } from '../../src/lib/api/notifications';

jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

describe('mapNotification', () => {
  const mockRaw: RawNotification = {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Stok Tersedia!',
    body: 'Nasi Padang sudah tersedia lagi.',
    type: 'stock_alert',
    data: { productId: 'prod-1', type: 'stock_alert' },
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  it('extracts productId from data', () => {
    const result = mapNotification(mockRaw);
    expect(result.productId).toBe('prod-1');
  });

  it('extracts orderId from data when present', () => {
    const orderNotif: RawNotification = {
      ...mockRaw,
      type: 'order_status',
      data: { orderId: 'order-1', type: 'order_status' },
    };
    const result = mapNotification(orderNotif);
    expect(result.orderId).toBe('order-1');
  });

  it('assigns default type when missing', () => {
    const noType: RawNotification = { ...mockRaw, type: '' };
    const result = mapNotification(noType);
    expect(result.type).toBe('general');
  });

  it('generates relativeTime', () => {
    const result = mapNotification(mockRaw);
    expect(result.relativeTime).toBeDefined();
    expect(typeof result.relativeTime).toBe('string');
  });
});

describe('formatRelativeTime', () => {
  it('shows "Baru saja" for < 1 minute', () => {
    const now = new Date();
    expect(formatRelativeTime(now.toISOString())).toBe('Baru saja');
  });

  it('shows "X mnt lalu" for minutes', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinAgo.toISOString())).toBe('5 mnt lalu');
  });
});
