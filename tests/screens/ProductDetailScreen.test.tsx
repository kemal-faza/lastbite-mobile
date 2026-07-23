import { render } from '@testing-library/react-native';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/contexts/ToastContext';
import ProductDetailScreen from '../../app/(food-saver)/(tabs)/product/[id]';
import { useProduct } from '@/hooks/useProducts';
import { useProductReviews } from '@/hooks/useReviews';
import type { Product } from '@/lib/api/products';

// --- Mock external dependencies ---
jest.mock('@/lib/api/cart', () => ({
  addToCart: jest.fn(),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onPress, disabled, testID }: any) => {
    const React = require('react');
    const { Pressable, Text } = require('react-native');
    return React.createElement(
      Pressable,
      { onPress, disabled, testID: testID || 'add-to-cart-button' },
      typeof children === 'string'
        ? React.createElement(Text, null, children)
        : children
    );
  },
}));

jest.mock('@/components/ReviewList', () => ({
  ReviewList: ({ summary, reviews }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, `Ulasan: ${summary.totalReviews}`);
  },
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// --- Make useWishlist mockable ---
jest.mock('@/hooks/useWishlist', () => ({
  useWishlist: jest.fn(),
}));

// --- @expo/vector-icons for WishlistHeart ---
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('react-native-reanimated');

const baseProduct: Product = {
  id: 'prod-1',
  name: 'Nasi Goreng Spesial',
  storeName: 'Warung Makan',
  originalPrice: 50000,
  discountedPrice: 35000,
  stock: 5,
  imageUrl: null,
  imageVariants: null,
  category: 'meals',
  description: 'Nasi goreng dengan telur dan ayam',
};

function createMockProduct(overrides?: Partial<Product>): Product {
  return { ...baseProduct, ...overrides };
}

// --- Setup mocks ---
jest.mock('@/hooks/useProducts', () => ({
  useProduct: jest.fn(),
  useProducts: jest.fn(() => ({ data: undefined, isLoading: true })),
}));

jest.mock('@/hooks/useReviews', () => ({
  useProductReviews: jest.fn(),
}));

const mockIsAuthenticated = jest.fn(() => true);
jest.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({ isAuthenticated: mockIsAuthenticated() }),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({ id: 'prod-1' })),
  useSegments: jest.fn(() => ['product', 'prod-1']),
  router: { push: jest.fn(), replace: jest.fn(), navigate: jest.fn() },
}));

// --- Helpers ---
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

async function renderScreen(
  productOverrides?: Partial<Product>,
  reviewsOverrides?: { isLoading?: boolean; data?: any },
  wishlistOverrides?: { isWishlisted?: boolean; mutate?: jest.Mock; isPending?: boolean },
) {
  const useWishlistMock = jest.requireMock('@/hooks/useWishlist').useWishlist as jest.Mock;
  const toggleFn = wishlistOverrides?.mutate ?? jest.fn().mockResolvedValue(undefined);
  if (wishlistOverrides?.mutate) {
    wishlistOverrides.mutate.mockResolvedValue(undefined);
  }
  useWishlistMock.mockReturnValue({
    isWishlisted: () => wishlistOverrides?.isWishlisted ?? false,
    toggle: toggleFn,
    isPending: wishlistOverrides?.isPending ?? false,
  });

  (useProduct as jest.Mock).mockReturnValue({
    data: { product: createMockProduct(productOverrides) },
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });

  (useProductReviews as jest.Mock).mockReturnValue({
    isLoading: false,
    data: undefined,
    ...reviewsOverrides,
  });

  return {
    ...(await render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ProductDetailScreen />
        </ToastProvider>
      </QueryClientProvider>,
    )),
    toggleFn,
  };
}

function setReviews(overrides: { isLoading?: boolean; data?: any } = {}) {
  (useProductReviews as jest.Mock).mockReturnValue({
    isLoading: false,
    data: undefined,
    ...overrides,
  });
}

