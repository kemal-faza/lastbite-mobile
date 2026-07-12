import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProductForm } from '@/components/ProductForm';

// Mock react-native-currency-input (renders as a simple text element for testing)
jest.mock('react-native-currency-input', () => ({
  __esModule: true,
  default: 'CurrencyInput',
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  MediaTypeOptions: { Images: 'Images' },
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
}));

// Mock expo-image (native Image component)
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock @/components/ui/button to avoid deep native module chain (Slot, etc.)
jest.mock('@/components/ui/button', () => ({
  Button: 'Button',
}));

describe('ProductForm', () => {
  it('renders all form fields with correct labels', async () => {
    const { getByText } = await render(
      <ProductForm onSubmit={jest.fn()} isLoading={false} />
    );
    expect(getByText('Nama Produk')).toBeTruthy();
    expect(getByText('Deskripsi')).toBeTruthy();
    expect(getByText('Kategori')).toBeTruthy();
    expect(getByText('Harga Normal')).toBeTruthy();
    expect(getByText('Harga Diskon')).toBeTruthy();
    expect(getByText('Stok Tersedia')).toBeTruthy();
    expect(getByText('Batas Waktu')).toBeTruthy();
  });

  it('renders submit button text', async () => {
    const { getByText } = await render(
      <ProductForm onSubmit={jest.fn()} isLoading={false} />
    );
    expect(getByText('Simpan Produk')).toBeTruthy();
  });

  it('pre-fills name field from initialData', async () => {
    const { getByDisplayValue } = await render(
      <ProductForm
        onSubmit={jest.fn()}
        isLoading={false}
        initialData={{
          name: 'Nasi Kotak',
          description: 'Nasi kotak dengan lauk surplus',
          category: 'meals' as const,
          originalPrice: 25000,
          discountedPrice: 15000,
          stock: 5,
          expiry: '< 3 Jam',
        } as any}
      />
    );
    expect(getByDisplayValue('Nasi Kotak')).toBeTruthy();
    // Note: price and stock fields use CurrencyInput (mocked as 'CurrencyInput'),
    // so they are not queried via getByDisplayValue in unit tests.
  });

  it('calls onSubmit when form submitted', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { getByText } = await render(
      <ProductForm
        onSubmit={onSubmit}
        isLoading={false}
        initialData={{
          name: 'Test',
          description: 'Test description panjang ya',
          category: 'bakery' as const,
          originalPrice: 20000,
          discountedPrice: 10000,
          stock: 3,
          expiry: '< 1 Jam',
        } as any}
      />
    );

    fireEvent.press(getByText('Simpan Produk'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('shows ActivityIndicator instead of button text when isLoading is true', async () => {
    const { queryByText } = await render(
      <ProductForm onSubmit={jest.fn()} isLoading={true} />
    );
    // 'Simpan Produk' should not be visible when loading
    expect(queryByText('Simpan Produk')).toBeNull();
  });
});
