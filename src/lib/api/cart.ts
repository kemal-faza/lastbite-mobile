import { apiFetch } from './client';
import type { ImageVariants } from './products';

/**
 * Flat CartItem — the shape every consumer expects.
 * Backend returns items nested under `product.*`; the mapping is done here.
 */
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

// --- Raw backend shapes (nested product.*) ---

interface RawProduct {
  id: string;
  name: string;
  storeName: string;
  discountedPrice: number;
  originalPrice: number;
  stock: number;
  imageUrl: string | null;
  imageVariants: ImageVariants | null;
  isActive: boolean;
}

interface RawCartItem {
  id: string;
  productId: string;
  quantity: number;
  product: RawProduct;
}

interface RawCart {
  id: string;
  storeName: string | null;
  items: RawCartItem[];
}

// --- Normalisation helpers ---

function mapCartItem(raw: RawCartItem): CartItem {
  return {
    id: raw.id,
    productId: raw.productId,
    quantity: raw.quantity,
    name: raw.product.name,
    storeName: raw.product.storeName,
    price: raw.product.discountedPrice,
    originalPrice: raw.product.originalPrice,
    stock: raw.product.stock,
    imageUrl: raw.product.imageUrl,
    imageVariants: raw.product.imageVariants,
  };
}

function mapCartResponse(raw: { cart: RawCart }): { cart: Cart } {
  return {
    cart: {
      id: raw.cart.id,
      storeName: raw.cart.storeName,
      items: raw.cart.items.map(mapCartItem),
    },
  };
}

// --- Public API functions ---

export async function getCart() {
  const res = await apiFetch<{ cart: RawCart }>('/cart', { auth: true });
  return mapCartResponse(res);
}

export async function addToCart(productId: string, quantity = 1) {
  const res = await apiFetch<{ cart: RawCart }>('/cart', {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
  return mapCartResponse(res);
}

export async function updateCartItem(productId: string, quantity: number) {
  const res = await apiFetch<{ cart: RawCart }>(`/cart/items/${productId}`, {
    auth: true,
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
  return mapCartResponse(res);
}

export async function removeCartItem(productId: string) {
  const res = await apiFetch<{ cart: RawCart }>(`/cart/items/${productId}`, {
    auth: true,
    method: 'DELETE',
  });
  return mapCartResponse(res);
}

export async function clearCart() {
  return apiFetch<{ message: string }>('/cart', {
    auth: true,
    method: 'DELETE',
  });
}
