import { mapWishlistResponse, type RawWishlistResponse, type WishlistResponse } from '@/lib/api/wishlist';

describe('mapWishlistResponse', () => {
  it('maps backend response to productIds array', () => {
    const raw: RawWishlistResponse = {
      subscriptions: [
        { productId: 'uuid-1' },
        { productId: 'uuid-2' },
        { productId: 'uuid-3' },
      ],
    };
    const result = mapWishlistResponse(raw);
    expect(result).toEqual({
      productIds: ['uuid-1', 'uuid-2', 'uuid-3'],
    });
  });

  it('handles empty subscriptions', () => {
    const raw: RawWishlistResponse = { subscriptions: [] };
    const result = mapWishlistResponse(raw);
    expect(result).toEqual({ productIds: [] });
  });
});
