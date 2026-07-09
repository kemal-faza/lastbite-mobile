// STUB: returns empty defaults until backend /notifications endpoint is ready.
// Sub-spek 7 (Wishlist + Notifications + Search + Profile) will swap stub for real implementation.

export type NotificationType = 'order_status' | 'stock_alert' | 'promo';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    orderId?: string;
    productId?: string;
  };
}

export interface NotificationsResponse {
  notifications: NotificationData[];
  unreadCount: number;
}

export async function fetchNotifications(): Promise<NotificationsResponse> {
  // STUB: no throw; return empty
  return { notifications: [], unreadCount: 0 };
}

export async function markNotificationRead(_id: string): Promise<{ success: boolean }> {
  // STUB: no-op
  return { success: true };
}
