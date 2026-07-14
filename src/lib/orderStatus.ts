/**
 * Shared order status labels and badge styles for Food Saver screens.
 * All 5 statuses from backend: PENDING, PROCESSED, READY, PICKED_UP, CANCELLED
 */

export interface StatusVariant {
  bg: string;
  text: string;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Menunggu',
  PROCESSED: 'Diproses',
  READY: 'Siap Diambil',
  PICKED_UP: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

export const ORDER_STATUS_VARIANTS: Record<string, StatusVariant> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  PROCESSED: { bg: 'bg-blue-100', text: 'text-blue-800' },
  READY: { bg: 'bg-amber-100', text: 'text-amber-800' },
  PICKED_UP: { bg: 'bg-green-100', text: 'text-green-800' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-700' },
};

export function getStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function getStatusVariant(status: string): StatusVariant {
  return ORDER_STATUS_VARIANTS[status] ?? { bg: 'bg-gray-100', text: 'text-gray-700' };
}
