import { useQuery } from '@tanstack/react-query';
import { getOrders, getOrder } from '@/lib/api/orders';

export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: getOrders });
}

export function useOrder(id: string) {
  return useQuery({ queryKey: ['order', id], queryFn: () => getOrder(id), enabled: !!id });
}
