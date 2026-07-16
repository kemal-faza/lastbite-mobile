import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/lib/auth';
import { getProfile } from '@/lib/api/profile';
import { useAuthStore } from '@/stores/authStore';

export function useAuthBootstrap() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    authService.bootstrap().then(({ isAuthenticated }) => {
      setIsBootstrapping(false);

      // Background profile sync (silent fail if offline / 401)
      // silent401:true prevents an expired cached token from silently
      // logging the user out — the per-screen queries handle 401 on their own.
      if (isAuthenticated) {
        getProfile({ silent401: true })
          .then((freshUser) => {
            useAuthStore.getState().setUser(freshUser);
            AsyncStorage.setItem('user', JSON.stringify(freshUser));
          })
          .catch(() => {});
      }
    });
  }, []);

  return { isBootstrapping };
}
