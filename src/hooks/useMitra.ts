import { useQuery } from '@tanstack/react-query';
import { getMitraProfile, getMitraProducts, getMitraOrders } from '@/lib/api/mitra';

export function useMitraProfile() {
  return useQuery({ queryKey: ['mitra-profile'], queryFn: getMitraProfile });
}

export function useMitraProducts() {
  return useQuery({ queryKey: ['mitra-products'], queryFn: getMitraProducts });
}

export function useMitraOrders() {
  return useQuery({ queryKey: ['mitra-orders'], queryFn: getMitraOrders });
}
