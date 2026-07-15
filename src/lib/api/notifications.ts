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

export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  if (diffHrs < 24) return `${diffHrs} jm lalu`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return new Date(dateString).toLocaleDateString('id-ID');
}

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
  }>(url);

  return {
    notifications: raw.notifications.map(mapNotification),
    unreadCount: raw.unreadCount,
  };
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await apiFetch(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}
