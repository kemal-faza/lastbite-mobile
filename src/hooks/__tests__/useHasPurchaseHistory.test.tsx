import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHasPurchaseHistory } from '../useHasPurchaseHistory';
import { useAuthStore } from '@/stores/authStore';
import { hasPurchaseHistory } from '@/lib/api/orders';
import type { ReactNode } from 'react';

jest.mock('@/lib/api/orders', () => ({
  hasPurchaseHistory: jest.fn(),
}));

const mockApi = hasPurchaseHistory as jest.MockedFunction<typeof hasPurchaseHistory>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useHasPurchaseHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('returns false when not authenticated (no API call)', async () => {
    const { result } = await renderHook(() => useHasPurchaseHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
    expect(mockApi).not.toHaveBeenCalled();
  });

  it('returns true when authenticated and API returns hasHistory: true', async () => {
    useAuthStore.setState({ user: { id: '1' } as any, isAuthenticated: true });
    mockApi.mockResolvedValueOnce({ hasHistory: true });

    const { result } = await renderHook(() => useHasPurchaseHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('returns false when authenticated and API returns hasHistory: false', async () => {
    useAuthStore.setState({ user: { id: '1' } as any, isAuthenticated: true });
    mockApi.mockResolvedValueOnce({ hasHistory: false });

    const { result } = await renderHook(() => useHasPurchaseHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('returns false when API throws (graceful default)', async () => {
    useAuthStore.setState({ user: { id: '1' } as any, isAuthenticated: true });
    mockApi.mockRejectedValueOnce(new Error('404 not found'));

    const { result } = await renderHook(() => useHasPurchaseHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});
