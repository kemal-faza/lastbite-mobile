import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/stores/authStore';
import { getProfile } from '@/lib/api/profile';

export function useAuthBootstrap() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const cachedUserStr = await AsyncStorage.getItem('user');

        if (token && cachedUserStr) {
          const cachedUser = JSON.parse(cachedUserStr);
          // 1. Restore the session immediately from cached user data (optimistic)
          setUser(cachedUser);
          setIsBootstrapping(false);

          // 2. Refresh / sync user profile in background
          try {
            const freshUser = await getProfile();
            setUser(freshUser);
            await AsyncStorage.setItem('user', JSON.stringify(freshUser));
          } catch (err: any) {
            // Note: If 401 occurs, apiFetch interceptor auto-triggers logout and clears tokens.
            // If offline or other network error, keep using the cached session.
            console.log('[AuthBootstrap] Background profile sync failed:', err.message);
          }
        } else {
          setIsBootstrapping(false);
        }
      } catch (e) {
        console.error('[AuthBootstrap] Error during bootstrap:', e);
        setIsBootstrapping(false);
      }
    }

    bootstrap();
  }, [setUser]);

  return { isBootstrapping };
}