// --- Tests ---
describe('ProductDetailScreen - Discount Badge', () => {
  it('shows discount badge when discountedPrice < originalPrice', async () => {
    const view = await renderScreen();
    expect(view.getByText('-30%')).toBeTruthy();
  });

  it('shows discount badge using explicit discountPercent when available', async () => {
    const view = await renderScreen({ discountPercent: 25, discountedPrice: 37500 });
    expect(view.getByText('-25%')).toBeTruthy();
  });

  it('hides discount badge when prices are equal', async () => {
    const view = await renderScreen({ discountedPrice: 50000, originalPrice: 50000 });
    expect(view.queryByText(/-?\d+%/)).toBeNull();
  });

  it('does not crash when originalPrice is 0', async () => {
    const view = await renderScreen({ originalPrice: 0, discountedPrice: 0 });
    // Should render without error, no discount badge
    expect(view.queryByText(/-?\d+%/)).toBeNull();
  });
});

describe('ProductDetailScreen - Trust Badge', () => {
  it('shows only the Populer badge', async () => {
    const view = await renderScreen();
    expect(view.getByText('Populer')).toBeTruthy();
  });

  it('does not show Terverifikasi or Higienis badges', async () => {
    const view = await renderScreen();
    expect(view.queryByText('Terverifikasi')).toBeNull();
    expect(view.queryByText('Higienis')).toBeNull();
  });
});

describe('ProductDetailScreen - Stock Text', () => {
  it('shows "Sisa N" when stock <= 3', async () => {
    const view = await renderScreen({ stock: 2 });
    expect(view.getByText('Sisa 2')).toBeTruthy();
  });

  it('shows "Stok: N" when stock > 3', async () => {
    const view = await renderScreen({ stock: 10 });
    expect(view.getByText('Stok: 10')).toBeTruthy();
  });
});

describe('ProductDetailScreen - Reviews', () => {
  it('shows skeleton list while reviews are loading', async () => {
    const view = await renderScreen(undefined, { isLoading: true });
    // Skeleton is shown — no ReviewList mock output
    expect(view.queryByText(/Ulasan/)).toBeNull();
  });

  it('shows empty review state when loaded with no data', async () => {
    const view = await renderScreen(undefined, {
      isLoading: false,
      data: {
        summary: {
          averageRating: 0,
          totalReviews: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
        reviews: [],
      },
    });
    // ReviewList mock renders "Ulasan: 0" for empty
    expect(view.getByText('Ulasan: 0')).toBeTruthy();
  });

  it('shows populated review cards when loaded with data', async () => {
    const view = await renderScreen(undefined, {
      isLoading: false,
      data: {
        summary: {
          averageRating: 4.5,
          totalReviews: 2,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 },
        },
        reviews: [
          {
            id: 'r1',
            userName: 'Budi',
            rating: 5,
            comment: 'Enak!',
            createdAt: '2026-07-10T08:00:00Z',
          },
        ],
      },
    });
    // ReviewList mock renders "Ulasan: 2" for populated
    expect(view.getByText('Ulasan: 2')).toBeTruthy();
  });
});

describe('ProductDetailScreen - Wishlist Heart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls mutate when heart is tapped (authenticated)', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    const mutate = jest.fn();
    const view = await renderScreen(undefined, undefined, {
      isWishlisted: false,
      mutate,
    });

    const heart = view.getByTestId('wishlist-heart');
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(heart);

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ productId: 'prod-1', isWishlisted: false }),
      expect.objectContaining({ onError: expect.any(Function) }),
    );
  });

  it('navigates to login when unauthenticated user taps heart', async () => {
    mockIsAuthenticated.mockReturnValue(false);
    const mutate = jest.fn();
    const view = await renderScreen(undefined, undefined, {
      isWishlisted: undefined,
      mutate,
    });

    const { router } = require('expo-router');
    const heart = view.getByTestId('wishlist-heart');
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(heart);

    // Should NOT call mutate (auth guard prevents it)
    expect(mutate).not.toHaveBeenCalled();
    // Should navigate to login with returnUrl
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/login',
      params: { returnUrl: '/product/prod-1' },
    });
  });
});
