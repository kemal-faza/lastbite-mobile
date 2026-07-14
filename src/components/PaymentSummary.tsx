import { View, Text } from 'react-native';
import type { CartItem } from '@/lib/api/cart';

interface PaymentSummaryProps {
  items: CartItem[];
}

function formatRupiah(n: number): string {
  return `Rp${n.toLocaleString('id-ID')}`;
}

export function PaymentSummary({ items }: PaymentSummaryProps) {
  const subtotal = items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = subtotal - total;

  return (
    <View className="bg-gray-50 rounded-xl p-4" testID="payment-summary">
      <Text className="text-base font-semibold mb-3">Ringkasan Pembayaran</Text>

      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Subtotal</Text>
        <Text className="text-gray-800">{formatRupiah(subtotal)}</Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Diskon</Text>
        <Text className="text-green-600">
          {discount > 0 ? `-${formatRupiah(discount)}` : formatRupiah(0)}
        </Text>
      </View>

      <View className="border-t border-gray-200 my-2" />

      <View className="flex-row justify-between">
        <Text className="text-base font-bold">Total</Text>
        <Text className="text-base font-bold text-primary">{formatRupiah(total)}</Text>
      </View>
    </View>
  );
}
