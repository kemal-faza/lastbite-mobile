import { getStatusLabel, getStatusVariant, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS } from '@/lib/orderStatus';

describe('orderStatus utility', () => {
  describe('ORDER_STATUS_LABELS', () => {
    it('has all 5 status labels', () => {
      expect(ORDER_STATUS_LABELS.PENDING).toBe('Menunggu');
      expect(ORDER_STATUS_LABELS.PROCESSED).toBe('Diproses');
      expect(ORDER_STATUS_LABELS.READY).toBe('Siap Diambil');
      expect(ORDER_STATUS_LABELS.PICKED_UP).toBe('Selesai');
      expect(ORDER_STATUS_LABELS.CANCELLED).toBe('Dibatalkan');
    });
  });

  describe('ORDER_STATUS_VARIANTS', () => {
    it('has all 5 status variants with bg and text classes', () => {
      expect(ORDER_STATUS_VARIANTS.PENDING).toEqual({ bg: 'bg-yellow-100', text: 'text-yellow-800' });
      expect(ORDER_STATUS_VARIANTS.PROCESSED).toEqual({ bg: 'bg-blue-100', text: 'text-blue-800' });
      expect(ORDER_STATUS_VARIANTS.READY).toEqual({ bg: 'bg-amber-100', text: 'text-amber-800' });
      expect(ORDER_STATUS_VARIANTS.PICKED_UP).toEqual({ bg: 'bg-green-100', text: 'text-green-800' });
      expect(ORDER_STATUS_VARIANTS.CANCELLED).toEqual({ bg: 'bg-red-100', text: 'text-red-700' });
    });
  });

  describe('getStatusLabel', () => {
    it('returns label for known statuses', () => {
      expect(getStatusLabel('PENDING')).toBe('Menunggu');
      expect(getStatusLabel('CANCELLED')).toBe('Dibatalkan');
    });

    it('falls back to raw status for unknown values', () => {
      expect(getStatusLabel('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('getStatusVariant', () => {
    it('returns variant for known statuses', () => {
      expect(getStatusVariant('PICKED_UP').bg).toBe('bg-green-100');
    });

    it('falls back to gray for unknown values', () => {
      const v = getStatusVariant('UNKNOWN');
      expect(v.bg).toBe('bg-gray-100');
      expect(v.text).toBe('text-gray-700');
    });
  });
});
