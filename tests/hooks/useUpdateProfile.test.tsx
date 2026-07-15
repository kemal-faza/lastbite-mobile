import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';

jest.mock('@/lib/api/client', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('@/stores/authStore', () => ({
  useAuthStore: (sel: any) => sel({ updateUser: jest.fn(), user: { id: '1', name: 'Test' } }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useUpdateProfile', () => {
  it('calls apiFetch with PATCH', async () => {
    const { apiFetch } = require('@/lib/api/client');
    apiFetch.mockResolvedValue({ user: { id: '1', email: 'test@test.com', name: 'Budi', phone: '08123456789', role: 'FOOD_SAVER', isVerified: true } });

    const { result } = await renderHook(() => useUpdateProfile(), { wrapper });
    result.current.mutate({ name: 'Budi' });

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Budi' }),
      });
    });
  });
});
