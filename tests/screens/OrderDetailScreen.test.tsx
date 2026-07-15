import { render } from '@testing-library/react-native';
import React from 'react';

// --- Mocks ---

jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn(), navigate: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({ id: 'order-1' })),
}));

jest.mock('expo-image', () => ({ Image: 'Image' }));

jest.mock('@/hooks/useOrders', () => ({
  useOrder: jest.fn(),
  useConfirmPickup: jest.fn(),
}));

jest.mock('@/components/ReviewModal', () => ({
  ReviewModal: () => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID: 'review-modal' });
  },
}));

jest.mock('@/components/ConfirmDialog', () => ({
  ConfirmDialog: () => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID: 'confirm-dialog' });
  },
}));

jest.mock('@/components/CountdownTimer', () => ({
  CountdownTimer: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, '59:59');
  },
}));

jest.mock('lottie-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => React.createElement(View, { testID: 'lottie-view' });
});

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('@/hooks/useBackHandler', () => ({
  useBackHandler: jest.fn(),
}));

import { useOrder, useConfirmPickup } from '@/hooks/useOrders';
import OrderDetailScreen from '../../app/(food-saver)/(tabs)/order/[id]';

const baseOrder = {
  id: 'order-1',
  status: 'PICKED_UP',
  pickupCode: 'LAST-ABCD',
  total: 55000,
  savingAmount: 15000,
  storeName: 'Test Store',
  items: [
    {
      id: 'item-1',
      productId: 'p1',
      name: 'Nasi Goreng',
      storeName: 'Test Store',
      price: 25000,
      originalPrice: 35000,
      quantity: 2,
      imageUrl: null,
      imageVariants: null,
    },
  ],
  buyerName: 'John Doe',
  buyerPhone: '08123456789',
  createdAt: '2025-01-15T10:00:00Z',
  hasReviewed: false,
};

describe('OrderDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useConfirmPickup as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  it('renders order items and pickup code for PICKED_UP', async () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: { order: baseOrder },
      isLoading: false,
      isError: false,
    });
    const { getByText } = await render(<OrderDetailScreen />);
    expect(getByText('LAST-ABCD')).toBeTruthy();
    expect(getByText(/Nasi Goreng/)).toBeTruthy();
  });

  it('shows review button for PICKED_UP without review', async () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: { order: { ...baseOrder, hasReviewed: false } },
      isLoading: false,
      isError: false,
    });
    const { getByText } = await render(<OrderDetailScreen />);
    expect(getByText('Tulis Ulasan')).toBeTruthy();
  });

  it('does not show review button for CANCELLED orders', async () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: { order: { ...baseOrder, status: 'CANCELLED' } },
      isLoading: false,
      isError: false,
    });
    const { queryByText } = await render(<OrderDetailScreen />);
    expect(queryByText('Tulis Ulasan')).toBeNull();
  });

  it('does not show review button when hasReviewed=true', async () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: { order: { ...baseOrder, hasReviewed: true } },
      isLoading: false,
      isError: false,
    });
    const { queryByText } = await render(<OrderDetailScreen />);
    expect(queryByText('Tulis Ulasan')).toBeNull();
  });

  it('shows pickup button and countdown for PENDING order', async () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: { order: { ...baseOrder, status: 'PENDING' } },
      isLoading: false,
      isError: false,
    });
    const { getByText } = await render(<OrderDetailScreen />);
    expect(getByText('Saya Sudah Mengambil Pesanan')).toBeTruthy();
    expect(getByText('59:59')).toBeTruthy();
  });

  it('shows success state when justChecked=true', async () => {
    // Override justChecked param
    const expoRouter = require('expo-router');
    expoRouter.useLocalSearchParams.mockReturnValue({ id: 'order-1', justChecked: 'true' });

    (useOrder as jest.Mock).mockReturnValue({
      data: { order: baseOrder },
      isLoading: false,
      isError: false,
    });
    const { getByText } = await render(<OrderDetailScreen />);
    expect(getByText('Pesanan Berhasil Diambil')).toBeTruthy();
    expect(getByText('Cari Makanan Lagi')).toBeTruthy();
    expect(getByText('Tulis Ulasan')).toBeTruthy();

    // Reset mock
    expoRouter.useLocalSearchParams.mockReturnValue({ id: 'order-1' });
  });

  it('shows loading indicator when loading', async () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });
    const { getByText } = await render(<OrderDetailScreen />);
    expect(getByText('Memuat pesanan...')).toBeTruthy();
  });

  it('shows error state when order not found', async () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });
    const { getByText } = await render(<OrderDetailScreen />);
    expect(getByText('Pesanan tidak ditemukan')).toBeTruthy();
  });
});
