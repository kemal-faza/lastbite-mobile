import { apiFetch, API_BASE } from './client';

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

export function getImageVariants(variants: ImageVariants | null | undefined): ImageVariants | null {
  if (!variants) return null;
  const resolve = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_BASE}${url}`;
  };
  return {
    thumb: resolve(variants.thumb),
    card: resolve(variants.card),
    full: resolve(variants.full),
  };
}

export function getVariantUrl(
  variants: ImageVariants | null | undefined,
  variant: 'thumb' | 'card' | 'full'
): string | null {
  const resolved = getImageVariants(variants);
  return resolved?.[variant] ?? null;
}

export async function getProducts(params?: { category?: string; search?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiFetch<{ products: Product[] }>(`/products?${query}`);
}

export async function getProduct(id: string) {
  return apiFetch<{ product: Product & { description?: string; storeAddress?: string; storeLat?: number; storeLng?: number; expiresAt?: string } }>(`/products/${id}`);
}
