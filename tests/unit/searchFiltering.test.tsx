import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '@/hooks/useProducts';
import * as productsApi from '@/lib/api/products';

jest.mock('@/lib/api/products');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts search filtering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters products matching search term', async () => {
    (productsApi.getProducts as jest.Mock).mockResolvedValue({
      products: [
        { id: '1', name: 'Nasi Goreng Special', storeName: 'Warung Bu Ani', category: 'meals', discountedPrice: 15000, originalPrice: 20000, stock: 5 },
        { id: '2', name: 'Roti Bakar Cokelat', storeName: 'Toko Roti Indah', category: 'bakery', discountedPrice: 10000, originalPrice: 12000, stock: 3 },
        { id: '3', name: 'Es Teh Manis', storeName: 'Warung Bu Ani', category: 'drinks', discountedPrice: 5000, originalPrice: 5000, stock: 10 },
      ],
    });

    const { result } = await renderHook(() => useProducts({ search: 'nasi' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const products = result.current.data?.products ?? [];
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Nasi Goreng Special');
  });

  it('filters products matching store name', async () => {
    (productsApi.getProducts as jest.Mock).mockResolvedValue({
      products: [
        { id: '1', name: 'Nasi Goreng Special', storeName: 'Dapur Bu Ani', category: 'meals', discountedPrice: 15000, originalPrice: 20000, stock: 5 },
        { id: '2', name: 'Roti Bakar Cokelat', storeName: 'Toko Roti Indah', category: 'bakery', discountedPrice: 10000, originalPrice: 12000, stock: 3 },
      ],
    });

    const { result } = await renderHook(() => useProducts({ search: 'Dapur' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const products = result.current.data?.products ?? [];
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Nasi Goreng Special');
  });
});
