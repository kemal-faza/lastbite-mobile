import type { MitraOrder } from './mitra';

const now = new Date();
const later = (minutes: number) => new Date(now.getTime() + minutes * 60000).toISOString();
const earlier = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString();

export const mockOrders: MitraOrder[] = [
  {
    id: 'ORD-a1b2c3d4',
    pickupCode: 'LAST-1284',
    status: 'PENDING',
    totalAmount: 35000,
    buyerName: 'Siti Rahmawati',
    buyerPhone: '081298765432',
    pickupExpiresAt: later(90),
    notes: 'Tolong nasi dan lauknya dipisah ya',
    items: [
      { id: 'item-1', name: 'Nasi Goreng Kampung', quantity: 2, price: 15000 },
      { id: 'item-2', name: 'Es Teh Manis', quantity: 1, price: 5000 },
    ],
  },
  {
    id: 'ORD-e5f6g7h8',
    pickupCode: 'LAST-9091',
    status: 'PENDING',
    totalAmount: 55000,
    buyerName: 'Ahmad Fauzi',
    buyerPhone: '085678901234',
    pickupExpiresAt: later(120),
    items: [
      { id: 'item-3', name: 'Ayam Bakar Madu', quantity: 1, price: 30000 },
      { id: 'item-4', name: 'Nasi Putih', quantity: 1, price: 5000 },
      { id: 'item-5', name: 'Es Jeruk', quantity: 2, price: 10000 },
    ],
  },
  {
    id: 'ORD-i9j0k1l2',
    pickupCode: 'LAST-3141',
    status: 'PROCESSED',
    totalAmount: 28000,
    buyerName: 'Dewi Sartika',
    buyerPhone: '087712345678',
    pickupExpiresAt: later(60),
    notes: 'Pakai bungkus biasa saja',
    items: [
      { id: 'item-6', name: 'Mie Goreng Special', quantity: 1, price: 18000 },
      { id: 'item-7', name: 'Pisang Goreng', quantity: 2, price: 5000 },
    ],
  },
  {
    id: 'ORD-m3n4o5p6',
    pickupCode: 'LAST-2718',
    status: 'READY',
    totalAmount: 42000,
    buyerName: 'Bambang Susilo',
    buyerPhone: '081334567890',
    pickupExpiresAt: later(45),
    items: [
      { id: 'item-8', name: 'Sate Ayam (10 tusuk)', quantity: 1, price: 25000 },
      { id: 'item-9', name: 'Lontong', quantity: 2, price: 6000 },
      { id: 'item-10', name: 'Kerupuk', quantity: 1, price: 5000 },
    ],
  },
  {
    id: 'ORD-q7r8s9t0',
    pickupCode: 'LAST-5555',
    status: 'PICKED_UP',
    totalAmount: 20000,
    buyerName: 'Ratna Kusuma',
    buyerPhone: '082145678901',
    pickupExpiresAt: earlier(30),
    items: [
      { id: 'item-11', name: 'Roti Coklat', quantity: 2, price: 6000 },
      { id: 'item-12', name: 'Kopi Susu', quantity: 1, price: 8000 },
    ],
  },
  {
    id: 'ORD-u1v2w3x4',
    pickupCode: 'LAST-9999',
    status: 'CANCELLED',
    totalAmount: 15000,
    buyerName: 'Hendra Gunawan',
    buyerPhone: '089912345678',
    pickupExpiresAt: earlier(120),
    notes: 'Dibatalkan otomatis oleh sistem - melewati batas waktu pengambilan',
    items: [
      { id: 'item-13', name: 'Bakso Malang', quantity: 1, price: 15000 },
    ],
  },
];

export function getMockMitraOrders() {
  return { orders: mockOrders };
}
