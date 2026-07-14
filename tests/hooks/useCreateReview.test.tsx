import { renderHook, act, waitFor } from '@testing-library/react-native/pure';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCreateReview } from '../../src/hooks/useReviews';
import { apiFetch } from '../../src/lib/api/client';

jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

function createWrapper(qc: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

describe('useCreateReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls createReview and invalidates queries on success', async () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    (apiFetch as jest.Mock).mockResolvedValue({
      review: {
        id: 'rev-1',
        userId: 'u1',
        userName: 'John',
        productId: 'p1',
        rating: 5,
        comment: 'Great!',
        createdAt: '2024-01-01T00:00:00Z',
      },
    });

    const invalidateSpy = jest.spyOn(qc, 'invalidateQueries');
    const { result } = await renderHook(() => useCreateReview(), {
      wrapper: createWrapper(qc),
    });

    act(() => {
      result.current.mutate({ orderId: 'ORD-1', rating: 5, comment: 'Great!' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiFetch).toHaveBeenCalledWith('/reviews/orders/ORD-1/review', {
      method: 'POST',
      body: JSON.stringify({ rating: 5, comment: 'Great!' }),
      auth: true,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['orders'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['order', 'ORD-1'] });
  });
});
