import { filterByDistance } from '../filterByDistance';
import type { Product } from '@/lib/api/products';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    name: 'Test Product',
    storeName: 'Store',
    originalPrice: 10000,
    discountedPrice: 5000,
    stock: 5,
    imageUrl: null,
    imageVariants: null,
    category: 'meals',
    ...overrides,
  };
}

describe('filterByDistance', () => {
  it('returns all products when maxDistance is 0 (Tidak terbatas)', () => {
    const products = [
      makeProduct({ distanceKm: 1 }),
      makeProduct({ id: 'p2', distanceKm: 10 }),
    ];
    expect(filterByDistance(products, 0)).toEqual(products);
  });

  it('filters by 10 km correctly (10 IS a valid limit, not skip)', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'Within', distanceKm: 5 }),
      makeProduct({ id: 'p2', name: 'Beyond', distanceKm: 15 }),
      makeProduct({ id: 'p3', name: 'At limit', distanceKm: 10 }),
    ];
    const result = filterByDistance(products, 10);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(['Within', 'At limit']);
  });

  it('filters out products beyond maxDistance', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'Nearby', distanceKm: 2 }),
      makeProduct({ id: 'p2', name: 'Far', distanceKm: 10 }),
      makeProduct({ id: 'p3', name: 'Medium', distanceKm: 4 }),
    ];
    const result = filterByDistance(products, 5);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toEqual(['Nearby', 'Medium']);
  });

  it('excludes products with null distanceKm', () => {
    const products = [
      makeProduct({ id: 'p1', name: 'No distance', distanceKm: undefined }),
      makeProduct({ id: 'p2', name: 'Nearby', distanceKm: 2 }),
    ];
    const result = filterByDistance(products, 5);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Nearby');
  });

  it('returns empty array when no products match', () => {
    const products = [
      makeProduct({ distanceKm: 20 }),
      makeProduct({ id: 'p2', distanceKm: 15 }),
    ];
    expect(filterByDistance(products, 3)).toEqual([]);
  });
});
