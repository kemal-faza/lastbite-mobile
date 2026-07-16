import type { MitraStats } from '@/types/domain';

export function mapMitraStats(raw: any): MitraStats {
  if (!raw) {
    return {
      totalRevenue: 0,
      mealsSaved: 0,
      activeProductsCount: 0,
      pendingOrdersCount: 0,
      activeOrders: 0,
      productCount: 0,
      totalSold: 0,
      revenue: 0,
    };
  }
  const totalRevenue = Number(raw.totalRevenue ?? raw.revenue ?? 0);
  const mealsSaved = Number(raw.mealsSaved ?? raw.totalSold ?? 0);
  const activeProductsCount = Number(raw.activeProductsCount ?? raw.productCount ?? 0);
  const pendingOrdersCount = Number(raw.pendingOrdersCount ?? raw.activeOrders ?? 0);

  return {
    totalRevenue,
    mealsSaved,
    activeProductsCount,
    pendingOrdersCount,
    activeOrders: pendingOrdersCount,
    productCount: activeProductsCount,
    totalSold: mealsSaved,
    revenue: totalRevenue,
  };
}

export async function getMitraStats(): Promise<MitraStats> {
  // Return stub data for mock
  return mapMitraStats({
    activeOrders: 5,
    productCount: 12,
    totalSold: 150,
    revenue: 2500000,
  });
}
