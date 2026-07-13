import { render, act } from '@testing-library/react-native';
import React from 'react';
import MitraOrdersScreen from '../../app/(mitra)/orders';
import { router } from 'expo-router';

// Override jest.setup.js mock for react-native with functional FlatList
// so list items are rendered for test assertions
jest.mock('react-native', () => {
  const React = require('react');

  const Animated = {
    View: 'Animated.View',
    Value: jest.fn(() => ({
      interpolate: jest.fn(),
      setValue: jest.fn(),
    })),
    timing: jest.fn(() => ({ start: jest.fn((cb) => cb?.()), stop: jest.fn() })),
    parallel: jest.fn(() => ({ start: jest.fn((cb) => cb?.()), stop: jest.fn() })),
    loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
    sequence: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
  };

  const FlatList = (props: any) => {
    const data = props.data || [];
    const children = data.length > 0
      ? data.map((item: any, index: number) => {
          const key = props.keyExtractor?.(item, index) ?? String(index);
          const rendered = props.renderItem?.({
            item,
            index,
            separators: {
              highlight: () => {},
              unhighlight: () => {},
              updateProps: () => {},
            },
          });
          return React.createElement('View', { key }, rendered);
        })
      : (typeof props.ListEmptyComponent === 'function'
          ? React.createElement(props.ListEmptyComponent, props.ListEmptyComponent.props || {})
          : props.ListEmptyComponent || null);
    return React.createElement('View', null, children);
  };

  return {
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    Pressable: 'Pressable',
    Animated,
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn(),
      absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    },
    Platform: { OS: 'ios', select: jest.fn((obj) => obj.ios) },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    ActivityIndicator: 'ActivityIndicator',
    ScrollView: 'ScrollView',
    FlatList,
    TextInput: 'TextInput',
    TouchableOpacity: 'TouchableOpacity',
    Modal: 'Modal',
    RefreshControl: 'RefreshControl',
    BackHandler: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    AppState: {
      currentState: 'active',
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    processColor: jest.fn((color) => color),
  };
});

// --- Mock hooks ---
jest.mock('@/hooks/useMitra', () => ({
  useMitraOrders: jest.fn(),
}));

jest.mock('@/hooks/useRefreshOnFocus', () => ({
  useRefreshOnFocus: jest.fn(),
}));

// --- Mock components ---
jest.mock('@/components/MitraOrderCard', () => ({
  MitraOrderCard: ({ order, onPress }: { order: any; onPress: () => void }) => {
    const React = require('react');
    const { Text, TouchableOpacity } = require('react-native');
    return React.createElement(
      TouchableOpacity,
      { onPress, testID: `order-card-${order.id}` },
      React.createElement(Text, null, order.buyerName),
      React.createElement(Text, null, order.status)
    );
  },
}));

jest.mock('@/components/EmptyState', () => ({
  EmptyState: ({ title, description }: { title: string; description?: string }) => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return React.createElement(
      View,
      { testID: 'empty-state' },
      React.createElement(Text, null, title),
      description ? React.createElement(Text, null, description) : null
    );
  },
}));

import { useMitraOrders } from '@/hooks/useMitra';
import type { MitraOrder } from '@/lib/api/mitra';

// Helpers
function createMockOrder(overrides: Partial<MitraOrder>): MitraOrder {
  return {
    id: 'ORD-001',
    pickupCode: 'LAST-1234',
    status: 'PENDING',
    totalAmount: 50000,
    buyerName: 'Budi',
    buyerPhone: '08123456789',
    pickupExpiresAt: '2026-07-13T14:00:00Z',
    notes: undefined,
    items: [{ id: '1', name: 'Nasi Goreng', quantity: 2, price: 25000 }],
    ...overrides,
  };
}

const mockOrders: MitraOrder[] = [
  createMockOrder({ id: 'ORD-001', status: 'PENDING', buyerName: 'Budi' }),
  createMockOrder({ id: 'ORD-002', status: 'PROCESSED', buyerName: 'Ani' }),
  createMockOrder({ id: 'ORD-003', status: 'READY', buyerName: 'Citra' }),
  createMockOrder({ id: 'ORD-004', status: 'PICKED_UP', buyerName: 'Dewi' }),
];

function renderScreen() {
  return render(<MitraOrdersScreen />);
}

describe('MitraOrdersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMitraOrders as jest.Mock).mockReturnValue({
      data: { orders: mockOrders },
      refetch: jest.fn(),
      isPending: false,
      isRefetching: false,
    });
  });

  it('renders tabs with correct order counts: Aktif (3) and Riwayat (1)', async () => {
    const view = await renderScreen();
    expect(view.getByText('Aktif (3)')).toBeTruthy();
    expect(view.getByText('Riwayat (1)')).toBeTruthy();
  });

  it('shows Aktif tab by default with active orders (PENDING, PROCESSED, READY)', async () => {
    const view = await renderScreen();
    // Active orders should be visible
    expect(view.getByText('Budi')).toBeTruthy();
    expect(view.getByText('Ani')).toBeTruthy();
    expect(view.getByText('Citra')).toBeTruthy();
    // History order should NOT be visible
    expect(view.queryByText('Dewi')).toBeNull();
  });

  it('switching to Riwayat tab shows history orders and hides active orders', async () => {
    const view = await renderScreen();
    // Press Riwayat tab — navigate to parent TouchableOpacity for onPress
    const riwayatText = view.getByText('Riwayat (1)');
    // The Text is inside a TouchableOpacity — find the parent with onPress
    let tabElement: any = riwayatText;
    while (tabElement && !tabElement.props.onPress) {
      tabElement = tabElement.parent;
    }
    await act(() => {
      tabElement.props.onPress();
    });
    // History order should now be visible
    expect(view.getByText('Dewi')).toBeTruthy();
    // Active orders should NOT be visible
    expect(view.queryByText('Budi')).toBeNull();
    expect(view.queryByText('Ani')).toBeNull();
    expect(view.queryByText('Citra')).toBeNull();
  });

  it('shows empty state when no orders exist in current tab', async () => {
    (useMitraOrders as jest.Mock).mockReturnValue({
      data: { orders: [] },
      refetch: jest.fn(),
      isPending: false,
      isRefetching: false,
    });
    const view = await renderScreen();
    expect(view.getByText('Belum ada pesanan')).toBeTruthy();
  });
});
