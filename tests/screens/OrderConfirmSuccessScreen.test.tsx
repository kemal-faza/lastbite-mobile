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

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('@/components/ConfirmDialog', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ConfirmDialog: ({ visible, title, onConfirm, onClose }: any) => {
      if (!visible) return null;
      return React.createElement(View, { testID: 'confirm-dialog' },
        React.createElement(Text, null, title),
        React.createElement(TouchableOpacity, { onPress: onConfirm, testID: 'confirm-dialog-action' },
          React.createElement(Text, null, 'confirm')
        ),
        React.createElement(TouchableOpacity, { onPress: onClose, testID: 'confirm-dialog-cancel' },
          React.createElement(Text, null, 'Batal')
        ),
      );
    },
  };
});

jest.mock('lottie-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) =>
      React.createElement(View, { testID: props.testID || 'lottie-view', ...props }),
  };
});

jest.mock('@/components/ReviewModal', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ReviewModal: ({ visible, onClose, orderId, productName }: any) => {
      if (!visible) return null;
      return React.createElement(View, { testID: 'review-modal' },
        React.createElement(Text, null, productName),
        React.createElement(TouchableOpacity, { onPress: onClose, testID: 'review-modal-close' },
          React.createElement(Text, null, 'Close')
        ),
      );
    },
  };
});

jest.mock('expo-image', () => ({ Image: 'Image' }));

import OrderConfirmScreen from '../../app/(food-saver)/order/confirm/[id]';
import { useOrder, useConfirmPickup } from '@/hooks/useOrders';

describe('OrderConfirmSuccessScreen', () => {
  const mockOrder = {
    order: {
      id: 'order-1',
      status: 'PICKED_UP',
      pickupCode: 'LAST-ABCD',
      total: 55000,
      savingAmount: 15000,
      storeName: 'Test Store',
      pickupExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
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
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useOrder as jest.Mock).mockReturnValue({
      data: mockOrder,
      isLoading: false,
      isError: false,
    });
    (useConfirmPickup as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  it('renders success title and description when order status is PICKED_UP', async () => {
    const { getByText } = await render(<OrderConfirmScreen />);
    expect(getByText('Pesanan Berhasil Diambil')).toBeTruthy();
    expect(
      getByText(/Terima kasih telah berkontribusi mengurangi food waste/)
    ).toBeTruthy();
  });

  it('renders three CTA buttons', async () => {
    const { getByText } = await render(<OrderConfirmScreen />);
    expect(getByText('Cari Makanan Lagi')).toBeTruthy();
    expect(getByText('Lihat Riwayat Pesanan')).toBeTruthy();
    expect(getByText('Tulis Ulasan')).toBeTruthy();
  });

  it('renders Lottie animation via testID', async () => {
    const { getByTestId } = await render(<OrderConfirmScreen />);
    expect(getByTestId('lottie-success')).toBeTruthy();
  });

  it('opens ReviewModal when Tulis Ulasan tapped', async () => {
    const { getByText, queryByTestId, findByTestId } = await render(
      <OrderConfirmScreen />
    );
    expect(queryByTestId('review-modal')).toBeNull();
    fireEvent.press(getByText('Tulis Ulasan'));
    expect(await findByTestId('review-modal')).toBeTruthy();
  });
});
