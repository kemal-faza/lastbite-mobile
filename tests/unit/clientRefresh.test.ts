import { apiFetch } from '@/lib/api/client';

jest.mock('@/lib/api/tokenStorage', () => ({
  getAccessToken: jest.fn(() => Promise.resolve('old-token')),
  getRefreshToken: jest.fn(() => Promise.resolve('refresh-1')),
  setTokens: jest.fn(() => Promise.resolve()),
  clearTokens: jest.fn(),
  getCachedUser: jest.fn(),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('apiFetch token refresh on 401', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock to clear any unconsumed mockResolvedValueOnce from previous tests
    mockFetch.mockReset();
    // Re-assign the default implementation (jest.fn() with no return)
    // mockReset clears the mock function entirely, which is what we need
  });

  it('refreshes the token and retries once on 401 TOKEN_EXPIRED', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ code: 'TOKEN_EXPIRED' }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ tokens: { accessToken: 'new-token', refreshToken: 'new-refresh' } }) }) // /auth/refresh
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ data: 'success' }) });

    const result = await apiFetch<{ data: string }>('/protected', { auth: true });

    expect(result).toEqual({ data: 'success' });
    expect(mockFetch).toHaveBeenCalledTimes(3); // original + refresh + retry
    const refreshCall = mockFetch.mock.calls[1];
    expect(refreshCall[0]).toContain('/auth/refresh');
    expect(refreshCall[1].body).toContain('refresh-1');
  });

  it('does not retry when refresh fails (falls through to throw)', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ code: 'TOKEN_EXPIRED' }) })
      .mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({}) }); // refresh fails

    await expect(apiFetch('/protected', { auth: true })).rejects.toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(2); // original + refresh, no retry
  });

  it('does NOT attempt refresh when silent401 is set', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ code: 'TOKEN_EXPIRED' }) });

    await expect(apiFetch('/protected', { auth: true, silent401: true })).rejects.toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1); // no refresh call
  });
});
