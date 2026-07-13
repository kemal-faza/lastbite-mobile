import { render, fireEvent } from '@testing-library/react-native';
import { MitraOrderCard } from '@/components/MitraOrderCard';
import { useUpdateOrderStatus } from '@/hooks/useMitra';
import type { MitraOrder } from '@/lib/api/mitra';

jest.mock('@/hooks/useMitra', () => ({
  useUpdateOrderStatus: jest.fn(),
}));

const mockMutate = jest.fn();

const mockOrder: MitraOrder = {
  id: 'ORD-001',
  pickupCode: 'LAST-1234',
  status: 'PENDING',
  totalAmount: 50000,
  buyerName: 'Budi',
  buyerPhone: '08123456789',
  pickupExpiresAt: '2026-07-13T14:00:00Z',
  notes: undefined,
  items: [
    { id: '1', name: 'Nasi Goreng', quantity: 2, price: 25000 },
    { id: '2', name: 'Es Teh', quantity: 1, price: 5000 },
  ],
};

describe('MitraOrderCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateOrderStatus as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('renders order details (buyer name, total amount, item count)', async () => {
    const { getByText } = await render(
      <MitraOrderCard order={mockOrder} onPress={jest.fn()} />
    );
    expect(getByText('Budi')).toBeTruthy();
    expect(getByText('2 Produk')).toBeTruthy();
    expect(getByText(/^Rp50.000/)).toBeTruthy();
  });

  it('renders header with order ID and status badge', async () => {
    const { getByText } = await render(
      <MitraOrderCard order={mockOrder} onPress={jest.fn()} />
    );
    expect(getByText('ORD-001')).toBeTruthy();
    expect(getByText('PENDING')).toBeTruthy();
  });

  it('calls onPress when card is pressed', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <MitraOrderCard order={mockOrder} onPress={onPress} />
    );
    fireEvent.press(getByText('Budi'));
    expect(onPress).toHaveBeenCalled();
  });

  it('calls mutate with PROCESSED when PENDING action button pressed', async () => {
    const { getByText } = await render(
      <MitraOrderCard order={mockOrder} onPress={jest.fn()} />
    );
    fireEvent.press(getByText('Proses Pesanan'));
    expect(mockMutate).toHaveBeenCalledWith(
      { id: 'ORD-001', status: 'PROCESSED' },
      expect.objectContaining({ onError: expect.any(Function) })
    );
  });

  it('calls mutate with READY when PROCESSED action button pressed', async () => {
    const processedOrder: MitraOrder = { ...mockOrder, status: 'PROCESSED' };
    const { getByText } = await render(
      <MitraOrderCard order={processedOrder} onPress={jest.fn()} />
    );
    fireEvent.press(getByText('Siap Diambil'));
    expect(mockMutate).toHaveBeenCalledWith(
      { id: 'ORD-001', status: 'READY' },
      expect.objectContaining({ onError: expect.any(Function) })
    );
  });

  it('disables action button while mutation is pending', async () => {
    (useUpdateOrderStatus as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });
    const { getByText } = await render(
      <MitraOrderCard order={mockOrder} onPress={jest.fn()} />
    );
    fireEvent.press(getByText('Proses Pesanan'));
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('does not render action button for READY, PICKED_UP, CANCELLED statuses', async () => {
    const terminalStatuses = ['READY', 'PICKED_UP', 'CANCELLED'] as const;
    for (const status of terminalStatuses) {
      const order: MitraOrder = { ...mockOrder, status };
      const { queryByText } = await render(
        <MitraOrderCard order={order} onPress={jest.fn()} />
      );
      expect(queryByText('Proses Pesanan')).toBeNull();
      expect(queryByText('Siap Diambil')).toBeNull();
    }
  });
});
