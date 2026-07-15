import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWishlistProducts } from '@/hooks/useWishlistProducts';

jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('@/hooks/useProducts', () => ({
  useProducts: jest.fn(() => ({ data: null, isLoading: false })),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useWishlistProducts', () => {
  it('fetches wishlist productIds', async () => {
    const { apiFetch } = require('@/lib/api/client');
    apiFetch.mockResolvedValueOnce({
      subscriptions: [{ productId: 'uuid-1' }, { productId: 'uuid-2' }],
    });

    const { result } = await renderHook(() => useWishlistProducts(), { wrapper });

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions');
    });
  });
});
