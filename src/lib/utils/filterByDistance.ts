import type { Product } from '@/lib/api/products';

/**
 * Client-side distance filter for products.
 * Filters by product's pre-computed `distanceKm` (from backend or haversine).
 * - If maxDistance <= 0 (Tidak terbatas) or > 10: no filter (returns all).
 * - Otherwise: keeps products with distanceKm <= maxDistance.
 *   Products without distanceKm (null/undefined) are excluded when filter is active.
 */
export function filterByDistance(
  products: Product[],
  maxDistance: number,
): Product[] {
  if (maxDistance <= 0 || maxDistance > 10) return products;

  return products.filter(
    (p) => p.distanceKm != null && p.distanceKm <= maxDistance,
  );
}
