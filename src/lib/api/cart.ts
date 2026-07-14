import { apiFetch } from './client';
import type { Product, ImageVariants } from './products';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  storeName: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string | null;
  imageVariants: ImageVariants | null;
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

export async function removeCartItem(productId: string) {
  return apiFetch<{ cart: Cart }>(`/cart/items/${productId}`, {
    auth: true,
    method: 'DELETE',
  });
}

export async function clearCart() {
  return apiFetch<{ message: string }>('/cart', {
    auth: true,
    method: 'DELETE',
  });
}
