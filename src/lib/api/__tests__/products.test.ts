import { getProducts, getProduct, type ProductFilters } from '../products';

describe('getProducts', () => {
  it('builds query string with all filter params', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [] }),
    });
    const filters: ProductFilters = {
      category: 'meals',
      search: 'roti',
      sort: 'price_asc',
      lat: -6.2,
      lng: 106.8,
      radius: 5,
      page: 1,
      limit: 20,
    };
    await getProducts(filters);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('category=meals'),
      expect.any(Object),
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('sort=price_asc'),
      expect.any(Object),
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('lat=-6.2'),
      expect.any(Object),
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('radius=5'),
      expect.any(Object),
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=1'),
      expect.any(Object),
    );
  });

  it('handles empty params', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [] }),
    });
    await getProducts();
    const url = (fetch as jest.Mock).mock.calls[0][0];
    expect(url).not.toContain('category');
    expect(url).not.toContain('sort');
  });
});

describe('Product type', () => {
  it('accepts optional fields from backend', () => {
    const p = {
      id: '1',
      name: 'Roti',
      storeName: 'Toko A',
      originalPrice: 20000,
      discountedPrice: 10000,
      stock: 5,
      imageUrl: null,
      imageVariants: null,
      category: 'bakery' as const,
      description: 'Fresh',
      discountPercent: 50,
      storeAddress: 'Jl. A',
      storeLat: -6.2,
      storeLng: 106.8,
      expiresAt: '2026-07-10T19:00:00Z',
      distanceKm: 1.5,
      averageRating: 4.5,
      reviewCount: 10,
    };
    expect(p.description).toBe('Fresh');
    expect(p.distanceKm).toBe(1.5);
  });
});
