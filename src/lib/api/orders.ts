import { apiFetch } from './client';
import type { ImageVariants } from './products';

// --- Normalised (flat) types that consumers expect ---

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
  savingAmount: number;
  storeName: string;
  pickupExpiresAt?: string;
  items: OrderItem[];
  buyerName: string;
  buyerPhone: string;
  notes?: string;
  createdAt?: string;
  hasReviewed?: boolean;
}

// --- Raw backend types ---

interface RawOrderItem {
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

interface RawOrder {
  id: string;
  status: string;
  pickupCode: string;
  totalAmount: number;
  savingAmount: number;
  storeName: string;
  pickupExpiresAt?: string;
  items: RawOrderItem[];
  buyerName: string;
  buyerPhone: string;
  notes?: string;
  createdAt?: string;
  review?: { id: string } | null;
}

// --- Normalisation helpers ---

function mapOrderItem(raw: RawOrderItem): OrderItem {
  return {
    id: raw.id,
    productId: raw.productId,
    name: raw.name,
    storeName: raw.storeName,
    price: raw.price,
    originalPrice: raw.originalPrice,
    quantity: raw.quantity,
    imageUrl: raw.imageUrl,
    imageVariants: raw.imageVariants,
  };
}

export function mapOrder(raw: RawOrder): Order {
  return {
    id: raw.id,
    status: raw.status,
    pickupCode: raw.pickupCode,
    total: raw.totalAmount,                    // backend totalAmount -> mobile total
    savingAmount: raw.savingAmount,
    storeName: raw.storeName,
    pickupExpiresAt: raw.pickupExpiresAt,
    items: (raw.items || []).map(mapOrderItem),
    buyerName: raw.buyerName,
    buyerPhone: raw.buyerPhone,
    notes: raw.notes,
    createdAt: raw.createdAt,
    hasReviewed: !!raw.review,
  };
}

function mapOrderResponse(raw: { order: RawOrder }): { order: Order } {
  return { order: mapOrder(raw.order) };
}

function mapOrdersResponse(raw: { orders: RawOrder[] }): { orders: Order[] } {
  return { orders: raw.orders.map(mapOrder) };
}

// --- Public API functions ---

export async function createOrder(buyerName: string, buyerPhone: string, notes?: string, storeName?: string) {
  const body: Record<string, string> = { buyerName, buyerPhone };
  if (notes !== undefined) body.notes = notes;
  if (storeName !== undefined) body.storeName = storeName;
  const raw = await apiFetch<{ order: RawOrder }>('/orders', {
    auth: true,
    method: 'POST',
    body: JSON.stringify(body),
  });
  return mapOrderResponse(raw);
}

export async function getOrders() {
  const raw = await apiFetch<{ orders: RawOrder[] }>('/orders', { auth: true });
  return mapOrdersResponse(raw);
}

export async function getOrder(id: string) {
  const raw = await apiFetch<{ order: RawOrder }>(`/orders/${id}`, { auth: true });
  return mapOrderResponse(raw);
}

export async function verifyPickup(id: string, pickupCode: string) {
  const raw = await apiFetch<{ order: RawOrder }>(`/orders/${id}/verify-pickup`, {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ pickupCode }),
  });
  return mapOrderResponse(raw);
}

export async function hasPurchaseHistory() {
  return apiFetch<{ hasHistory: boolean }>('/orders/has-history', { auth: true });
}

// Alias untuk consistency dengan useRequireAuth flow
export const confirmPickup = verifyPickup;
