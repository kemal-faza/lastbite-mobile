import { apiFetch, API_BASE } from './client';

export interface ImageVariants {
  thumb: string;
  card: string;
  full: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'distance_asc' | 'stock_asc';
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
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
  // Optional fields (dari backend, mungkin undefined)
  description?: string;
  discountPercent?: number;
  storeAddress?: string;
  storeLat?: number;
  storeLng?: number;
  expiresAt?: string;
  distanceKm?: number;
  averageRating?: number;
  reviewCount?: number;
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

export async function getProducts(params?: ProductFilters) {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.lat !== undefined) query.append('lat', String(params.lat));
  if (params?.lng !== undefined) query.append('lng', String(params.lng));
  if (params?.radius !== undefined) query.append('radius', String(params.radius));
  if (params?.page !== undefined) query.append('page', String(params.page));
  if (params?.limit !== undefined) query.append('limit', String(params.limit));
  const qs = query.toString();
  return apiFetch<{ products: Product[] }>(`/products${qs ? `?${qs}` : ''}`);
}

export async function getProduct(id: string) {
  return apiFetch<{ product: Product & { description?: string; storeAddress?: string; storeLat?: number; storeLng?: number; expiresAt?: string } }>(`/products/${id}`);
}
