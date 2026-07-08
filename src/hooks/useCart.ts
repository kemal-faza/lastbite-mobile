import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItem } from '@/lib/api/cart';

export function useCart(enabled = true) {
  const queryClient = useQueryClient();

  return {
    cart: useQuery({ queryKey: ['cart'], queryFn: getCart, enabled }),
    addItem: useMutation({
      mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) => addToCart(productId, quantity),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    }),
    updateItem: useMutation({
      mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => updateCartItem(productId, quantity),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    }),
  };
}
