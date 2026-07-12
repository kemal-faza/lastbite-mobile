import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Listens for incoming push notification data payloads (FCM silent data messages)
 * and invalidates relevant React Query caches based on the notification type.
 *
 * When the backend sends a notification with `{ type: 'dashboard_update' }`,
 * this hook silently invalidates mitra-stats and mitra-orders queries,
 * triggering a background refetch.
 */
export function useNotificationResponder() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Handle foreground notifications (silent data payloads)
    const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data as Record<string, unknown> | undefined;

      if (!data?.type) return;

      switch (data.type) {
        case 'dashboard_update':
          queryClient.invalidateQueries({ queryKey: ['mitra-stats'] });
          queryClient.invalidateQueries({ queryKey: ['mitra-orders'] });
          break;
        default:
          break;
      }
    });

    // Handle user tapping on notification (opens from background)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown> | undefined;

      if (!data?.type) return;

      switch (data.type) {
        case 'dashboard_update':
          queryClient.invalidateQueries({ queryKey: ['mitra-stats'] });
          queryClient.invalidateQueries({ queryKey: ['mitra-orders'] });
          break;
        default:
          break;
      }
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [queryClient]);
}
