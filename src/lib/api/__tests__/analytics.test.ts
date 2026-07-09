import {
  fetchSalesTrend,
  fetchRevenueSummary,
  fetchProductPerformance,
  fetchPeakHours,
} from '../analytics';

describe('analytics API stub', () => {
  it('fetchSalesTrend returns empty array', async () => {
    const res = await fetchSalesTrend({ from: '2026-07-01', to: '2026-07-10' });
    expect(res.trend).toEqual([]);
  });

  it('fetchRevenueSummary returns zeroed defaults', async () => {
    const res = await fetchRevenueSummary({ from: '2026-07-01', to: '2026-07-10' });
    expect(res.summary.totalRevenue).toBe(0);
    expect(res.summary.totalOrders).toBe(0);
  });

  it('fetchProductPerformance returns empty array', async () => {
    const res = await fetchProductPerformance({ from: '2026-07-01', to: '2026-07-10' });
    expect(res.products).toEqual([]);
  });

  it('fetchPeakHours returns empty array', async () => {
    const res = await fetchPeakHours({ from: '2026-07-01', to: '2026-07-10' });
    expect(res.hours).toEqual([]);
  });
});
