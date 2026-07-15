import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useToggleWishlist } from '@/hooks/useToggleWishlist';

jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useToggleWishlist', () => {
  it('calls unsubscribe when isWishlisted is true', async () => {
    const { apiFetch } = require('@/lib/api/client');
    apiFetch.mockResolvedValue({});

    const { result } = await renderHook(() => useToggleWishlist('prod-1'), { wrapper });
    result.current.mutate({ isWishlisted: true });

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions/prod-1', { method: 'DELETE' });
    });
  });

  it('calls subscribe when isWishlisted is false', async () => {
    const { apiFetch } = require('@/lib/api/client');
    apiFetch.mockResolvedValue({});

    const { result } = await renderHook(() => useToggleWishlist('prod-1'), { wrapper });
    result.current.mutate({ isWishlisted: false });

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions', {
        method: 'POST',
        body: JSON.stringify({ productId: 'prod-1' }),
      });
    });
  });
});
