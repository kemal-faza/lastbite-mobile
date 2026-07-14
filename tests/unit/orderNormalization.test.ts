import { getOrders, getOrder } from '../../src/lib/api/orders';
import { apiFetch } from '../../src/lib/api/client';

jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const rawOrdersResponse = {
  orders: [
    {
      id: 'ord-1',
      status: 'PENDING',
      pickupCode: 'LAST-A1B2',
      totalAmount: 55000,
      savingAmount: 15000,
      storeName: 'Warung Makan',
      pickupExpiresAt: '2026-07-14T12:00:00Z',
      items: [
        {
          id: 'oi-1',
          productId: 'prod-1',
          name: 'Nasi Goreng',
          storeName: 'Warung Makan',
          price: 25000,
          originalPrice: 35000,
          quantity: 2,
          imageUrl: '/img/nasi-goreng.jpg',
          imageVariants: { thumb: '/img/thumb.jpg', card: '/img/card.jpg', full: '/img/full.jpg' },
        },
      ],
      buyerName: 'John Doe',
      buyerPhone: '08123456789',
      notes: 'Tanpa sambal',
      createdAt: '2026-07-14T10:30:00Z',
    },
    {
      id: 'ord-2',
      status: 'READY',
      pickupCode: 'LAST-C3D4',
      totalAmount: 30000,
      savingAmount: 8000,
      storeName: 'Bakery Segar',
      pickupExpiresAt: undefined,
      items: [],
      buyerName: 'Jane Smith',
      buyerPhone: '0811223344',
      notes: undefined,
      createdAt: '2026-07-14T09:00:00Z',
    },
  ],
};

const rawOrderResponse = {
  order: rawOrdersResponse.orders[0],
};

describe('Order API normalisation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getOrders maps totalAmount to total', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrdersResponse);

    const result = await getOrders();

    expect(result.orders[0].total).toBe(55000);    // was totalAmount
    expect(result.orders[1].total).toBe(30000);
  });

  it('getOrders passes through savingAmount', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrdersResponse);

    const result = await getOrders();

    expect(result.orders[0].savingAmount).toBe(15000);
    expect(result.orders[1].savingAmount).toBe(8000);
  });

  it('getOrders passes through buyer name and phone', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrdersResponse);

    const result = await getOrders();

    expect(result.orders[0].buyerName).toBe('John Doe');
    expect(result.orders[0].buyerPhone).toBe('08123456789');
  });

  it('getOrders passes through notes and createdAt', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrdersResponse);

    const result = await getOrders();

    expect(result.orders[0].notes).toBe('Tanpa sambal');
    expect(result.orders[0].createdAt).toBe('2026-07-14T10:30:00Z');
  });

  it('getOrders handles optional fields as undefined', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrdersResponse);

    const result = await getOrders();

    expect(result.orders[1].notes).toBeUndefined();
    expect(result.orders[1].pickupExpiresAt).toBeUndefined();
  });

  it('getOrder maps a single order', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrderResponse);

    const result = await getOrder('ord-1');

    expect(result.order.id).toBe('ord-1');
    expect(result.order.total).toBe(55000);
    expect(result.order.savingAmount).toBe(15000);
    expect(result.order.storeName).toBe('Warung Makan');
    expect(result.order.status).toBe('PENDING');
    expect(result.order.buyerName).toBe('John Doe');
  });

  it('getOrder normalises items', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce(rawOrderResponse);

    const result = await getOrder('ord-1');

    expect(result.order.items).toHaveLength(1);
    expect(result.order.items[0].name).toBe('Nasi Goreng');
    expect(result.order.items[0].price).toBe(25000);
  });

  it('getOrders handles empty array', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({ orders: [] });

    const result = await getOrders();

    expect(result.orders).toEqual([]);
  });
});
