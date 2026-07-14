import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

const mockRemoveItem = { mutate: jest.fn(), isPending: false };
const mockUpdateItem = { mutate: jest.fn(), isPending: false };

jest.mock('@/hooks/useCart', () => ({
  useCart: jest.fn(() => ({
    cart: {
      data: {
        cart: {
          items: [
            { id: 'ci-1', productId: 'p1', name: 'Nasi Goreng', storeName: 'Warung', price: 25000, originalPrice: 35000, quantity: 2, imageUrl: null, imageVariants: null, stock: 5 },
            { id: 'ci-2', productId: 'p2', name: 'Es Teh', storeName: 'Warung', price: 5000, originalPrice: 8000, quantity: 1, imageUrl: null, imageVariants: null, stock: 10 },
          ],
        },
      },
    },
    updateItem: mockUpdateItem,
    removeItem: mockRemoveItem,
  })),
}));

jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({ isAuthenticated: true })),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('expo-image', () => ({ Image: 'Image' }));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onPress, disabled, testID }: any) => {
    const React = require('react');
    const { Pressable, Text } = require('react-native');
    return React.createElement(Pressable, { onPress, disabled, testID: testID || 'checkout-button' },
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

import CartScreen from '../../app/(food-saver)/cart';

describe('CartScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cart items', async () => {
    const { getByText } = await render(<CartScreen />);
    expect(getByText('Nasi Goreng')).toBeTruthy();
    expect(getByText('Es Teh')).toBeTruthy();
  });

  it('renders total price', async () => {
    const { getByText } = await render(<CartScreen />);
    // total = (25000*2) + (5000*1) = 55000
    expect(getByText(/55[,.]000/)).toBeTruthy();
  });

  it('calls removeItem when delete button pressed', async () => {
    const { getAllByTestId } = await render(<CartScreen />);
    const deleteButtons = getAllByTestId('delete-item');
    fireEvent.press(deleteButtons[0]);
    expect(mockRemoveItem.mutate).toHaveBeenCalledWith('p1');
  });

  it('calls updateItem on quantity minus', async () => {
    const { getAllByText } = await render(<CartScreen />);
    fireEvent.press(getAllByText('-')[0]);
    expect(mockUpdateItem.mutate).toHaveBeenCalledWith({ productId: 'p1', quantity: 1 });
  });

  it('calls updateItem on quantity plus', async () => {
    const { getAllByText } = await render(<CartScreen />);
    fireEvent.press(getAllByText('+')[0]);
    expect(mockUpdateItem.mutate).toHaveBeenCalledWith({ productId: 'p1', quantity: 3 });
  });

  it('shows empty state when no items', async () => {
    const { useCart } = require('@/hooks/useCart');
    (useCart as jest.Mock).mockReturnValueOnce({
      cart: { data: { cart: { items: [] } } },
      updateItem: mockUpdateItem,
      removeItem: mockRemoveItem,
    });
    const { getByText } = await render(<CartScreen />);
    expect(getByText('Keranjang Kosong')).toBeTruthy();
  });

  it('navigates to checkout on button press', async () => {
    const { router } = require('expo-router');
    const { getByTestId } = await render(<CartScreen />);
    fireEvent.press(getByTestId('checkout-button'));
    expect(router.push).toHaveBeenCalledWith('/checkout');
  });
});
