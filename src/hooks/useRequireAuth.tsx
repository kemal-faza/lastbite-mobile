import { useEffect, type ReactNode } from 'react';
import { router, useSegments, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();

  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action();
      return;
    }
    const returnUrl = '/' + segments.join('/');
    router.push({ pathname: '/login', params: { returnUrl } });
  };

  return { requireAuth, isAuthenticated };
}

export function RequireAuth({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const navState = useRootNavigationState();

  useEffect(() => {
    if (!navState?.key || isAuthenticated) return;
    const returnUrl = '/' + segments.join('/');
    router.replace({ pathname: '/login', params: { returnUrl } });
  }, [isAuthenticated, navState?.key, segments]);

  if (!isAuthenticated) return <>{fallback}</>;
  return <>{children}</>;
}
