import { useQuery } from '@tanstack/react-query';
import { getMitraProfile, getMitraProducts, getMitraOrders } from '@/lib/api/mitra';
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
