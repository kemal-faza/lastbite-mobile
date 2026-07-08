import { apiFetch } from './client';

export interface ImageVariants {
  thumb: string;
  card: string;
  full: string;
}

export interface Product {
  id: string;
  name: string;
  storeName: string;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  imageUrl: string | null;
  imageVariants: ImageVariants | null;
  category: 'meals' | 'bakery' | 'drinks';
}

export async function getProducts(params?: { category?: string; search?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiFetch<{ products: Product[] }>(`/products?${query}`);
}

export async function getProduct(id: string) {
  return apiFetch<{ product: Product & { description?: string; storeAddress?: string; storeLat?: number; storeLng?: number; expiresAt?: string } }>(`/products/${id}`);
}
