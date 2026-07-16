import { apiFetch } from './client';

// Raw from backend
export interface RawNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data: Record<string, string> | null;
  isRead: boolean;
  createdAt: string;
}

// Flat for mobile
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  productId?: string;
  orderId?: string;
  isRead: boolean;
  createdAt: string;
  relativeTime: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

import { formatRelativeTime } from '@/lib/utils/formatRelativeTime';

export function mapNotification(raw: RawNotification): Notification {
  return {
    id: raw.id,
    title: raw.title,
    body: raw.body,
    type: raw.type || 'general',
    productId: raw.data?.productId,
    orderId: raw.data?.orderId,
    isRead: raw.isRead,
    createdAt: raw.createdAt,
    relativeTime: formatRelativeTime(raw.createdAt),
  };
}

export async function getNotifications(params?: {
  unread?: boolean;
  limit?: number;
  offset?: number;
}): Promise<NotificationsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.unread) searchParams.set('unread', 'true');
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString();
  const url = `/notifications${query ? `?${query}` : ''}`;

  const raw = await apiFetch<{
    notifications: RawNotification[];
    unreadCount: number;
  }>(url, { auth: true });

  return {
    notifications: raw.notifications.map(mapNotification),
    unreadCount: raw.unreadCount,
  };
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await apiFetch(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
    auth: true,
  });
}
