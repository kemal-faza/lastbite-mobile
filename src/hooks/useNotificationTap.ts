import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useNotifications } from './useNotifications';
import type { Notification } from '@/lib/api/notifications';

export function useNotificationTap() {
  const router = useRouter();
  const { markAsRead } = useNotifications();

  const handleTap = useCallback(
    (notification: Notification) => {
      markAsRead(notification.id);

      switch (notification.type) {
        case 'stock_alert':
          if (notification.productId) {
            router.push(`/(food-saver)/product/${notification.productId}`);
          }
          break;
        case 'order_status':
          if (notification.orderId) {
            router.push(`/(food-saver)/order/${notification.orderId}`);
          }
          break;
        default:
          router.push('/(food-saver)');
      }
    },
    [markAsRead, router]
  );

  return handleTap;
}
