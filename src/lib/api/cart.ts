import { apiFetch } from './client';
import type { Product } from './products';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  storeName: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string | null;
  stock: number;
}

export interface Cart {
  id: string;
  storeName: string | null;
  items: CartItem[];
}

export async function getCart() {
  return apiFetch<{ cart: Cart }>('/cart', { auth: true });
}

export async function addToCart(productId: string, quantity = 1) {
  return apiFetch<{ cart: Cart }>('/cart', { auth: true, method: 'POST', body: JSON.stringify({ productId, quantity }) });
}

export async function updateCartItem(productId: string, quantity: number) {
  return apiFetch<{ cart: Cart }>(`/cart/items/${productId}`, { auth: true, method: 'PATCH', body: JSON.stringify({ quantity }) });
}
