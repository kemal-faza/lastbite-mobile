import { apiFetch } from './client';

interface RawWishlistSubscription {
  productId: string;
}

interface RawWishlistResponse {
  subscriptions: RawWishlistSubscription[];
}

export interface WishlistResponse {
  productIds: string[];
}

// Exported for testing
export type { RawWishlistResponse };

export function mapWishlistResponse(raw: RawWishlistResponse): WishlistResponse {
  return {
    productIds: raw.subscriptions.map(s => s.productId),
  };
}

export async function getWishlist(): Promise<WishlistResponse> {
  const raw = await apiFetch<RawWishlistResponse>('/wishlist-subscriptions', { auth: true });
  return mapWishlistResponse(raw);
}

export async function subscribeToProduct(productId: string): Promise<void> {
  await apiFetch('/wishlist-subscriptions', {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

export async function unsubscribeFromProduct(productId: string): Promise<void> {
  await apiFetch(`/wishlist-subscriptions/${productId}`, {
    auth: true,
    method: 'DELETE',
  });
}

export async function checkWishlistStatus(productId: string): Promise<boolean> {
  const { productIds } = await getWishlist();
  return productIds.includes(productId);
}
