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

export interface MitraStats {
  activeOrders: number;
  productCount: number;
  totalSold: number;
  totalRevenue: number;
}

export interface MitraOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface MitraOrder {
  id: string;
  pickupCode: string;
  status: 'PENDING' | 'PROCESSED' | 'READY' | 'PICKED_UP' | 'CANCELLED';
  totalAmount: number;
  buyerName: string;
  buyerPhone: string;
  pickupExpiresAt: string;
  notes?: string;
  items: MitraOrderItem[];
}

export interface CreateProductInput {
  name: string;
  description?: string;
  category: 'meals' | 'bakery' | 'drinks';
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  storeName: string;
  storeAddress?: string;
  expiresAt: string;
  imageUrl?: string | null;
  imageVariants?: unknown | null;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export async function createMitraProduct(input: CreateProductInput) {
  return apiFetch('/mitra/products', {
    auth: true,
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateMitraProduct(id: string, input: UpdateProductInput) {
  return apiFetch(`/mitra/products/${id}`, {
    auth: true,
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteMitraProduct(id: string) {
  return apiFetch(`/mitra/products/${id}`, {
    auth: true,
    method: 'DELETE',
  });
}

export async function getMitraStats() {
  return apiFetch<{ stats: MitraStats }>('/mitra/stats', { auth: true });
}

export async function registerMitra(data: {
  name: string;
  description?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}) {
  return apiFetch('/mitra/register', {
    auth: true,
    method: 'POST',
    body: JSON.stringify(data),
  });
}
