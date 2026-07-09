import { hasPurchaseHistory, confirmPickup } from '../orders';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mock-token')),
  setItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

describe('orders API', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('hasPurchaseHistory GETs /orders/has-history with auth', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hasHistory: true }),
    });
    const res = await hasPurchaseHistory();
    expect(res.hasHistory).toBe(true);
    const [url, init] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('/orders/has-history');
    expect(init.headers.Authorization).toContain('Bearer');
  });

  it('confirmPickup aliases verifyPickup behavior', async () => {
    await confirmPickup('order-1', 'LAST-1234');
    const [url, init] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toContain('/orders/order-1/verify-pickup');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body).pickupCode).toBe('LAST-1234');
  });
});
