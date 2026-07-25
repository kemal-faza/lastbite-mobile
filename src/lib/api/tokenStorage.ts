import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'user';

/** Persist access and refresh tokens. */
export async function setTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
}

/** Persist tokens + serialized user (called after login). */
export async function setSession(accessToken: string, refreshToken: string, user: any) {
  await setTokens(accessToken, refreshToken);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

/** Read the access token (null if absent). */
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

/** Read the refresh token (null if absent). */
export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

/** Read and parse the cached user object (null if absent or corrupt). */
export async function getCachedUser(): Promise<any | null> {
  try {
    const str = await SecureStore.getItemAsync(USER_KEY);
    if (!str) return null;
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/** Write (replace) the cached user object without touching tokens.
 *  Used by useAuthBootstrap after a successful background profile sync. */
export async function setCachedUser(user: any) {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

/** Remove all persisted session data. */
export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}
