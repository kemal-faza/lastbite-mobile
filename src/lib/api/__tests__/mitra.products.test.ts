import { createMitraProduct, updateMitraProduct, deleteMitraProduct } from '../mitra';
import { apiFetch } from '../client';

jest.mock('../client', () => ({
  apiFetch: jest.fn(),
}));

describe('Mitra Product API — FormData mutations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createMitraProduct with FormData calls apiFetch POST', async () => {
    const formData = new FormData();
    formData.append('name', 'Nasi Lemak');
    (apiFetch as jest.Mock).mockResolvedValueOnce({ id: '123' });

    await createMitraProduct(formData);

    expect(apiFetch).toHaveBeenCalledWith('/mitra/products', {
      auth: true,
      method: 'POST',
      body: formData,
    });
  });

  it('updateMitraProduct with FormData calls apiFetch PUT', async () => {
    const formData = new FormData();
    formData.append('price', '15000');
    (apiFetch as jest.Mock).mockResolvedValueOnce({ success: true });

    await updateMitraProduct('prod-1', formData);

    expect(apiFetch).toHaveBeenCalledWith('/mitra/products/prod-1', {
      auth: true,
      method: 'PUT',
      body: formData,
    });
  });

  it('deleteMitraProduct calls apiFetch DELETE', async () => {
    (apiFetch as jest.Mock).mockResolvedValueOnce({ success: true });

    await deleteMitraProduct('prod-1');

    expect(apiFetch).toHaveBeenCalledWith('/mitra/products/prod-1', {
      auth: true,
      method: 'DELETE',
    });
  });
});
