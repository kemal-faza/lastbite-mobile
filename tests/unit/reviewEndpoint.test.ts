import { apiFetch } from '@/lib/api/client';
import { createReview } from '@/lib/api/reviews';

jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

describe('createReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls POST /reviews/orders/:orderId/review', async () => {
    (apiFetch as jest.Mock).mockResolvedValue({
      review: { id: 'r1', rating: 5, comment: null, createdAt: '2024-01-01' },
    });

    await createReview('order-123', { rating: 5, comment: 'Test' });

    expect(apiFetch).toHaveBeenCalledWith(
      '/reviews/orders/order-123/review',
      expect.objectContaining({ method: 'POST', auth: true }),
    );
  });

  it('sends rating and comment in body', async () => {
    (apiFetch as jest.Mock).mockResolvedValue({
      review: { id: 'r2', rating: 4, comment: 'Enak', createdAt: '2024-01-01' },
    });

    await createReview('order-456', { rating: 4, comment: 'Enak' });

    expect(apiFetch).toHaveBeenCalledWith(
      '/reviews/orders/order-456/review',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ rating: 4, comment: 'Enak' }),
      }),
    );
  });

  it('returns the created review', async () => {
    const mockResponse = {
      review: { id: 'r3', rating: 3, comment: 'Biasa', createdAt: '2024-01-01' },
    };
    (apiFetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await createReview('order-789', { rating: 3, comment: 'Biasa' });

    expect(result).toEqual(mockResponse);
  });
});
