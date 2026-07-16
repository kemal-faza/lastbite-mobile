import { apiFetch } from './client';
import type { ImageVariants, MitraProduct, MitraStats } from '@/types/domain';
import { mapMitraStats } from './mitra-stats';

// --- Normalised (flat) types ---

export interface MitraProfile {
  id: string;
  storeName: string;
  storeDescription: string | null;
  storeAddress: string | null;
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

// --- Raw backend types ---

interface RawMitraProduct {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  imageUrl: string | null;
  imageVariants: ImageVariants | null;
  category: string;
  description?: string;
  expiresAt: string;
  isActive: boolean;
}

interface RawMitraOrder {
  id: string;
  pickupCode: string;
  status: 'PENDING' | 'PROCESSED' | 'READY' | 'PICKED_UP' | 'CANCELLED';
  totalAmount: number;
  buyerName: string;
  buyerPhone: string;
  pickupExpiresAt: string;
  notes?: string;
  items: RawMitraOrderItem[];
}

interface RawMitraOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// --- Normalisation helpers ---

export function mapMitraProduct(raw: RawMitraProduct): MitraProduct {
  if (!raw) {
    return {
      id: '',
      name: '',
      originalPrice: 0,
      discountedPrice: 0,
      stock: 0,
      imageUrl: null,
      imageVariants: null,
      category: '',
      expiresAt: '',
    };
  }
  return {
    id: raw.id,
    name: raw.name,
    originalPrice: raw.originalPrice,
    discountedPrice: raw.discountedPrice,
    stock: raw.stock,
    imageUrl: raw.imageUrl,
    imageVariants: raw.imageVariants,
    category: raw.category,
    description: raw.description,
    expiresAt: raw.expiresAt,
  };
}

function mapMitraOrderItem(raw: RawMitraOrderItem): MitraOrderItem {
  return {
    id: raw.id,
    name: raw.name,
    quantity: raw.quantity,
    price: raw.price,
  };
}

export function mapMitraOrder(raw: RawMitraOrder): MitraOrder {
  if (!raw) {
    return {
      id: '',
      pickupCode: '',
      status: 'PENDING',
      totalAmount: 0,
      buyerName: '',
      buyerPhone: '',
      pickupExpiresAt: '',
      items: [],
    };
  }
  return {
    id: raw.id,
    pickupCode: raw.pickupCode,
    status: raw.status,
    totalAmount: raw.totalAmount,
    buyerName: raw.buyerName,
    buyerPhone: raw.buyerPhone,
    pickupExpiresAt: raw.pickupExpiresAt,
    notes: raw.notes,
    items: (raw.items || []).map(mapMitraOrderItem),
  };
}

// --- Public API functions ---

export async function getMitraProfile() {
  return apiFetch<{ profile: MitraProfile }>('/mitra/me', { auth: true });
}

export async function getMitraProducts() {
  const res = await apiFetch<{ products: RawMitraProduct[] }>('/mitra/products', { auth: true });
  return { products: res.products.map(mapMitraProduct) };
}

export async function getMitraOrders() {
  const res = await apiFetch<{ orders: RawMitraOrder[] }>('/mitra/orders', { auth: true });
  return { orders: res.orders.map(mapMitraOrder) };
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

export async function getMitraStats(): Promise<{ stats: MitraStats }> {
  const res = await apiFetch<{ stats: any }>('/mitra/stats', { auth: true });
  return {
    stats: mapMitraStats(res.stats),
  };
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
