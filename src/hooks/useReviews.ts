import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductReviews, createReview } from '@/lib/api/reviews';

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
    },
  });
}
