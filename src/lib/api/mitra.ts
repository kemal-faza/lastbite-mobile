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
  if (__DEV__) {
    const { getMockMitraOrders } = require('./mitra-orders.mock');
    return getMockMitraOrders();
  }
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

export async function createMitraProduct(body: FormData | CreateProductInput) {
  const isFormData = body instanceof FormData;
  return apiFetch<{ id: string }>('/mitra/products', {
    auth: true,
    method: 'POST',
    body: isFormData ? body : JSON.stringify(body),
  });
}

export async function updateMitraProduct(id: string, body: FormData | UpdateProductInput) {
  const isFormData = body instanceof FormData;
  return apiFetch<{ success: boolean }>(`/mitra/products/${id}`, {
    auth: true,
    method: isFormData ? 'PUT' : 'PATCH',
    body: isFormData ? body : JSON.stringify(body),
  });
}

export async function deleteMitraProduct(id: string) {
  return apiFetch<{ success: boolean }>(`/mitra/products/${id}`, {
    auth: true,
    method: 'DELETE',
  });
}

export async function getMitraStats() {
  return apiFetch<{ stats: MitraStats }>('/mitra/stats', { auth: true });
}

export async function updateMitraOrderStatus(id: string, status: 'PROCESSED' | 'READY') {
  return apiFetch<{ success: boolean }>(`/mitra/orders/${id}/status`, {
    auth: true,
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
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
