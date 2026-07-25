import { useEffect, useState } from 'react';
import { setCachedUser } from '@/lib/api/tokenStorage';
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
            setCachedUser(freshUser);
          })
          .catch(() => {});
      }
    });
  }, []);

  return { isBootstrapping };
}
