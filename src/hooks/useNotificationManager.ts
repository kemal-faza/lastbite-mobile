import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { registerDeviceToken } from '@/lib/api/devices';
import { useToast } from '@/contexts/ToastContext';
import { NotificationRouter } from '@/lib/notifications/NotificationRouter';

export function useNotificationManager() {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // 1. Setup Push Notification Permissions and Token Registration
  useEffect(() => {
    if (!isAuthenticated) return;

    const setupDeviceToken = async () => {
      try {
        if (!Device.isDevice) return;
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return;
        const { data } = await Notifications.getExpoPushTokenAsync();
        await registerDeviceToken(data);
      } catch {
        // Silent fail — registration is non-critical
      }
    };

    setupDeviceToken();
  }, [isAuthenticated]);

  // 2. Setup Notification Event Listeners (Foreground & Background Tap)
  useEffect(() => {
    // A. Foreground Listener (Aplikasi sedang aktif dibuka)
    const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
      try {
        const data = notification.request.content.data as Record<string, unknown> | undefined;
        const { title, body } = notification.request.content;

        // Invalidate target cache using Unified NotificationRouter
        if (data?.type) {
          const payload = NotificationRouter.normalize(data);
          const keys = NotificationRouter.resolveInvalidationKeys(payload, user?.role);
          keys.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          // Fallback invalidation
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }

        // Show in-app banner toast for non-silent notifications
        if (title || body) {
          showToast(body || title || 'Anda menerima notifikasi baru');
        }
      } catch {
        // Silent fail for robust runtime behavior
      }
    });

    // B. Response/Tap Listener (Pengguna mengetuk notifikasi dari OS tray)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown> | undefined;
      if (!data?.type) return;

      NotificationRouter.handleTap(data, {
        queryClient,
        userRole: user?.role,
      });
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [queryClient, user, showToast]);
}
