import { useQuery } from '@tanstack/react-query';
import { getOrders, getOrder } from '@/lib/api/orders';

export function useOrders(enabled = true) {
  return useQuery({ queryKey: ['orders'], queryFn: getOrders, enabled });
}

export function useOrder(id: string) {
  return useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id), enabled: !!id });
}
