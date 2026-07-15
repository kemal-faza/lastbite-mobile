import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

jest.mock('expo-router', () => ({
  Redirect: ({ href }: any) => null,
  router: { replace: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    isAuthenticated: true,
    user: { name: 'John Doe', phone: '08123456789' },
  })),
}));

const mockCartItems = [
  { id: 'ci-1', productId: 'p1', name: 'Nasi Goreng', storeName: 'Warung', price: 25000, originalPrice: 35000, quantity: 2, imageUrl: null, imageVariants: null, stock: 5 },
  { id: 'ci-2', productId: 'p2', name: 'Es Teh', storeName: 'Warung', price: 5000, originalPrice: 8000, quantity: 1, imageUrl: null, imageVariants: null, stock: 10 },
];

jest.mock('@/hooks/useCart', () => ({
  useCart: jest.fn(() => ({
    cart: { data: { cart: { items: mockCartItems } } },
  })),
}));

jest.mock('@/lib/api/orders', () => ({
  createOrder: jest.fn(),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onPress, disabled, testID }: any) => {
    const React = require('react');
    const { Pressable, Text } = require('react-native');
    return React.createElement(Pressable, { onPress, disabled, testID: testID || 'confirm-button' },
      React.createElement(Text, null, typeof children === 'string' ? children : 'button'));
  },
}));

jest.mock('@/components/ui/text', () => ({
  Text: ({ children }: any) => {
    const React = require('react');
    const { Text: RNText } = require('react-native');
    return React.createElement(RNText, null, children);
  },
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ value, onChangeText, placeholder }: any) => {
    const React = require('react');
    const { TextInput } = require('react-native');
    return React.createElement(TextInput, { value, onChangeText, placeholder, testID: 'notes-input' });
  },
}));

jest.mock('@/components/PaymentSummary', () => ({
  PaymentSummary: ({ items }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID: 'payment-summary' }, `Summary ${items.length} items`);
  },
}));

jest.mock('expo-image', () => ({ Image: 'Image' }));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/contexts/ToastContext';
import CheckoutScreen from '../../app/(food-saver)/(tabs)/checkout';
import { createOrder } from '@/lib/api/orders';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{ui}</ToastProvider>
    </QueryClientProvider>
  );
}

// Helper to re-mock useLocalSearchParams before each test
import { useLocalSearchParams as useLocalSearchParamsOriginal } from 'expo-router';
const useLocalSearchParams = useLocalSearchParamsOriginal;

describe('CheckoutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({});
  });

  it('renders buyer info from auth store', async () => {
    const { getByText } = await renderWithProviders(<CheckoutScreen />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('08123456789')).toBeTruthy();
  });

  it('renders cart items summary', async () => {
    const { getByText } = await renderWithProviders(<CheckoutScreen />);
    expect(getByText('Nasi Goreng')).toBeTruthy();
    expect(getByText('Es Teh')).toBeTruthy();
  });

  it('renders PaymentSummary', async () => {
    const { getByTestId } = await renderWithProviders(<CheckoutScreen />);
    expect(getByTestId('payment-summary')).toBeTruthy();
  });

  it('shows notes character counter', async () => {
    const { getByTestId } = await renderWithProviders(<CheckoutScreen />);
    const input = getByTestId('notes-input');
    expect(input.props.maxLength).toBe(500);
  });

  it('disables confirm button when cart is empty', async () => {
    const { useCart } = require('@/hooks/useCart');
    (useCart as jest.Mock).mockReturnValueOnce({ cart: { data: { cart: { items: [] } } } });
    const { getByTestId } = await renderWithProviders(<CheckoutScreen />);
    expect(getByTestId('confirm-button').props.disabled).toBe(true);
  });

  it('submits createOrder with buyer info and notes', async () => {
    (createOrder as jest.Mock).mockResolvedValueOnce({
      order: { id: 'ord-1', status: 'PENDING', pickupCode: 'LAST-X1', total: 55000, storeName: 'Warung', items: [] },
    });

    const { getByTestId } = await renderWithProviders(<CheckoutScreen />);
    await fireEvent.changeText(getByTestId('notes-input'), 'Tanpa sambal');
    await fireEvent.press(getByTestId('confirm-button'));

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalledWith('John Doe', '08123456789', 'Tanpa sambal', undefined);
    });
  });

  it('redirects to order confirm on success', async () => {
    const { router } = require('expo-router');
    (createOrder as jest.Mock).mockResolvedValueOnce({
      order: { id: 'ord-2', status: 'PENDING', pickupCode: 'LAST-Y2', total: 30000, storeName: 'Bakery', items: [] },
    });

    const { getByTestId } = await renderWithProviders(<CheckoutScreen />);
    await fireEvent.press(getByTestId('confirm-button'));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/order/ord-2?just-checked=true');
    });
  });

  it('shows alert on createOrder failure', async () => {
    (createOrder as jest.Mock).mockRejectedValueOnce(new Error('CART_EMPTY'));
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});

    const { getByTestId } = await renderWithProviders(<CheckoutScreen />);
    await fireEvent.press(getByTestId('confirm-button'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });
    alertSpy.mockRestore();
  });

  it('filters items by storeName and shows store header', async () => {
    const { useLocalSearchParams } = require('expo-router');
    (useLocalSearchParams as jest.Mock).mockReturnValueOnce({ storeName: 'Warung' });

    const { getByText, queryByText } = await renderWithProviders(<CheckoutScreen />);
    // Should show Warung items
    expect(getByText('Nasi Goreng')).toBeTruthy();
    expect(getByText('Es Teh')).toBeTruthy();
    // Should NOT show items from other stores
    expect(queryByText('Croissant')).toBeNull();
    // Should show store-specific header
    expect(getByText('Checkout - Warung')).toBeTruthy();
  });

  it('passes storeName to createOrder when filtering by store', async () => {
    const { useLocalSearchParams } = require('expo-router');
    (useLocalSearchParams as jest.Mock).mockReturnValueOnce({ storeName: 'Warung' });
    (createOrder as jest.Mock).mockResolvedValueOnce({
      order: { id: 'ord-3', status: 'PENDING', pickupCode: 'LAST-Z3', total: 30000, storeName: 'Warung', items: [] },
    });

    const { getByTestId } = await renderWithProviders(<CheckoutScreen />);
    await fireEvent.press(getByTestId('confirm-button'));

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalledWith('John Doe', '08123456789', undefined, 'Warung');
    });
  });

  it('shows all items and no store header when storeName is not set', async () => {
    const { getByText, getAllByText } = await renderWithProviders(<CheckoutScreen />);
    expect(getByText('Nasi Goreng')).toBeTruthy();
    expect(getByText('Es Teh')).toBeTruthy();
    // Without storeName, show generic header (Header component + body title)
    expect(getAllByText('Checkout').length).toBeGreaterThanOrEqual(2);
  });
});
