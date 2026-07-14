import { renderHook, act, waitFor } from '@testing-library/react-native/pure';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useConfirmPickup } from '../../src/hooks/useOrders';
import { apiFetch } from '../../src/lib/api/client';

jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

function createWrapper(qc: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

describe('useConfirmPickup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls confirmPickup and invalidates queries on success', async () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    (apiFetch as jest.Mock).mockResolvedValue({
      order: {
        id: 'ORD-1',
        status: 'READY',
        pickupCode: 'ABC123',
        totalAmount: 50000,
        savingAmount: 10000,
        storeName: 'Store A',
        items: [],
        buyerName: 'John',
        buyerPhone: '08123456789',
      },
    });

    const invalidateSpy = jest.spyOn(qc, 'invalidateQueries');
    const { result } = await renderHook(() => useConfirmPickup(), {
      wrapper: createWrapper(qc),
    });

    act(() => {
      result.current.mutate({ id: 'ORD-1', pickupCode: 'ABC123' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith('/orders/ORD-1/verify-pickup', {
      auth: true,
      method: 'POST',
      body: JSON.stringify({ pickupCode: 'ABC123' }),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['orders'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['order', 'ORD-1'] });
  });
});
