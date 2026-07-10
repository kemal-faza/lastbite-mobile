import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct, type ProductFilters } from '@/lib/api/products';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    retry: 1,
    staleTime: 30_000,
  });
}

export function useProduct(id: string) {
  return useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id), enabled: !!id });
}
