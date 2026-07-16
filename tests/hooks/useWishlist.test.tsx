import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWishlist } from '@/hooks/useWishlist';
import { useProducts } from '@/hooks/useProducts';

const mockIsAuthenticated = jest.fn();
jest.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({ isAuthenticated: mockIsAuthenticated() }),
}));

jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('@/hooks/useProducts', () => ({
  useProducts: jest.fn(() => ({ data: undefined, isLoading: false, isError: false })),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useWishlist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not fetch when unauthenticated', async () => {
    mockIsAuthenticated.mockReturnValue(false);
    const { apiFetch } = require('@/lib/api/client') as { apiFetch: jest.Mock };

    const { result } = await renderHook(() => useWishlist(), { wrapper });

    await new Promise((r) => setTimeout(r, 50));
    expect(apiFetch).not.toHaveBeenCalled();
    expect(result.current.productIds).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('fetches productIds and calculates wishlist status when authenticated', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    const { apiFetch } = require('@/lib/api/client') as { apiFetch: jest.Mock };
    apiFetch.mockResolvedValueOnce({
      subscriptions: [{ productId: 'uuid-1' }, { productId: 'uuid-2' }],
    });

    const { result } = await renderHook(() => useWishlist(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions', { auth: true });
    expect(result.current.productIds).toEqual(['uuid-1', 'uuid-2']);
    expect(result.current.isWishlisted('uuid-1')).toBe(true);
    expect(result.current.isWishlisted('uuid-3')).toBe(false);
  });

  it('calls subscribe on toggle when product is not wishlisted', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    const { apiFetch } = require('@/lib/api/client') as { apiFetch: jest.Mock };
    apiFetch.mockResolvedValue({ subscriptions: [] }); // initial fetch

    const { result } = await renderHook(() => useWishlist(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    apiFetch.mockResolvedValueOnce({}); // mutation fetch
    await act(async () => {
      await result.current.toggle({ productId: 'uuid-1', isWishlisted: false });
    });

    expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions', {
      auth: true,
      method: 'POST',
      body: JSON.stringify({ productId: 'uuid-1' }),
    });
  });

  it('calls unsubscribe on toggle when product is wishlisted', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    const { apiFetch } = require('@/lib/api/client') as { apiFetch: jest.Mock };
    apiFetch.mockResolvedValue({ subscriptions: [{ productId: 'uuid-1' }] }); // initial fetch

    const { result } = await renderHook(() => useWishlist(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    apiFetch.mockResolvedValueOnce({}); // mutation fetch
    await act(async () => {
      await result.current.toggle({ productId: 'uuid-1', isWishlisted: true });
    });

    expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions/uuid-1', {
      auth: true,
      method: 'DELETE',
    });
  });

  it('lazy loads products full detail when loadProducts is true', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    const { apiFetch } = require('@/lib/api/client') as { apiFetch: jest.Mock };
    apiFetch.mockResolvedValueOnce({
      subscriptions: [{ productId: 'uuid-1' }, { productId: 'uuid-2' }],
    });

    const mockProducts = [{ id: 'uuid-1', name: 'Product 1' }, { id: 'uuid-2', name: 'Product 2' }];
    (useProducts as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      isError: false,
    });

    const { result } = await renderHook(() => useWishlist({ loadProducts: true }), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(useProducts).toHaveBeenCalledWith({ ids: 'uuid-1,uuid-2' });
    expect(result.current.products).toEqual(mockProducts);
  });
});
