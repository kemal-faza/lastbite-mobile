import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct } from '@/lib/api/products';

export function useProducts(filters?: { category?: string; search?: string }) {
  return useQuery({ queryKey: ['products', filters], queryFn: () => getProducts(filters) });
}

export function useProduct(id: string) {
  return useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id), enabled: !!id });
}
