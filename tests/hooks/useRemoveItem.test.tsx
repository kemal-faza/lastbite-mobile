import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { removeCartItem, clearCart } from '../../src/lib/api/cart';
import { apiFetch } from '../../src/lib/api/client';
import { useCart } from '../../src/hooks/useCart';

jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

describe('cart API - remove & clear', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('removeCartItem calls DELETE /cart/items/:productId', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({ cart: { id: 'c1', storeName: null, items: [] } });
    await removeCartItem('prod-1');
    expect(apiFetch).toHaveBeenCalledWith('/cart/items/prod-1', {
      auth: true,
      method: 'DELETE',
    });
  });

  it('clearCart calls DELETE /cart', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({ message: 'Cart cleared' });
    await clearCart();
    expect(apiFetch).toHaveBeenCalledWith('/cart', {
      auth: true,
      method: 'DELETE',
    });
  });
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('useRemoveItem', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('calls removeCartItem and invalidates cart query', async () => {
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (apiFetch as jest.Mock)
      .mockResolvedValueOnce({ cart: { id: 'cart-1', storeName: null, items: [] } }) // removeCartItem
      .mockResolvedValueOnce({ cart: { id: 'cart-1', storeName: null, items: [] } }); // getCart (re-fetch)

    const { result } = await renderHook(() => useCart(true), { wrapper });

    await act(async () => {
      result.current.removeItem.mutate('prod-1');
    });

    await waitFor(() => expect(result.current.removeItem.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith('/cart/items/prod-1', {
      auth: true,
      method: 'DELETE',
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['cart'] });
  });
});
