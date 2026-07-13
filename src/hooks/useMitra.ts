import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMitraProfile, getMitraProducts, getMitraOrders, updateMitraOrderStatus } from '@/lib/api/mitra';
import { getMitraStats } from '@/lib/api/mitra-stats';

export function useMitraProfile() {
  return useQuery({ queryKey: ['mitra-profile'], queryFn: getMitraProfile });
}

export function useMitraProducts() {
  return useQuery({ queryKey: ['mitra-products'], queryFn: getMitraProducts });
}

export function useMitraOrders() {
  return useQuery({ queryKey: ['mitra-orders'], queryFn: getMitraOrders });
}

export function useMitraStats() {
  return useQuery({
    queryKey: ['mitra-stats'],
    queryFn: getMitraStats,
    staleTime: 10000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'PROCESSED' | 'READY' }) =>
      updateMitraOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mitra-orders'] });
    },
  });
}
