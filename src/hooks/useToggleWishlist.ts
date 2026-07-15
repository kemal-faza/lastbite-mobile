import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscribeToProduct, unsubscribeFromProduct } from '@/lib/api/wishlist';

export function useToggleWishlist(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isWishlisted }: { isWishlisted: boolean }) => {
      if (isWishlisted) {
        await unsubscribeFromProduct(productId);
      } else {
        await subscribeToProduct(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-status', productId] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-product-ids'] });
    },
  });
}
