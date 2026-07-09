import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMitraProduct, updateMitraProduct, deleteMitraProduct, getMitraStats, type MitraStats, type MitraOrder } from '../mitra';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mock-token')),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

describe('mitra API', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('createMitraProduct POSTs to /mitra/products', async () => {
    await createMitraProduct({
      name: 'Roti',
      originalPrice: 20000,
      discountedPrice: 10000,
      stock: 5,
      category: 'meals',
      storeName: 'Toko A',
      expiresAt: '2026-07-10T19:00:00Z',
    });
    const [url, init] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('/mitra/products');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body).name).toBe('Roti');
  });

  it('updateMitraProduct PATCHes to /mitra/products/:id', async () => {
    await updateMitraProduct('p123', { stock: 3 });
    const [url, init] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('/mitra/products/p123');
    expect(init.method).toBe('PATCH');
  });

  it('deleteMitraProduct DELETEs /mitra/products/:id', async () => {
    await deleteMitraProduct('p123');
    const [url, init] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('/mitra/products/p123');
    expect(init.method).toBe('DELETE');
  });

  it('getMitraStats returns typed stats', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        stats: { activeOrders: 5, productCount: 10, totalSold: 100, totalRevenue: 1500000 },
      }),
    });
    const res = await getMitraStats();
    const stats: MitraStats = res.stats;
    expect(stats.activeOrders).toBe(5);
    expect(stats.productCount).toBe(10);
  });
});
