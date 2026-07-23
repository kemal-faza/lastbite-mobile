import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useWishlist } from '../useWishlist';
import { subscribeToProduct, unsubscribeFromProduct, getWishlist } from '@/lib/api/wishlist';

// Mock API layer
jest.mock('@/lib/api/wishlist', () => ({
  subscribeToProduct: jest.fn(),
  unsubscribeFromProduct: jest.fn(),
  getWishlist: jest.fn(),
}));

// Mock auth store — default to authenticated
const mockIsAuthenticated = jest.fn(() => true);
jest.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({ isAuthenticated: mockIsAuthenticated() }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  queryClient.clear();
});

describe('useWishlist — optimistic update', () => {
  it('immediately adds productId to cache on subscribe (onMutate)', async () => {
    // Arrange: mock getWishlist to return empty wishlist (prevents query from overwriting cache)
    (getWishlist as jest.Mock).mockResolvedValue({ productIds: [] });

    // Don't resolve the API call yet — we want to verify cache BEFORE API completes
    let resolveSubscribe!: () => void;
    (subscribeToProduct as jest.Mock).mockReturnValue(
      new Promise<void>((resolve) => { resolveSubscribe = resolve; }),
    );

    const { result } = await renderHook(() => useWishlist(), { wrapper: createWrapper() });

    // Wait for the initial query to settle
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: toggle subscribe (isWishlisted=false → subscribe)
    const togglePromise = result.current.toggle({
      productId: 'prod-1',
      isWishlisted: false,
    });

    // Assert: cache should already include prod-1 (optimistic update)
    await waitFor(() => {
      const cached = queryClient.getQueryData<{ productIds: string[] }>(['wishlist-product-ids']);
      expect(cached?.productIds).toContain('prod-1');
    });

    // Cleanup: resolve the API call so the test doesn't hang
    resolveSubscribe();
    await togglePromise.catch(() => {});
  });

  it('immediately removes productId from cache on unsubscribe (onMutate)', async () => {
    // Arrange
    (getWishlist as jest.Mock).mockResolvedValue({ productIds: ['prod-1'] });

    let resolveUnsubscribe!: () => void;
    (unsubscribeFromProduct as jest.Mock).mockReturnValue(
      new Promise<void>((resolve) => { resolveUnsubscribe = resolve; }),
    );

    const { result } = await renderHook(() => useWishlist(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: toggle unsubscribe (isWishlisted=true → unsubscribe)
    const togglePromise = result.current.toggle({
      productId: 'prod-1',
      isWishlisted: true,
    });

    // Assert: cache should have removed prod-1
    await waitFor(() => {
      const cached = queryClient.getQueryData<{ productIds: string[] }>(['wishlist-product-ids']);
      expect(cached?.productIds).not.toContain('prod-1');
    });

    resolveUnsubscribe();
    await togglePromise.catch(() => {});
  });

  it('rolls back cache on mutation error (onError)', async () => {
    // Arrange
    (getWishlist as jest.Mock).mockResolvedValue({ productIds: ['prod-1'] });
    (unsubscribeFromProduct as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = await renderHook(() => useWishlist(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: toggle unsubscribe (should fail)
    await expect(
      result.current.toggle({ productId: 'prod-1', isWishlisted: true }),
    ).rejects.toThrow('Network error');

    // Assert: cache should still have prod-1 (rolled back from optimistic update)
    await waitFor(() => {
      const cached = queryClient.getQueryData<{ productIds: string[] }>(['wishlist-product-ids']);
      expect(cached?.productIds).toContain('prod-1');
    });
  });
});
