import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../useProducts';
import { getProducts } from '@/lib/api/products';
import type { ReactNode } from 'react';

jest.mock('@/lib/api/products', () => ({
  getProducts: jest.fn(),
}));

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function wrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useProducts', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProducts.mockResolvedValue({ products: [] });
    queryClient = createQueryClient();
  });

  it('passes sort param to getProducts', async () => {
    const { unmount } = await renderHook(
      () => useProducts({ sort: 'price_asc' }),
      { wrapper: wrapper(queryClient) },
    );
    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'price_asc' }),
      );
    });
    unmount();
  });

  it('passes lat/lng/radius params to getProducts', async () => {
    const { unmount } = await renderHook(
      () => useProducts({ lat: -6.2, lng: 106.8, radius: 5 }),
      { wrapper: wrapper(queryClient) },
    );
    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({ lat: -6.2, lng: 106.8, radius: 5 }),
      );
    });
    unmount();
  });

  it('passes page/limit params to getProducts', async () => {
    const { unmount } = await renderHook(
      () => useProducts({ page: 1, limit: 20 }),
      { wrapper: wrapper(queryClient) },
    );
    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 20 }),
      );
    });
    unmount();
  });

  it('backward compat: passes category param', async () => {
    const { unmount } = await renderHook(
      () => useProducts({ category: 'meals' }),
      { wrapper: wrapper(queryClient) },
    );
    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'meals' }),
      );
    });
    unmount();
  });

  it('passes maxPrice filter to getProducts', async () => {
    const { unmount } = await renderHook(
      () => useProducts({ maxPrice: 15000 }),
      { wrapper: wrapper(queryClient) },
    );
    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({ maxPrice: 15000 }),
      );
    });
    unmount();
  });

  it('passes expiry filter to getProducts', async () => {
    const { unmount } = await renderHook(
      () => useProducts({ expiry: '< 1 Jam' }),
      { wrapper: wrapper(queryClient) },
    );
    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({ expiry: '< 1 Jam' }),
      );
    });
    unmount();
  });

  it('preserves previous data as placeholder when filters change', async () => {
    const productA = { id: '1', name: 'Product A', storeName: 'Store', originalPrice: 10000, discountedPrice: 5000, stock: 10, imageUrl: null, imageVariants: null, category: 'meals' as const };
    const productB = { id: '1', name: 'Product B', storeName: 'Store', originalPrice: 10000, discountedPrice: 5000, stock: 10, imageUrl: null, imageVariants: null, category: 'bakery' as const };

    // Resolve first call immediately
    mockGetProducts.mockResolvedValueOnce({ products: [productA] });

    const hook = await renderHook(
      (props: { filters: Record<string, unknown> }) => useProducts(props.filters as any),
      { wrapper: wrapper(queryClient), initialProps: { filters: { category: 'meals' } } },
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(hook.result.current.data).toBeDefined();
    });
    expect(hook.result.current.data?.products).toHaveLength(1);
    expect(hook.result.current.isPlaceholderData).toBe(false);

    // Defer second call to observe placeholder state
    let resolveSecond!: (value: any) => void;
    mockGetProducts.mockImplementationOnce(
      () => new Promise((resolve) => { resolveSecond = resolve; }),
    );

    // Rerender with different filters -- triggers new query
    hook.rerender({ filters: { category: 'bakery' } });

    // Wait for placeholder state to be active (async render flush)
    await waitFor(() => {
      expect(hook.result.current.isPlaceholderData).toBe(true);
    });
    expect(hook.result.current.data?.products[0]?.name).toBe('Product A');

    // Resolve pending query
    resolveSecond({ products: [productB] });

    // Wait for new data to settle
    await waitFor(() => {
      expect(hook.result.current.data?.products[0]?.name).toBe('Product B');
    });
    expect(hook.result.current.isPlaceholderData).toBe(false);

    hook.unmount();
  });
});
