import { useQuery } from '@tanstack/react-query';
import { getWishlist } from '@/lib/api/wishlist';
import { useProducts } from './useProducts';

export function useWishlistProducts() {
  const wishlistQuery = useQuery({
    queryKey: ['wishlist-product-ids'],
    queryFn: getWishlist,
  });

  const productIds = wishlistQuery.data?.productIds ?? [];

  const productsQuery = useProducts({
    ids: productIds.length > 0 ? productIds.join(',') : undefined,
  });

  return {
    products: productIds.length > 0 ? productsQuery.data : undefined,
    isLoading: wishlistQuery.isLoading || (productIds.length > 0 && productsQuery.isLoading),
    isError: wishlistQuery.isError || productsQuery.isError,
    refetch: () => {
      wishlistQuery.refetch();
      productsQuery.refetch();
    },
  };
}
