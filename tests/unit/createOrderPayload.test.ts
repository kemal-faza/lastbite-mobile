import { createOrder } from '../../src/lib/api/orders';
import { apiFetch } from '../../src/lib/api/client';

jest.mock('../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

describe('createOrder', () => {
  it('sends buyerName, buyerPhone, and notes in request body', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      order: { id: 'ord-1', status: 'PENDING', pickupCode: 'LAST-A1B2', total: 50000, storeName: 'Warung', items: [] },
    });

    await createOrder('John', '08123456789', 'Tanpa sambal');

    expect(apiFetch).toHaveBeenCalledWith('/orders', {
      auth: true,
      method: 'POST',
      body: JSON.stringify({ buyerName: 'John', buyerPhone: '08123456789', notes: 'Tanpa sambal' }),
    });
  });

  it('omits notes key from request when not provided', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      order: { id: 'ord-2', status: 'PENDING', pickupCode: 'LAST-C3D4', total: 30000, storeName: 'Bakery', items: [] },
    });

    await createOrder('Jane', '0811223344');

    expect(apiFetch).toHaveBeenCalledWith('/orders', {
      auth: true,
      method: 'POST',
      body: JSON.stringify({ buyerName: 'Jane', buyerPhone: '0811223344' }),
    });
  });

  it('sends storeName in request body when provided', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      order: { id: 'ord-3', status: 'PENDING', pickupCode: 'LAST-E5F6', total: 45000, storeName: 'Warung', items: [] },
    });

    await createOrder('John', '08123456789', undefined, 'Warung');

    expect(apiFetch).toHaveBeenCalledWith('/orders', {
      auth: true,
      method: 'POST',
      body: JSON.stringify({ buyerName: 'John', buyerPhone: '08123456789', storeName: 'Warung' }),
    });
  });

  it('omits storeName key from request when not provided', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({
      order: { id: 'ord-4', status: 'PENDING', pickupCode: 'LAST-G7H8', total: 25000, storeName: 'Bakery', items: [] },
    });

    await createOrder('Jane', '0811223344', 'Catatan');

    expect(apiFetch).toHaveBeenCalledWith('/orders', {
      auth: true,
      method: 'POST',
      body: JSON.stringify({ buyerName: 'Jane', buyerPhone: '0811223344', notes: 'Catatan' }),
    });
    const body = (apiFetch as jest.Mock).mock.calls[0][1].body;
    const parsed = JSON.parse(body);
    expect(parsed).not.toHaveProperty('storeName');
  });
});
