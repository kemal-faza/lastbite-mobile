import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../useProducts';
import { getProducts } from '@/lib/api/products';
import type { ReactNode } from 'react';

jest.mock('@/lib/api/products', () => ({
  getProducts: jest.fn(),
}));

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProducts.mockResolvedValue({ products: [] });
  });

  it('passes sort param to getProducts', async () => {
    const { unmount } = await renderHook(
      () => useProducts({ sort: 'price_asc' }),
      { wrapper },
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
      { wrapper },
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
      { wrapper },
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
      { wrapper },
    );
    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'meals' }),
      );
    });
    unmount();
  });
});
