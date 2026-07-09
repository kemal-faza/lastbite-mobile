// STUB: returns empty defaults until backend /analytics/* endpoints are ready.
// Sub-spek 1 (Mitra Dashboard Analytics tab) will swap stub for real implementation.

export interface AnalyticsParams {
  from: string;  // ISO date
  to: string;    // ISO date
  granularity?: 'daily' | 'weekly' | 'monthly';
}

export interface SalesTrendEntry {
  date: string;
  revenue: number;
  orders: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalSavings: number;
  totalOrders: number;
  totalItems: number;
  averageOrderValue: number;
}

export interface RevenueSummaryResponse {
  summary: RevenueSummary;
}

export interface ProductPerformanceEntry {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

export interface PeakHourEntry {
  hour: number;  // 0-23
  orderCount: number;
}

export async function fetchSalesTrend(_params: AnalyticsParams): Promise<{ trend: SalesTrendEntry[] }> {
  return { trend: [] };
}

export async function fetchRevenueSummary(_params: AnalyticsParams): Promise<{ summary: RevenueSummary }> {
  return {
    summary: {
      totalRevenue: 0,
      totalSavings: 0,
      totalOrders: 0,
      totalItems: 0,
      averageOrderValue: 0,
    },
  };
}

export async function fetchProductPerformance(_params: AnalyticsParams): Promise<{ products: ProductPerformanceEntry[] }> {
  return { products: [] };
}

export async function fetchPeakHours(_params: AnalyticsParams): Promise<{ hours: PeakHourEntry[] }> {
  return { hours: [] };
}
