import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

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
    const token = await AsyncStorage.getItem('accessToken');
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

