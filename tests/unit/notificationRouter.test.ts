import { NotificationRouter } from '@/lib/notifications/NotificationRouter';
import { QueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { markNotificationRead } from '@/lib/api/notifications';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@/lib/api/notifications', () => ({
  markNotificationRead: jest.fn(),
}));

const mockPush = router.push as jest.Mock;
const mockMarkRead = markNotificationRead as jest.Mock;

describe('NotificationRouter Unit Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    jest.spyOn(queryClient, 'invalidateQueries').mockImplementation(jest.fn());
  });

  describe('normalize()', () => {
    it('handles null/undefined payloads gracefully', () => {
      expect(NotificationRouter.normalize(null)).toEqual({ type: 'general' });
    });

    it('handles flat domain Notification payloads', () => {
      const payload = {
        id: '123',
        type: 'stock_alert',
        productId: 'prod-1',
        orderId: 'ord-1',
      };
      expect(NotificationRouter.normalize(payload)).toEqual({
        id: '123',
        type: 'stock_alert',
        productId: 'prod-1',
        orderId: 'ord-1',
      });
    });

    it('handles FCM style payload formats', () => {
      const rawFcm = {
        id: 'fcm-123',
        type: 'order_status',
        orderId: 'order-777',
      };
      expect(NotificationRouter.normalize(rawFcm)).toEqual({
        id: 'fcm-123',
        type: 'order_status',
        productId: undefined,
        orderId: 'order-777',
      });
    });
  });

  describe('resolveRoute()', () => {
    it('resolves correct route for Food Saver stock alerts', () => {
      const payload = { type: 'stock_alert', productId: 'p-1' };
      expect(NotificationRouter.resolveRoute(payload)).toBe('/(food-saver)/product/p-1');
    });

    it('resolves correct route for Food Saver order status', () => {
      const payload = { type: 'order_status', orderId: 'o-1' };
      expect(NotificationRouter.resolveRoute(payload)).toBe('/(food-saver)/order/o-1');
    });

    it('resolves default notifications route for general/unhandled type', () => {
      const payload = { type: 'unknown_type' };
      expect(NotificationRouter.resolveRoute(payload)).toBe('/(food-saver)/notifications');
    });

    it('resolves Mitra route for dashboard update', () => {
      const payload = { type: 'dashboard_update' };
      expect(NotificationRouter.resolveRoute(payload, 'MITRA')).toBe('/(mitra)');
    });

    it('resolves default Mitra route for other types for Mitra role', () => {
      const payload = { type: 'stock_alert' };
      expect(NotificationRouter.resolveRoute(payload, 'MITRA')).toBe('/(mitra)');
    });
  });

  describe('resolveInvalidationKeys()', () => {
    it('returns notifications cache keys in all cases', () => {
      const keys = NotificationRouter.resolveInvalidationKeys({ type: 'general' });
      expect(keys).toContainEqual(['notifications']);
    });

    it('adds products cache keys for Food Saver stock alerts', () => {
      const keys = NotificationRouter.resolveInvalidationKeys({ type: 'stock_alert' });
      expect(keys).toContainEqual(['products']);
    });

    it('adds orders and order-id cache keys for Food Saver order status', () => {
      const keys = NotificationRouter.resolveInvalidationKeys({ type: 'order_status', orderId: 'o-1' });
      expect(keys).toContainEqual(['orders']);
      expect(keys).toContainEqual(['order', 'o-1']);
    });

    it('adds mitra-stats and mitra-orders cache keys for Mitra dashboard updates', () => {
      const keys = NotificationRouter.resolveInvalidationKeys({ type: 'dashboard_update' }, 'MITRA');
      expect(keys).toContainEqual(['mitra-stats']);
      expect(keys).toContainEqual(['mitra-orders']);
    });
  });

  describe('handleTap()', () => {
    it('marks notifications read, invalidates queries, and navigates', async () => {
      const payload = { id: 'notif-1', type: 'stock_alert', productId: 'p-1' };
      mockMarkRead.mockResolvedValueOnce(undefined);

      await NotificationRouter.handleTap(payload, {
        queryClient,
        userRole: 'FOOD_SAVER',
      });

      expect(mockMarkRead).toHaveBeenCalledWith('notif-1');
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['notifications'] });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['products'] });
      expect(mockPush).toHaveBeenCalledWith('/(food-saver)/product/p-1');
    });

    it('uses optional custom markAsReadFn if provided', async () => {
      const payload = { id: 'notif-2', type: 'general' };
      const customMarkRead = jest.fn().mockResolvedValue(undefined);

      await NotificationRouter.handleTap(payload, {
        queryClient,
        markAsReadFn: customMarkRead,
      });

      expect(customMarkRead).toHaveBeenCalledWith('notif-2');
      expect(mockMarkRead).not.toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/(food-saver)/notifications');
    });
  });
});
