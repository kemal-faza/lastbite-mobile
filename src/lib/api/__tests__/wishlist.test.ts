import { getWishlist, subscribeToProduct, unsubscribeFromProduct } from '../wishlist';

jest.mock('../client', () => ({
  apiFetch: jest.fn(),
}));

describe('wishlist API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWishlist', () => {
    it('calls apiFetch with auth:true and returns mapped productIds', async () => {
      const { apiFetch } = jest.requireMock('../client') as { apiFetch: jest.Mock };
      apiFetch.mockResolvedValueOnce({
        subscriptions: [{ productId: 'uuid-1' }, { productId: 'uuid-2' }],
      });

      const result = await getWishlist();

      expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions', { auth: true });
      expect(result).toEqual({ productIds: ['uuid-1', 'uuid-2'] });
    });

    it('handles direct productIds array payload from backend', async () => {
      const { apiFetch } = jest.requireMock('../client') as { apiFetch: jest.Mock };
      apiFetch.mockResolvedValueOnce({
        productIds: ['uuid-1', 'uuid-2'],
      });

      const result = await getWishlist();

      expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions', { auth: true });
      expect(result).toEqual({ productIds: ['uuid-1', 'uuid-2'] });
    });
  });

  describe('subscribeToProduct', () => {
    it('calls apiFetch POST with auth:true and productId in body', async () => {
      const { apiFetch } = jest.requireMock('../client') as { apiFetch: jest.Mock };
      apiFetch.mockResolvedValueOnce({});

      await subscribeToProduct('prod-1');

      expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions', {
        auth: true,
        method: 'POST',
        body: JSON.stringify({ productId: 'prod-1' }),
      });
    });
  });

  describe('unsubscribeFromProduct', () => {
    it('calls apiFetch DELETE with auth:true', async () => {
      const { apiFetch } = jest.requireMock('../client') as { apiFetch: jest.Mock };
      apiFetch.mockResolvedValueOnce({});

      await unsubscribeFromProduct('prod-1');

      expect(apiFetch).toHaveBeenCalledWith('/wishlist-subscriptions/prod-1', {
        auth: true,
        method: 'DELETE',
      });
    });
  });
});
