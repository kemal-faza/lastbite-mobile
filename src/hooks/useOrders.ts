import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrder, confirmPickup, cancelExpiredOrder } from '@/lib/api/orders';

export function useOrders(enabled = true) {
  return useQuery({ queryKey: ['orders'], queryFn: getOrders, enabled });
}

export function useOrder(id: string) {
  return useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id), enabled: !!id });
}

export function useConfirmPickup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pickupCode }: { id: string; pickupCode: string }) =>
      confirmPickup(id, pickupCode),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

export function useCancelExpired() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelExpiredOrder(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
}
