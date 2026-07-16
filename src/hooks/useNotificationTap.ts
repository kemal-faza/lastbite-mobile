import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useNotifications } from './useNotifications';
import { NotificationRouter } from '@/lib/notifications/NotificationRouter';
import type { Notification } from '@/lib/api/notifications';

export function useNotificationTap() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { markAsRead } = useNotifications();

  const handleTap = useCallback(
    (notification: Notification) => {
      NotificationRouter.handleTap(notification, {
        queryClient,
        userRole: user?.role,
        markAsReadFn: async (id) => markAsRead(id),
      });
    },
    [markAsRead, queryClient, user?.role]
  );

  return handleTap;
}
