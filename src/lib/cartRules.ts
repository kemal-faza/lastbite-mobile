export function canAddToCart(cart: any[], product: any): boolean {
  if (cart.length === 0) return true;
  const sameStore = cart.every((item) => item.storeName === product.storeName);
  if (!sameStore) return false;
  const existing = cart.find((item) => item.id === product.id);
  if (existing && existing.quantity >= product.stock) return false;
  return true;
}

export function calculateCartTotal(cart: any[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
