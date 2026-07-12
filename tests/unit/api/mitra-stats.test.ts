import { getMitraStats } from '@/lib/api/mitra-stats';

describe('mitra-stats', () => {
  it('returns mock stats with all required fields', async () => {
    const stats = await getMitraStats();
    expect(stats).toHaveProperty('activeOrders');
    expect(stats).toHaveProperty('productCount');
    expect(stats).toHaveProperty('totalSold');
    expect(stats).toHaveProperty('revenue');
    expect(typeof stats.activeOrders).toBe('number');
    expect(typeof stats.productCount).toBe('number');
    expect(typeof stats.totalSold).toBe('number');
    expect(typeof stats.revenue).toBe('number');
  });
});
