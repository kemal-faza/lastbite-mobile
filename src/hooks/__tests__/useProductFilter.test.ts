import { renderHook, act } from '@testing-library/react-native';
import { useProductFilter } from '../useProductFilter';

jest.mock('../useGeolocation', () => ({
  useGeolocation: () => ({ lat: -6.2, lng: 106.81 }),
}));

jest.mock('../useProducts', () => ({
  useProducts: (filters: any) => ({
    data: { products: [] },
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: jest.fn(),
  }),
}));

describe('useProductFilter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('provides debouncedQuery and computes isDebouncing correctly', async () => {
    const { result } = await renderHook(() => useProductFilter());

    expect(result.current.query).toBe('');
    expect(result.current.debouncedQuery).toBe('');
    expect(result.current.isDebouncing).toBe(false);

    // Set query to 'r' (1 character)
    await act(() => {
      result.current.setQuery('r');
    });

    expect(result.current.query).toBe('r');
    expect(result.current.debouncedQuery).toBe('');
    expect(result.current.isDebouncing).toBe(true);

    // Fast-forward 300ms
    await act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.debouncedQuery).toBe('r');
    expect(result.current.isDebouncing).toBe(false);
    expect(result.current.apiFilters.search).toBe('r');
  });
});
