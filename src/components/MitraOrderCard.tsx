import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useUpdateOrderStatus } from '@/hooks/useMitra';
import type { MitraOrder } from '@/lib/api/mitra';

type Props = {
  order: MitraOrder;
  onPress: () => void;
};

const STATUS_BADGE_COLORS: Record<MitraOrder['status'], { bg: string; text: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  PROCESSED: { bg: 'bg-blue-100', text: 'text-blue-800' },
  READY: { bg: 'bg-green-100', text: 'text-green-800' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800' },
  PICKED_UP: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

export function MitraOrderCard({ order, onPress }: Props) {
  const { mutate, isPending } = useUpdateOrderStatus();

  const badgeColor = STATUS_BADGE_COLORS[order.status] ?? STATUS_BADGE_COLORS.PENDING;

  const showActionButton = order.status === 'PENDING' || order.status === 'PROCESSED';
  const actionLabel = order.status === 'PENDING' ? 'Proses Pesanan' : 'Siap Diambil';
  const nextStatus = order.status === 'PENDING' ? 'PROCESSED' : 'READY';

  const handleAction = () => {
    if (isPending) return;
    mutate(
      { id: order.id, status: nextStatus as 'PROCESSED' | 'READY' },
      {
        onError: (error: Error) => {
          Alert.alert('Gagal', error?.message || 'Gagal memperbarui status pesanan');
        },
      }
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
    >
      {/* Header row: Order ID + Status badge */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-bold text-gray-900">{order.id}</Text>
        <View className={`${badgeColor.bg} px-2 py-1 rounded-full`}>
          <Text className={`${badgeColor.text} text-xs font-medium`}>{order.status}</Text>
        </View>
      </View>

      {/* Body: Buyer name + Item count */}
      <View className="mb-3">
        <Text className="text-lg font-bold text-gray-900">{order.buyerName}</Text>
        <Text className="text-gray-500 text-sm">{order.items.length} Produk</Text>
      </View>

      {/* Footer: Total price */}
      <Text className="text-base font-semibold text-gray-900">
        Rp{order.totalAmount.toLocaleString('id-ID')}
      </Text>

      {/* Action button */}
      {showActionButton && (
        <TouchableOpacity
          onPress={handleAction}
          disabled={isPending}
          className="mt-3 bg-primary px-4 py-2 rounded-lg items-center"
        >
          <Text className="text-white font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
