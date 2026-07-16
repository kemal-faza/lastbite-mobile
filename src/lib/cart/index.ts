import type { CartItem, Product } from '@/types/domain';

export function canAddToCart(cart: CartItem[], product: Product): boolean {
  if (cart.length === 0) return true;
  const sameStore = cart.every((item) => item.storeName === product.storeName);
  if (!sameStore) return false;
  const existing = cart.find((item) => item.productId === product.id);
  if (existing && existing.quantity >= product.stock) return false;
  return true;
}

export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function groupByStore(cart: CartItem[]): Record<string, CartItem[]> {
  return cart.reduce((groups, item) => {
    const store = item.storeName;
    if (!groups[store]) groups[store] = [];
    groups[store].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);
}

export function filterForCheckout(cart: CartItem[], storeName: string): CartItem[] {
  return cart.filter((item) => item.storeName === storeName);
}
