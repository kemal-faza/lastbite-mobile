import { apiFetch } from './client';

export interface MitraProfile {
  id: string;
  storeName: string;
  storeDescription: string | null;
  storeAddress: string | null;
}

export async function getMitraProfile() {
  return apiFetch<{ profile: MitraProfile }>('/mitra/me', { auth: true });
}

export async function getMitraProducts() {
  return apiFetch<{ products: any[] }>('/mitra/products', { auth: true });
}

export async function getMitraOrders() {
  return apiFetch<{ orders: any[] }>('/mitra/orders', { auth: true });
}
