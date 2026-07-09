import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  markNotificationRead,
  type NotificationData,
} from '@/lib/api/notifications';

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        return await fetchNotifications();
      } catch {
        return { notifications: [] as NotificationData[], unreadCount: 0 };
      }
    },
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    markAsRead: markRead.mutate,
    refresh: query.refetch,
  };
}
