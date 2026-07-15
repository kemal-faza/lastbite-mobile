import { render } from '@testing-library/react-native';
import React from 'react';

// --- Mocks ---

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('expo-image', () => ({ Image: 'Image' }));

jest.mock('@/hooks/useOrders', () => ({
  useOrders: jest.fn(),
}));

jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({ isAuthenticated: true })),
}));

jest.mock('@/components/PrimaryButton', () => ({
  PrimaryButton: ({ children, onPress }: any) => {
    const React = require('react');
    const { Pressable, Text } = require('react-native');
    return React.createElement(Pressable, { onPress }, React.createElement(Text, null, children));
  },
}));

jest.mock('@/components/EmptyState', () => ({
  EmptyState: ({ title }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, title);
  },
}));

jest.mock('@/components/OrderStatusBadge', () => ({
  OrderStatusBadge: ({ status }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    const labels: Record<string, string> = {
      PENDING: 'Menunggu',
      PROCESSED: 'Diproses',
      READY: 'Siap Diambil',
      PICKED_UP: 'Selesai',
      CANCELLED: 'Dibatalkan',
    };
    return React.createElement(Text, null, labels[status] || status);
  },
}));

jest.mock('@/hooks/useRefreshOnFocus', () => ({
  useRefreshOnFocus: jest.fn(),
}));

// --- Imports ---

import OrdersScreen from '../../app/(food-saver)/(tabs)/orders';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/authStore';

describe('OrdersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({ isAuthenticated: true });
  });

  it('renders orders list', async () => {
    (useOrders as jest.Mock).mockReturnValue({
      data: { orders: [{ id: '1', storeName: 'Warung A', total: 25000, status: 'READY', pickupCode: 'LAST-ABCD', items: [], savingAmount: 5000, createdAt: '2026-01-15T10:00:00Z' }] },
      isLoading: false,
      isError: false,
    });
    const { getByText } = await render(<OrdersScreen />);
    expect(getByText('Warung A')).toBeTruthy();
    expect(getByText('25,000')).toBeTruthy();
  });

  it('renders login prompt when not authenticated', async () => {
    (useAuthStore as jest.Mock).mockReturnValue({ isAuthenticated: false });
    (useOrders as jest.Mock).mockReturnValue({ data: null, isLoading: false, isError: false });

    const { getByText } = await render(<OrdersScreen />);
    expect(getByText('Login untuk melihat pesanan')).toBeTruthy();
  });

  it('shows cancel status for CANCELLED orders', async () => {
    (useOrders as jest.Mock).mockReturnValue({
      data: { orders: [{ id: '2', storeName: 'Bakery', total: 15000, status: 'CANCELLED', pickupCode: 'LAST-EFGH', items: [], savingAmount: 3000, createdAt: '2026-01-15T10:00:00Z' }] },
      isLoading: false,
      isError: false,
    });
    const { getByText } = await render(<OrdersScreen />);
    expect(getByText('Bakery')).toBeTruthy();
    expect(getByText('Dibatalkan')).toBeTruthy();
  });
});
