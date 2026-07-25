import { getAccessToken, getRefreshToken, setTokens } from './tokenStorage';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

// ── Production HTTPS enforcement (M-4) ─────────────────────────────────
// In production builds, the API URL must use HTTPS. HTTP in production
// exposes auth tokens and user data to man-in-the-middle attacks.
if (
  typeof __DEV__ !== 'undefined' &&
  !__DEV__ &&
  API_BASE.startsWith('http://')
) {
  console.error(
    '[SECURITY] EXPO_PUBLIC_API_URL must be https:// in production builds. ' +
    'Current value: ' + API_BASE,
  );
}

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// 401 handler registered by auth layer — avoids circular dependency
let on401: (() => Promise<void>) | null = null;

export function registerUnauthorizedHandler(fn: () => Promise<void>) {
  on401 = fn;
}

// ── Token Refresh (H-2) ───────────────────────────────────────────────
// Deduplicates concurrent refresh attempts so multiple 401s from parallel
// requests only trigger a single POST /auth/refresh.

let refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data?.tokens?.accessToken) {
      await setTokens(
        data.tokens.accessToken,
        data.tokens.refreshToken ?? refreshToken,
      );
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export type ApiFetchOptions = RequestInit & {
  auth?: boolean;
  /** When true, a 401 response will NOT trigger the registered unauthorized handler.
   * Use for background/silent requests where a stale token shouldn't log the user out. */
  silent401?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  // Only set Content-Type for non-FormData bodies (browser/RN sets multipart boundary automatically)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth) {
    const token = await getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Auto-logout on expired/invalid token (skip when silent401 is set)
    if (res.status === 401 && (body.code === 'TOKEN_EXPIRED' || body.code === 'UNAUTHORIZED')) {
      if (!options.silent401) {
        // Only attempt refresh once — _retry flag prevents infinite loop
        if (!(options as any)._retry) {
          if (!refreshPromise) {
            refreshPromise = attemptTokenRefresh();
          }
          const refreshed = await refreshPromise;
          refreshPromise = null;

          if (refreshed) {
            return apiFetch(path, { ...options, _retry: true as any } as any);
          }
        }

        await on401?.();
      }
    }
    throw new ApiError(
      res.status,
      body.code || 'UNKNOWN',
      body.error || 'Unknown error',
    );
  }
  return body as T;
}

export { setSession, clearTokens } from './tokenStorage';

