import { render } from '@testing-library/react-native';
import React from 'react';
import MitraOrderDetailScreen from '../../app/(mitra)/orders/[id]';
import { useLocalSearchParams } from 'expo-router';

// --- Mock components ---
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onPress, disabled }: any) => {
    const React = require('react');
    const { Pressable, Text } = require('react-native');
    return React.createElement(
      Pressable,
      { onPress, disabled, testID: 'action-button' },
      typeof children === 'string'
        ? React.createElement(Text, null, children)
        : children
    );
  },
}));

// --- Mock hooks ---
jest.mock('@/hooks/useMitra', () => ({
  useMitraOrders: jest.fn(),
  useUpdateOrderStatus: jest.fn(),
}));

import { useMitraOrders, useUpdateOrderStatus } from '@/hooks/useMitra';
import type { MitraOrder } from '@/lib/api/mitra';

// Helpers
function createMockOrder(overrides?: Partial<MitraOrder>): MitraOrder {
  return {
    id: 'ORD-001',
    pickupCode: 'LAST-1234',
    status: 'PENDING',
    totalAmount: 50000,
    buyerName: 'Budi',
    buyerPhone: '08123456789',
    pickupExpiresAt: '2026-07-13T14:00:00Z',
    notes: 'Tolong dibungkus rapih',
    items: [{ id: '1', name: 'Nasi Goreng', quantity: 2, price: 25000 }],
    ...overrides,
  };
}

const mockOrders: MitraOrder[] = [
  createMockOrder(),
  createMockOrder({
    id: 'ORD-002',
    status: 'READY',
    buyerName: 'Ani',
    buyerPhone: '08111111111',
    notes: undefined,
  }),
];

function renderScreen() {
  return render(<MitraOrderDetailScreen />);
}

describe('MitraOrderDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMitraOrders as jest.Mock).mockReturnValue({
      data: { orders: mockOrders },
      refetch: jest.fn(),
      isPending: false,
      isRefetching: false,
    });
    (useUpdateOrderStatus as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useLocalSearchParams as unknown as jest.Mock).mockReturnValue({ id: 'ORD-001' });
  });

  it('renders pickup code prominently', async () => {
    const view = await renderScreen();
    expect(view.getByText('LAST-1234')).toBeTruthy();
  });

  it('renders buyer name and phone', async () => {
    const view = await renderScreen();
    expect(view.getByText('Budi')).toBeTruthy();
    expect(view.getByText('08123456789')).toBeTruthy();
  });

  it('renders order notes', async () => {
    const view = await renderScreen();
    expect(view.getByText('Tolong dibungkus rapih')).toBeTruthy();
  });

  it('renders item list (quantity x name format)', async () => {
    const view = await renderScreen();
    expect(view.getByText('2x Nasi Goreng')).toBeTruthy();
  });

  it('renders action button for PENDING status', async () => {
    const view = await renderScreen();
    expect(view.getByText('Proses Pesanan')).toBeTruthy();
  });

  it('no action button for READY status', async () => {
    (useLocalSearchParams as unknown as jest.Mock).mockReturnValue({ id: 'ORD-002' });
    const view = await renderScreen();
    expect(view.queryByTestId('action-button')).toBeNull();
  });
});
