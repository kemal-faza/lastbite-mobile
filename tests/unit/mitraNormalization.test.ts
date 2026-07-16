import { getMitraProducts, getMitraOrders, mapMitraProduct, mapMitraOrder } from '../../src/lib/api/mitra';
import { apiFetch } from '../../src/lib/api/client';

jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const rawProductsResponse = {
  products: [
    {
      id: 'mp-1',
      name: 'Roti Bakar Coklat',
      originalPrice: 25000,
      discountedPrice: 15000,
      stock: 8,
      imageUrl: '/img/roti.jpg',
      imageVariants: { thumb: '/img/thumb.jpg', card: '/img/card.jpg', full: '/img/full.jpg' },
      category: 'bakery',
      description: 'Roti bakar dengan coklat leleh',
      expiresAt: '2026-07-16T19:00:00Z',
      isActive: true,
    },
    {
      id: 'mp-2',
      name: 'Nasi Goreng',
      originalPrice: 35000,
      discountedPrice: 25000,
      stock: 3,
      imageUrl: null,
      imageVariants: null,
      category: 'meals',
      expiresAt: '2026-07-16T18:00:00Z',
      isActive: true,
    },
  ],
};

const rawOrdersResponse = {
  orders: [
    {
      id: 'mo-1',
      pickupCode: 'LAST-X1Y2',
      status: 'PENDING',
      totalAmount: 45000,
      buyerName: 'John Doe',
      buyerPhone: '08123456789',
      pickupExpiresAt: '2026-07-16T14:00:00Z',
      notes: 'Pisah bungkus',
      items: [
        { id: 'oi-1', name: 'Nasi Goreng', quantity: 2, price: 25000 },
        { id: 'oi-2', name: 'Es Teh', quantity: 1, price: 5000 },
      ],
    },
  ],
};

describe('Mitra Product normalisation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getMitraProducts returns typed products with all fields', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawProductsResponse);

    const result = await getMitraProducts();

    expect(result.products).toHaveLength(2);
    expect(result.products[0].id).toBe('mp-1');
    expect(result.products[0].name).toBe('Roti Bakar Coklat');
    expect(result.products[0].originalPrice).toBe(25000);
    expect(result.products[0].discountedPrice).toBe(15000);
    expect(result.products[0].stock).toBe(8);
    expect(result.products[0].category).toBe('bakery');
    expect(result.products[0].description).toBe('Roti bakar dengan coklat leleh');
    expect(result.products[0].expiresAt).toBe('2026-07-16T19:00:00Z');
  });

  it('getMitraProducts handles null image fields', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawProductsResponse);

    const result = await getMitraProducts();

    expect(result.products[1].imageUrl).toBeNull();
    expect(result.products[1].imageVariants).toBeNull();
  });

  it('getMitraProducts handles empty array', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({ products: [] });

    const result = await getMitraProducts();

    expect(result.products).toEqual([]);
  });

  it('getMitraProducts returns typed products (not any)', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawProductsResponse);

    const result = await getMitraProducts();

    // TypeScript compile-time check: if this passes, typing is correct
    const names: string[] = result.products.map((p) => p.name);
    expect(names).toEqual(['Roti Bakar Coklat', 'Nasi Goreng']);
  });

  it('mapMitraProduct handles null/undefined input gracefully', () => {
    const result = mapMitraProduct(null as any);
    expect(result.id).toBe('');
    expect(result.name).toBe('');
    expect(result.stock).toBe(0);
  });
});

describe('Mitra Order normalisation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getMitraOrders returns typed orders with all fields', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrdersResponse);

    const result = await getMitraOrders();

    expect(result.orders).toHaveLength(1);
    expect(result.orders[0].id).toBe('mo-1');
    expect(result.orders[0].pickupCode).toBe('LAST-X1Y2');
    expect(result.orders[0].status).toBe('PENDING');
    expect(result.orders[0].totalAmount).toBe(45000);
    expect(result.orders[0].buyerName).toBe('John Doe');
    expect(result.orders[0].buyerPhone).toBe('08123456789');
  });

  it('getMitraOrders maps items correctly', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrdersResponse);

    const result = await getMitraOrders();

    expect(result.orders[0].items).toHaveLength(2);
    expect(result.orders[0].items[0].name).toBe('Nasi Goreng');
    expect(result.orders[0].items[0].quantity).toBe(2);
    expect(result.orders[0].items[0].price).toBe(25000);
  });

  it('getMitraOrders handles empty orders array', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({ orders: [] });

    const result = await getMitraOrders();

    expect(result.orders).toEqual([]);
  });

  it('getMitraOrders preserves optional notes field', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrdersResponse);

    const result = await getMitraOrders();

    expect(result.orders[0].notes).toBe('Pisah bungkus');
  });

  it('getMitraOrders returns typed orders (not any)', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrdersResponse);

    const result = await getMitraOrders();

    // TypeScript compile-time check
    const codes: string[] = result.orders.map((o) => o.pickupCode);
    expect(codes).toEqual(['LAST-X1Y2']);
  });

  it('mapMitraOrder handles null/undefined input gracefully', () => {
    const result = mapMitraOrder(null as any);
    expect(result.id).toBe('');
    expect(result.status).toBe('PENDING');
    expect(result.items).toEqual([]);
  });
});
