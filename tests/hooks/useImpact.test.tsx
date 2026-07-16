import { renderHook } from '@testing-library/react-native';
import { useImpact } from '@/hooks/useImpact';

const mockUseOrders = jest.fn();
jest.mock('@/hooks/useOrders', () => ({
  useOrders: (...args: any[]) => mockUseOrders(...args),
}));

describe('useImpact', () => {
  beforeEach(() => {
    mockUseOrders.mockReset();
  });

  it('returns zeros and isLoading:true when useOrders has no data yet', async () => {
    mockUseOrders.mockReturnValue({ data: undefined, isLoading: true });

    const { result } = await renderHook(() => useImpact());

    expect(result.current).toEqual({
      moneySaved: 0,
      foodSaved: 0,
      isLoading: true,
    });
  });

  it('sums savingAmount and foodSaved from PICKED_UP orders only', async () => {
    mockUseOrders.mockReturnValue({
      data: {
        orders: [
          { id: '1', status: 'PICKED_UP', savingAmount: 15000, items: [{ quantity: 2 }, { quantity: 1 }] },
          { id: '2', status: 'PICKED_UP', savingAmount: 10000, items: [{ quantity: 1 }] },
          { id: '3', status: 'CANCELLED', savingAmount: 5000, items: [{ quantity: 1 }] },
        ],
      },
      isLoading: false,
    });

    const { result } = await renderHook(() => useImpact());

    expect(result.current).toEqual({
      moneySaved: 25000,
      foodSaved: 4,
      isLoading: false,
    });
  });

  it('returns zeros when orders array is empty', async () => {
    mockUseOrders.mockReturnValue({
      data: { orders: [] },
      isLoading: false,
    });

    const { result } = await renderHook(() => useImpact());

    expect(result.current).toEqual({
      moneySaved: 0,
      foodSaved: 0,
      isLoading: false,
    });
  });
});
