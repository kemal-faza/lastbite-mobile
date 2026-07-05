import { canAddToCart, calculateCartTotal } from '@/lib/cartRules';

const productA = { id: '1', storeName: 'Store A', price: 10000, stock: 5 };
const productB = { id: '2', storeName: 'Store B', price: 15000, stock: 3 };

describe('cartRules', () => {
  it('allows adding product to empty cart', () => {
    expect(canAddToCart([], productA)).toBe(true);
  });

  it('blocks adding product from different store', () => {
    const cart = [{ ...productA, quantity: 1 }];
    expect(canAddToCart(cart, productB)).toBe(false);
  });

  it('blocks exceeding stock', () => {
    const cart = [{ ...productA, quantity: 5 }];
    expect(canAddToCart(cart, { ...productA, quantity: 1 } as any)).toBe(false);
  });

  it('calculates total correctly', () => {
    const cart = [
      { ...productA, quantity: 2 },
      { ...productB, quantity: 1 },
    ];
    expect(calculateCartTotal(cart)).toBe(35000);
  });
});
