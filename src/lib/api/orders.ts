import { apiFetch } from './client';

export interface Order {
  id: string;
  status: string;
  pickupCode: string;
  total: number;
  storeName: string;
  items: any[];
}

export async function createOrder(notes?: string) {
  return apiFetch<{ order: Order }>('/orders', {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ notes }),
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
