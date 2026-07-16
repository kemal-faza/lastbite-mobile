import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/stores/authStore';
import { login as loginApi } from '@/lib/api/auth';
import { registerUnauthorizedHandler } from '@/lib/api/client';

// Register the 401 handler once at module init.
// This decouples client.ts (which fires 401) from the auth layer:
// the handler lives here, not in client.ts, so the import cycle
// client.ts → auth/index.ts → auth.ts → client.ts is eliminated.
registerUnauthorizedHandler(async () => {
  await useAuthStore.getState().logout();
});

export const authService = {
  /**
   * Login, store tokens, and update in-memory auth state.
   */
  async login(email: string, password: string) {
    const res = await loginApi(email, password);
    useAuthStore.getState().setUser(res.user);
    return res;
  },

  /**
   * Clear tokens and reset in-memory auth state.
   */
  async logout() {
    await useAuthStore.getState().logout();
  },

  /**
   * Restore session from AsyncStorage on app startup.
   * Returns after optimistic restore from cached data.
   * Background profile sync happens in the useAuthBootstrap hook.
   */
  async bootstrap(): Promise<{ isAuthenticated: boolean }> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const cachedUserStr = await AsyncStorage.getItem('user');

      if (token && cachedUserStr) {
        const cachedUser = JSON.parse(cachedUserStr);
        useAuthStore.getState().setUser(cachedUser);
        return { isAuthenticated: true };
      }

      return { isAuthenticated: false };
    } catch {
      return { isAuthenticated: false };
    }
  },

  /**
   * Read access token from storage.
   * Used by apiFetch to attach Bearer header.
   */
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem('accessToken');
  },
};
