import { router } from 'expo-router';
import { QueryClient } from '@tanstack/react-query';
import { markNotificationRead } from '@/lib/api/notifications';

export interface NotificationPayload {
  id?: string;
  type: string;
  productId?: string;
  orderId?: string;
}

export const NotificationRouter = {
  // Normalize payloads from FCM and in-app Notification object
  normalize(raw: any): NotificationPayload {
    if (!raw) return { type: 'general' };
    
    // In-app Notification object
    if (typeof raw === 'object' && 'id' in raw && 'type' in raw) {
      return {
        id: raw.id,
        type: raw.type,
        productId: raw.productId,
        orderId: raw.orderId,
      };
    }
    
    // FCM Raw data
    return {
      id: typeof raw.id === 'string' ? raw.id : undefined,
      type: typeof raw.type === 'string' ? raw.type : 'general',
      productId: typeof raw.productId === 'string' ? raw.productId : undefined,
      orderId: typeof raw.orderId === 'string' ? raw.orderId : undefined,
    };
  },

  // Resolve the destination route based on normalized payload and user role
  resolveRoute(payload: NotificationPayload, userRole?: string): string {
    if (userRole === 'MITRA') {
      switch (payload.type) {
        case 'dashboard_update':
          return '/(mitra)';
        default:
          return '/(mitra)'; // Mitra default route
      }
    }

    switch (payload.type) {
      case 'stock_alert':
        return payload.productId ? `/(food-saver)/product/${payload.productId}` : '/(food-saver)';
      case 'order_status':
        return payload.orderId ? `/(food-saver)/order/${payload.orderId}` : '/(food-saver)';
      case 'general':
      default:
        return '/(food-saver)/notifications';
    }
  },

  // Resolve the query keys to invalidate
  resolveInvalidationKeys(payload: NotificationPayload, userRole?: string): any[][] {
    const keys: any[][] = [['notifications']]; // Always invalidate notifications list

    if (userRole === 'MITRA') {
      switch (payload.type) {
        case 'dashboard_update':
          keys.push(['mitra-stats']);
          keys.push(['mitra-orders']);
          break;
      }
    } else {
      switch (payload.type) {
        case 'order_status':
          keys.push(['orders']);
          if (payload.orderId) {
            keys.push(['order', payload.orderId]);
          }
          break;
        case 'stock_alert':
          keys.push(['products']);
          break;
      }
    }

    return keys;
  },

  // High-level handler to coordinate invalidation, marking as read, and navigating
  async handleTap(
    rawPayload: any,
    options: {
      queryClient: QueryClient;
      userRole?: string;
      markAsReadFn?: (id: string) => Promise<any>;
    }
  ) {
    const payload = this.normalize(rawPayload);
    
    // 1. Invalidate queries
    const keys = this.resolveInvalidationKeys(payload, options.userRole);
    keys.forEach((key) => {
      options.queryClient.invalidateQueries({ queryKey: key });
    });

    // 2. Mark as read
    if (payload.id) {
      try {
        if (options.markAsReadFn) {
          await options.markAsReadFn(payload.id);
        } else {
          await markNotificationRead(payload.id);
        }
        options.queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (error) {
        // Silent fail
      }
    }

    // 3. Navigate
    const targetRoute = this.resolveRoute(payload, options.userRole);
    router.push(targetRoute as any);
  }
};
