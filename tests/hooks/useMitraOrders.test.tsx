import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateOrderStatus } from '../../src/hooks/useMitra';
import { apiFetch } from '../../src/lib/api/client';

jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUpdateOrderStatus', () => {
  it('calls PATCH /mitra/orders/:id/status and invalidates queries', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({ success: true });

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = await renderHook(() => useUpdateOrderStatus(), { wrapper });

    act(() => {
      result.current.mutate({ id: 'ORD-123', status: 'PROCESSED' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith('/mitra/orders/ORD-123/status', {
      auth: true,
      method: 'PATCH',
      body: JSON.stringify({ status: 'PROCESSED' }),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['mitra-orders'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['mitra-stats'] });
  });
});
