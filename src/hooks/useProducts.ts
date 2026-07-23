import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts, getProduct, type ProductFilters } from '@/lib/api/products';
import { haversineDistance } from '@/lib/utils/haversine';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const res = await getProducts(filters);
      let products = [...(res.products || [])];

      // 1. Haversine distance calculation
      if (filters?.lat !== undefined && filters?.lng !== undefined) {
        products = products.map((p) => {
          if (p.storeLat !== undefined && p.storeLng !== undefined && p.storeLat !== null && p.storeLng !== null) {
            const dist = haversineDistance(filters.lat!, filters.lng!, p.storeLat, p.storeLng);
            return { ...p, distanceKm: dist };
          }
          return p;
        });

        // 2. Geolocation filtering based on radius limit if specified
        if (filters.radius !== undefined && filters.radius > 0) {
          products = products.filter(
            (p) => p.distanceKm !== undefined && p.distanceKm <= filters.radius!
          );
        }
      }

      // 3. Client-side search filtering fallback
      if (filters?.search && filters.search.trim().length > 0) {
        const searchTerm = filters.search.toLowerCase().trim();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.storeName.toLowerCase().includes(searchTerm) ||
            (p.description && p.description.toLowerCase().includes(searchTerm))
        );
      }

      // 4. Sorting
      if (filters?.sort) {
        if (filters.sort === 'price_asc') {
          products.sort((a, b) => a.discountedPrice - b.discountedPrice);
        } else if (filters.sort === 'price_desc') {
          products.sort((a, b) => b.discountedPrice - a.discountedPrice);
        } else if (filters.sort === 'stock_asc') {
          products.sort((a, b) => a.stock - b.stock);
        } else if (filters.sort === 'distance_asc') {
          products.sort((a, b) => {
            const distA = a.distanceKm ?? Infinity;
            const distB = b.distanceKm ?? Infinity;
            return distA - distB;
          });
        }
      }

      return { products };
    },
    placeholderData: keepPreviousData,
    retry: 1,
    staleTime: 30_000,
  });
}

export function useProduct(id: string) {
  return useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id), enabled: !!id });
}
