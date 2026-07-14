import { render } from '@testing-library/react-native';
import React from 'react';

// --- Mocks ---

jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({ id: 'order-1' })),
}));

jest.mock('expo-image', () => ({ Image: 'Image' }));

jest.mock('@/hooks/useOrders', () => ({
  useOrder: jest.fn(),
}));

jest.mock('@/components/ReviewModal', () => ({
  ReviewModal: () => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID: 'review-modal' });
  },
}));

import { useOrder } from '@/hooks/useOrders';
import OrderDetailScreen from '../../app/(food-saver)/order/[id]';

describe('OrderDetailScreen', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders order items and status badge', async () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: { order: baseOrder },
      isLoading: false,
      isError: false,
    });
    const { getByText } = await render(<OrderDetailScreen />);
    expect(getByText('Selesai')).toBeTruthy();
    expect(getByText('LAST-ABCD')).toBeTruthy();
    expect(getByText('Nasi Goreng')).toBeTruthy();
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
