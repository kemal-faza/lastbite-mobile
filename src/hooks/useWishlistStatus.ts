import { useQuery } from '@tanstack/react-query';
import { checkWishlistStatus } from '@/lib/api/wishlist';

export function useWishlistStatus(productId: string | undefined) {
  return useQuery({
    queryKey: ['wishlist-status', productId],
    queryFn: () => checkWishlistStatus(productId!),
    enabled: !!productId,
    staleTime: 30_000,
  });
}
