// STUB: returns empty defaults until backend /wishlist endpoints are ready.
// Sub-spek 7 will swap stub for real implementation.

export async function fetchWishlistProducts<T = unknown>(_ids: string[]): Promise<T[]> {
  // STUB: no throw; return empty
  return [];
}

export async function subscribeToStockAlert(_productId: string): Promise<{ subscribed: boolean }> {
  // STUB: no-op
  return { subscribed: true };
}

export async function unsubscribeFromStockAlert(_productId: string): Promise<{ subscribed: boolean }> {
  // STUB: no-op
  return { subscribed: false };
}

export async function getStockAlertSubscriptions(): Promise<string[]> {
  // STUB: no throw; return empty
  return [];
}
