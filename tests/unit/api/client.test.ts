import { apiFetch, registerUnauthorizedHandler } from '@/lib/api/client';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockOn401 = jest.fn().mockResolvedValue(undefined);

beforeEach(() => {
  jest.clearAllMocks();
  // Register a fresh mock handler for each test
  registerUnauthorizedHandler(mockOn401);
});

describe('apiFetch', () => {
  it('returns body on 200 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'hello' }),
    });

    const result = await apiFetch('/test');
    expect(result).toEqual({ data: 'hello' });
    expect(mockOn401).not.toHaveBeenCalled();
  });

  describe('unauthorized handling', () => {
    const mock401Response = () =>
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ code: 'TOKEN_EXPIRED', error: 'Token expired' }),
      });

    it('calls registered handler on 401 and throws', async () => {
      mock401Response();

      await expect(apiFetch('/test', { auth: true })).rejects.toThrow();
      expect(mockOn401).toHaveBeenCalledTimes(1);
    });

    it('SKIPS registered handler when silent401: true and throws', async () => {
      mock401Response();

      await expect(
        apiFetch('/test', { auth: true, silent401: true }),
      ).rejects.toThrow();
      expect(mockOn401).not.toHaveBeenCalled();
    });

    it('does not call handler on 403 errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ code: 'FORBIDDEN', error: 'Forbidden' }),
      });

      await expect(apiFetch('/test', { auth: true })).rejects.toThrow();
      expect(mockOn401).not.toHaveBeenCalled();
    });

    it('throws ApiError with correct status and code', async () => {
      mock401Response();

      try {
        await apiFetch('/test', { auth: true });
      } catch (e: any) {
        expect(e.status).toBe(401);
        expect(e.code).toBe('TOKEN_EXPIRED');
      }
    });

    it('does not crash when no handler is registered', async () => {
      // Clear the handler so on401 is null
      registerUnauthorizedHandler(null as unknown as () => Promise<void>);
      mock401Response();

      await expect(apiFetch('/test', { auth: true })).rejects.toThrow();
    });
  });

  describe('UNAUTHORIZED code (not TOKEN_EXPIRED)', () => {
    it('calls handler when code is UNAUTHORIZED', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ code: 'UNAUTHORIZED', error: 'Unauthorized' }),
      });

      await expect(apiFetch('/test', { auth: true })).rejects.toThrow();
      expect(mockOn401).toHaveBeenCalledTimes(1);
    });

    it('skips handler when code is UNAUTHORIZED + silent401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ code: 'UNAUTHORIZED', error: 'Unauthorized' }),
      });

      await expect(
        apiFetch('/test', { auth: true, silent401: true }),
      ).rejects.toThrow();
      expect(mockOn401).not.toHaveBeenCalled();
    });
  });
});
