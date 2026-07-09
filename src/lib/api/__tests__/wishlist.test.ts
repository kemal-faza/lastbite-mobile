import {
  fetchWishlistProducts,
  subscribeToStockAlert,
  unsubscribeFromStockAlert,
  getStockAlertSubscriptions,
} from '../wishlist';

describe('wishlist API stub', () => {
  it('fetchWishlistProducts returns empty array (no throw)', async () => {
    const res = await fetchWishlistProducts(['p1', 'p2']);
    expect(res).toEqual([]);
  });

  it('subscribeToStockAlert returns subscribed: true (no-op)', async () => {
    const res = await subscribeToStockAlert('p1');
    expect(res.subscribed).toBe(true);
  });

  it('unsubscribeFromStockAlert returns subscribed: false (no-op)', async () => {
    const res = await unsubscribeFromStockAlert('p1');
    expect(res.subscribed).toBe(false);
  });

  it('getStockAlertSubscriptions returns empty array (no-op)', async () => {
    const res = await getStockAlertSubscriptions();
    expect(res).toEqual([]);
  });
});
