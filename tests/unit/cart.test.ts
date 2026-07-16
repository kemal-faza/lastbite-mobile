import { canAddToCart, calculateCartTotal, groupByStore, filterForCheckout } from '@/lib/cart';
import type { CartItem, Product } from '@/types/domain';

const productA = {
  id: '1',
  storeName: 'Store A',
  discountedPrice: 10000,
  originalPrice: 15000,
  stock: 5,
  name: 'Product A',
  category: 'meals',
  imageUrl: null,
  imageVariants: null,
} as Product;

const productB = {
  id: '2',
  storeName: 'Store B',
  discountedPrice: 15000,
  originalPrice: 20000,
  stock: 3,
  name: 'Product B',
  category: 'meals',
  imageUrl: null,
  imageVariants: null,
} as Product;

const cartItemA: CartItem = {
  id: 'c1',
  productId: '1',
  storeName: 'Store A',
  price: 10000,
  originalPrice: 15000,
  quantity: 2,
  name: 'Product A',
  imageUrl: null,
  imageVariants: null,
  stock: 5,
};

const cartItemB: CartItem = {
  id: 'c2',
  productId: '2',
  storeName: 'Store B',
  price: 15000,
  originalPrice: 20000,
  quantity: 1,
  name: 'Product B',
  imageUrl: null,
  imageVariants: null,
  stock: 3,
};

describe('cart helper module', () => {
  describe('canAddToCart', () => {
    it('allows adding product to empty cart', () => {
      expect(canAddToCart([], productA)).toBe(true);
    });

    it('blocks adding product from different store', () => {
      const cart = [cartItemA];
      expect(canAddToCart(cart, productB)).toBe(false);
    });

    it('blocks exceeding stock', () => {
      const cart = [{ ...cartItemA, quantity: 5 }];
      expect(canAddToCart(cart, productA)).toBe(false);
    });

    it('allows adding if below stock', () => {
      const cart = [{ ...cartItemA, quantity: 4 }];
      expect(canAddToCart(cart, productA)).toBe(true);
    });
  });

  describe('calculateCartTotal', () => {
    it('calculates total correctly', () => {
      const cart = [cartItemA, cartItemB];
      expect(calculateCartTotal(cart)).toBe(35000); // 10000*2 + 15000*1
    });
  });

  describe('groupByStore', () => {
    it('groups cart items by store name', () => {
      const cart = [
        cartItemA,
        { ...cartItemA, id: 'c3', productId: '3', name: 'Product C' },
        cartItemB,
      ];
      const groups = groupByStore(cart);
      expect(Object.keys(groups)).toEqual(['Store A', 'Store B']);
      expect(groups['Store A']).toHaveLength(2);
      expect(groups['Store B']).toHaveLength(1);
    });
  });

  describe('filterForCheckout', () => {
    it('filters cart items by store name', () => {
      const cart = [cartItemA, cartItemB];
      const filtered = filterForCheckout(cart, 'Store A');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].productId).toBe('1');
    });
  });
});
