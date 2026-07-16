import { apiFetch } from '@/lib/api/client';
import { useAuthStore } from '@/stores/authStore';

// Mock authStore to track logout calls
const mockLogout = jest.fn().mockResolvedValue(undefined);

jest.mock('@/stores/authStore', () => ({
  useAuthStore: {
    getState: () => ({
      logout: mockLogout,
    }),
  },
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Import auth module to trigger registerUnauthorizedHandler
beforeAll(async () => {
  // Import triggers registerUnauthorizedHandler(() => authService.logout())
  // which closes over the mock authStore above
  await import('@/lib/auth');
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('401 unauthorized → auth logout (integration)', () => {
  it('triggers authStore.logout on 401 TOKEN_EXPIRED via apiFetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ code: 'TOKEN_EXPIRED', error: 'Token expired' }),
    });

    await expect(apiFetch('/test', { auth: true })).rejects.toThrow();
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('triggers authStore.logout on 401 UNAUTHORIZED code', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ code: 'UNAUTHORIZED', error: 'Unauthorized' }),
    });

    await expect(apiFetch('/test', { auth: true })).rejects.toThrow();
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('does NOT trigger authStore.logout with silent401:true', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ code: 'TOKEN_EXPIRED', error: 'Token expired' }),
    });

    await expect(
      apiFetch('/test', { auth: true, silent401: true }),
    ).rejects.toThrow();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('does NOT trigger logout on 403 errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ code: 'FORBIDDEN', error: 'Forbidden' }),
    });

    await expect(apiFetch('/test', { auth: true })).rejects.toThrow();
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
