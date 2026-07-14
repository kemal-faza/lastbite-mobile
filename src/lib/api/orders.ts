import { apiFetch } from './client';
import type { ImageVariants } from './products';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  storeName: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string | null;
  imageVariants: ImageVariants | null;
}

export interface Order {
  id: string;
  status: string;
  pickupCode: string;
  total: number;
  storeName: string;
  pickupExpiresAt?: string;
  items: OrderItem[];
}

export async function createOrder(buyerName: string, buyerPhone: string, notes?: string) {
  return apiFetch<{ order: Order }>('/orders', {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ buyerName, buyerPhone, notes }),
  });
}

export async function getOrders() {
  return apiFetch<{ orders: Order[] }>('/orders', { auth: true });
}

export async function getOrder(id: string) {
  return apiFetch<{ order: Order }>(`/orders/${id}`, { auth: true });
}

export async function verifyPickup(id: string, pickupCode: string) {
  return apiFetch<{ order: Order }>(`/orders/${id}/verify-pickup`, {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ pickupCode }),
  });
}

export async function hasPurchaseHistory() {
  return apiFetch<{ hasHistory: boolean }>('/orders/has-history', { auth: true });
}

// Alias untuk consistency dengan useRequireAuth flow
export const confirmPickup = verifyPickup;
