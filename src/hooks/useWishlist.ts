import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, subscribeToProduct, unsubscribeFromProduct } from '@/lib/api/wishlist';
import { useProducts } from './useProducts';
import { useAuthStore } from '@/stores/authStore';
import { useCallback } from 'react';

export interface UseWishlistOptions {
  loadProducts?: boolean;
}

export function useWishlist(options?: UseWishlistOptions) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const loadProducts = options?.loadProducts ?? false;

  // 1. Fetch wishlist IDs
  const wishlistIdsQuery = useQuery({
    queryKey: ['wishlist-product-ids'],
    queryFn: getWishlist,
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  const productIds = wishlistIdsQuery.data?.productIds ?? [];

  // 2. Fetch full products lazy
  const productsQuery = useProducts(
    loadProducts && isAuthenticated && productIds.length > 0
      ? { ids: productIds.join(',') }
      : undefined
  );

  // 3. Toggle mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ productId, isWishlisted }: { productId: string; isWishlisted: boolean }) => {
      if (isWishlisted) {
        await unsubscribeFromProduct(productId);
      } else {
        await subscribeToProduct(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-product-ids'] });
    },
  });

  const isWishlisted = useCallback(
    (productId: string) => {
      return productIds.includes(productId);
    },
    [productIds]
  );

  return {
    productIds,
    products: loadProducts ? productsQuery.data : undefined,
    isWishlisted,
    toggle: toggleMutation.mutateAsync,
    isPending: toggleMutation.isPending,
    isLoading: wishlistIdsQuery.isLoading || (loadProducts && productsQuery.isLoading),
    isError: wishlistIdsQuery.isError || (loadProducts && productsQuery.isError),
    refetch: async () => {
      await wishlistIdsQuery.refetch();
      if (loadProducts) {
        await productsQuery.refetch();
      }
    },
  };
}
