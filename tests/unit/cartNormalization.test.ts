import { getCart, addToCart, updateCartItem } from '../../src/lib/api/cart';
import { apiFetch } from '../../src/lib/api/client';

jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const nestedCartResponse = {
  cart: {
    id: 'cart-1',
    storeName: 'Warung Makan',
    items: [
      {
        id: 'ci-1',
        productId: 'prod-1',
        quantity: 2,
        product: {
          id: 'prod-1',
          name: 'Nasi Goreng',
          storeName: 'Warung Makan',
          discountedPrice: 25000,
          originalPrice: 35000,
          stock: 5,
          imageUrl: '/img/nasi-goreng.jpg',
          imageVariants: {
            thumb: '/img/thumb.jpg',
            card: '/img/card.jpg',
            full: '/img/full.jpg',
          },
          isActive: true,
        },
      },
      {
        id: 'ci-2',
        productId: 'prod-2',
        quantity: 1,
        product: {
          id: 'prod-2',
          name: 'Es Teh',
          storeName: 'Warung Makan',
          discountedPrice: 5000,
          originalPrice: 8000,
          stock: 10,
          imageUrl: null,
          imageVariants: null,
          isActive: true,
        },
      },
    ],
  },
};

describe('Cart API normalisation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getCart flattens nested product fields into CartItem', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(nestedCartResponse);

    const result = await getCart();

    expect(result.cart.items).toHaveLength(2);

    // First item — flat fields
    expect(result.cart.items[0].id).toBe('ci-1');
    expect(result.cart.items[0].productId).toBe('prod-1');
    expect(result.cart.items[0].name).toBe('Nasi Goreng');      // was raw.product.name
    expect(result.cart.items[0].storeName).toBe('Warung Makan'); // was raw.product.storeName
    expect(result.cart.items[0].price).toBe(25000);              // was raw.product.discountedPrice
    expect(result.cart.items[0].originalPrice).toBe(35000);      // was raw.product.originalPrice
    expect(result.cart.items[0].quantity).toBe(2);
    expect(result.cart.items[0].stock).toBe(5);                  // was raw.product.stock
    expect(result.cart.items[0].imageUrl).toBe('/img/nasi-goreng.jpg');

    // Second item — null imageVariants passthrough
    expect(result.cart.items[1].imageVariants).toBeNull();
  });

  it('getCart passes through cart-level fields', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(nestedCartResponse);

    const result = await getCart();

    expect(result.cart.id).toBe('cart-1');
    expect(result.cart.storeName).toBe('Warung Makan');
  });

  it('getCart handles empty items array', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      cart: { id: 'cart-2', storeName: null, items: [] },
    });

    const result = await getCart();

    expect(result.cart.items).toEqual([]);
    expect(result.cart.id).toBe('cart-2');
    expect(result.cart.storeName).toBeNull();
  });

  it('addToCart normalises nested response', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(nestedCartResponse);

    const result = await addToCart('prod-1', 1);

    expect(result.cart.items[0].name).toBe('Nasi Goreng');
    expect(result.cart.items[0].price).toBe(25000);
  });

  it('updateCartItem normalises nested response', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(nestedCartResponse);

    const result = await updateCartItem('prod-1', 3);

    expect(result.cart.items[0].name).toBe('Nasi Goreng');
    expect(result.cart.items[0].price).toBe(25000);
  });
});
