import { renderHook, act, waitFor } from '@testing-library/react-native/pure';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useNotificationManager } from '../../src/hooks/useNotifications';
import { apiFetch } from '../../src/lib/api/client';
import { useAuthStore } from '../../src/stores/authStore';
import { router } from 'expo-router';

// 1. Mock apiFetch
jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

// 2. Mock useToast
const mockShowToast = jest.fn();
jest.mock('../../src/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

// 3. Mock expo-notifications
let receivedCallback: any = null;
let responseCallback: any = null;

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'mock-expo-token' }),
  addNotificationReceivedListener: jest.fn((cb) => {
    receivedCallback = cb;
    return { remove: jest.fn() };
  }),
  addNotificationResponseReceivedListener: jest.fn((cb) => {
    responseCallback = cb;
    return { remove: jest.fn() };
  }),
}));

// 4. Mock expo-device
jest.mock('expo-device', () => ({
  isDevice: true,
}));

const mockFoodSaverUser = {
  id: 'user-1',
  email: 'user@test.com',
  name: 'User Test',
  phone: '08123456789',
  role: 'FOOD_SAVER' as const,
  isVerified: true,
};

const mockMitraUser = {
  id: 'mitra-1',
  email: 'mitra@test.com',
  name: 'Mitra Test',
  phone: '08123456789',
  role: 'MITRA' as const,
  isVerified: true,
};

describe('useNotificationManager', () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    qc.clear();
    receivedCallback = null;
    responseCallback = null;
    useAuthStore.getState().logout();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );

  it('registers device token if authenticated', async () => {
    useAuthStore.getState().setUser(mockFoodSaverUser);

    (apiFetch as jest.Mock).mockResolvedValue({ success: true });

    const { unmount } = await renderHook(() => useNotificationManager(), { wrapper });
    await act(async () => {});

    expect(apiFetch).toHaveBeenCalledWith('/devices', {
      auth: true,
      method: 'POST',
      body: JSON.stringify({ token: 'mock-expo-token', platform: 'android' }),
    });

    unmount();
  });

  it('does not register device token if not authenticated', async () => {
    const { unmount } = await renderHook(() => useNotificationManager(), { wrapper });
    await act(async () => {});

    expect(apiFetch).not.toHaveBeenCalled();
    unmount();
  });

  describe('Foreground Received Listener', () => {
    it('invalidates appropriate queries and shows toast for order_status in foreground', async () => {
      useAuthStore.getState().setUser(mockFoodSaverUser);

      const invalidateSpy = jest.spyOn(qc, 'invalidateQueries');

      const { unmount } = await renderHook(() => useNotificationManager(), { wrapper });
      await waitFor(() => expect(receivedCallback).not.toBeNull());

      receivedCallback({
        request: {
          content: {
            title: 'Update Pesanan',
            body: 'Pesanan Anda siap diambil',
            data: { type: 'order_status', orderId: 'ord-123' },
          },
        },
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['orders'] });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['order', 'ord-123'] });
      expect(mockShowToast).toHaveBeenCalledWith('Pesanan Anda siap diambil');

      unmount();
    });

    it('invalidates dashboard queries for MITRA dashboard_update', async () => {
      useAuthStore.getState().setUser(mockMitraUser);

      const invalidateSpy = jest.spyOn(qc, 'invalidateQueries');

      const { unmount } = await renderHook(() => useNotificationManager(), { wrapper });
      await waitFor(() => expect(receivedCallback).not.toBeNull());

      receivedCallback({
        request: {
          content: {
            title: 'Dashboard Update',
            body: 'Data penjualan diperbarui',
            data: { type: 'dashboard_update' },
          },
        },
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['mitra-stats'] });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['mitra-orders'] });

      unmount();
    });
  });

  describe('Background Response/Tap Listener', () => {
    it('marks notification as read and redirects to order page on order_status tap', async () => {
      useAuthStore.getState().setUser(mockFoodSaverUser);

      (apiFetch as jest.Mock).mockResolvedValue({ success: true });

      const { unmount } = await renderHook(() => useNotificationManager(), { wrapper });
      await waitFor(() => expect(responseCallback).not.toBeNull());

      responseCallback({
        notification: {
          request: {
            content: {
              data: { id: 'notif-777', type: 'order_status', orderId: 'ord-123' },
            },
          },
        },
      });
      await act(async () => {});

      expect(apiFetch).toHaveBeenCalledWith('/notifications/notif-777/read', {
        method: 'PATCH',
        auth: true,
      });

      expect(router.push).toHaveBeenCalledWith({
        pathname: '/orders/[id]',
        params: { id: 'ord-123' },
      });

      unmount();
    });

    it('redirects to product details on stock_alert tap', async () => {
      useAuthStore.getState().setUser(mockFoodSaverUser);

      const { unmount } = await renderHook(() => useNotificationManager(), { wrapper });
      await waitFor(() => expect(responseCallback).not.toBeNull());

      responseCallback({
        notification: {
          request: {
            content: {
              data: { type: 'stock_alert', productId: 'prod-456' },
            },
          },
        },
      });
      await act(async () => {});

      expect(router.push).toHaveBeenCalledWith({
        pathname: '/product/[id]',
        params: { id: 'prod-456' },
      });

      unmount();
    });
  });
});
