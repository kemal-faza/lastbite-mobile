import { useQuery } from '@tanstack/react-query';
import { hasPurchaseHistory } from '@/lib/api/orders';
import { useAuthStore } from '@/stores/authStore';

export function useHasPurchaseHistory(): boolean | undefined {
  const { isAuthenticated } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['has-purchase-history'],
    queryFn: async () => {
      try {
        const res = await hasPurchaseHistory();
        return res.hasHistory;
      } catch {
        return false;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 60_000,
  });

  if (!isAuthenticated) return false;
  return data;
}
