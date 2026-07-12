export type MitraStats = {
  activeOrders: number;
  productCount: number;
  totalSold: number;
  revenue: number;
};

export async function getMitraStats(): Promise<MitraStats> {
  return {
    activeOrders: 5,
    productCount: 12,
    totalSold: 150,
    revenue: 2500000,
  };
}
