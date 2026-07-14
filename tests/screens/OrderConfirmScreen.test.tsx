import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

// --- Mocks ---

jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({ id: 'order-1' })),
}));

jest.mock('@/hooks/useOrders', () => ({
  useOrder: jest.fn(),
  useConfirmPickup: jest.fn(),
}));

jest.mock('@/components/CountdownTimer', () => ({
  CountdownTimer: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID: 'countdown-timer' }, '10:00');
  },
}));

jest.mock('@/components/ConfirmDialog', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, ActivityIndicator } = require('react-native');
  return {
    ConfirmDialog: ({ visible, title, description, onConfirm, onClose, loading }: any) => {
      if (!visible) return null;
      return React.createElement(View, { testID: 'confirm-dialog' },
        React.createElement(Text, { testID: 'confirm-dialog-title' }, title),
        React.createElement(Text, { testID: 'confirm-dialog-description' }, description),
        React.createElement(TouchableOpacity, {
          onPress: onConfirm,
          testID: 'confirm-dialog-action',
          disabled: loading,
        },
          loading
            ? React.createElement(ActivityIndicator, { testID: 'loading-indicator' })
            : React.createElement(Text, null, 'confirm')
        ),
        React.createElement(TouchableOpacity, { onPress: onClose, testID: 'confirm-dialog-cancel' },
          React.createElement(Text, null, 'Batal')
        ),
      );
    },
  };
});

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('expo-image', () => ({ Image: 'Image' }));

import OrderConfirmScreen from '../../app/(food-saver)/(tabs)/order/confirm/[id]';
import { useOrder, useConfirmPickup } from '@/hooks/useOrders';

describe('OrderConfirmScreen', () => {
  const mockOrder = {
    order: {
      id: 'order-1',
      status: 'READY',
      pickupCode: 'LAST-ABCD',
      total: 55000,
      savingAmount: 15000,
      storeName: 'Test Store',
      pickupExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      items: [
        { id: 'item-1', productId: 'p1', name: 'Nasi Goreng', storeName: 'Test Store', price: 25000, originalPrice: 35000, quantity: 2, imageUrl: null, imageVariants: null },
        { id: 'item-2', productId: 'p2', name: 'Es Teh', storeName: 'Test Store', price: 5000, originalPrice: 8000, quantity: 1, imageUrl: null, imageVariants: null },
      ],
      buyerName: 'John Doe',
      buyerPhone: '08123456789',
    },
  };

  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useOrder as jest.Mock).mockReturnValue({
      data: mockOrder,
      isLoading: false,
      isError: false,
    });
    (useConfirmPickup as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('renders pickup code and confirm button', async () => {
    const { getByText } = await render(<OrderConfirmScreen />);
    expect(getByText('LAST-ABCD')).toBeTruthy();
    expect(getByText('Saya Sudah Mengambil Pesanan')).toBeTruthy();
  });

  it('shows ConfirmDialog when confirm button tapped', async () => {
    const { getByText, findByTestId } = await render(<OrderConfirmScreen />);
    fireEvent.press(getByText('Saya Sudah Mengambil Pesanan'));
    expect(await findByTestId('confirm-dialog')).toBeTruthy();
    expect(getByText('Konfirmasi Pengambilan')).toBeTruthy();
  });

  it('shows loading indicator when isPending is true', async () => {
    (useConfirmPickup as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });
    const { getByText, findByTestId } = await render(<OrderConfirmScreen />);
    fireEvent.press(getByText('Saya Sudah Mengambil Pesanan'));
    expect(await findByTestId('loading-indicator')).toBeTruthy();
  });

  it('handles error state when order fails to load', async () => {
    (useOrder as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });
    const { getByText } = await render(<OrderConfirmScreen />);
    expect(getByText('Gagal memuat pesanan')).toBeTruthy();
  });
});
