import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMitraOrders, useUpdateOrderStatus } from '@/hooks/useMitra';
import { Button } from '@/components/ui/button';
import type { MitraOrder, MitraOrderItem } from '@/lib/api/mitra';

const STATUS_BADGE_COLORS: Record<
  MitraOrder['status'],
  { bg: string; text: string }
> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  PROCESSED: { bg: 'bg-blue-100', text: 'text-blue-800' },
  READY: { bg: 'bg-green-100', text: 'text-green-800' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800' },
  PICKED_UP: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

const STATUS_LABELS: Record<MitraOrder['status'], string> = {
  PENDING: 'Menunggu Diproses',
  PROCESSED: 'Sedang Diproses',
  READY: 'Siap Diambil',
  PICKED_UP: 'Sudah Diambil',
  CANCELLED: 'Dibatalkan',
};

function formatPrice(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}

export default function MitraOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Array.isArray(id) ? id[0] : id;

  const { data, isPending } = useMitraOrders();
  const { mutate, isPending: isMutating } = useUpdateOrderStatus();

  const orders: MitraOrder[] = data?.orders ?? [];
  const order = orders.find((o) => o.id === orderId);

  if (isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!order || !orderId) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <Text className="text-gray-500 text-lg">Pesanan tidak ditemukan</Text>
      </View>
    );
  }

  const badgeColor =
    STATUS_BADGE_COLORS[order.status] ?? STATUS_BADGE_COLORS.PENDING;

  const showActionButton =
    order.status === 'PENDING' || order.status === 'PROCESSED';
  const actionLabel =
    order.status === 'PENDING' ? 'Proses Pesanan' : 'Siap Diambil';
  const nextStatus: 'PROCESSED' | 'READY' =
    order.status === 'PENDING' ? 'PROCESSED' : 'READY';

  const handleAction = () => {
    if (isMutating) return;
    mutate(
      { id: order.id, status: nextStatus },
      {
        onError: (error: Error) => {
          Alert.alert(
            'Gagal',
            error?.message || 'Gagal memperbarui status pesanan'
          );
        },
      }
    );
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ title: `Detail ${order.id}` }} />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Status & Pickup section */}
        <View className="bg-white rounded-xl p-6 mb-4 items-center border border-gray-100">
          <Text className="text-sm text-gray-500 mb-1">Kode Pickup</Text>
          <Text
            className="text-3xl font-bold text-gray-900 tracking-wider mb-3"
            selectable
          >
            {order.pickupCode}
          </Text>
          <View className={`${badgeColor.bg} px-3 py-1 rounded-full`}>
            <Text className={`${badgeColor.text} text-sm font-medium`}>
              {STATUS_LABELS[order.status]}
            </Text>
          </View>
        </View>

        {/* Buyer Info section */}
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
          <Text className="font-bold text-gray-900 text-base mb-3">
            Pembeli
          </Text>
          <Text className="text-gray-900 mb-1" selectable>
            {order.buyerName}
          </Text>
          <Text className="text-gray-500 mb-1" selectable>
            {order.buyerPhone}
          </Text>
          {order.notes ? (
            <View className="mt-2 p-3 bg-gray-50 rounded-lg">
              <Text className="text-sm text-gray-500 mb-1">Catatan:</Text>
              <Text className="text-gray-900" selectable>
                {order.notes}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Items section */}
        <View className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
          <Text className="font-bold text-gray-900 text-base mb-3">
            Produk
          </Text>
          {order.items.map((item: MitraOrderItem) => (
            <View
              key={item.id}
              className="flex-row justify-between items-center py-2 border-b border-gray-100"
            >
              <Text className="text-gray-900 flex-1">
                {item.quantity}x {item.name}
              </Text>
              <Text className="text-gray-900 font-medium">
                {formatPrice(item.price)}
              </Text>
            </View>
          ))}
          {/* Total */}
          <View className="flex-row justify-between items-center pt-3 mt-1">
            <Text className="font-bold text-gray-900 text-base">Total</Text>
            <Text className="font-bold text-gray-900 text-base">
              {formatPrice(order.totalAmount)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom action button */}
      {showActionButton && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
          <Button
            onPress={handleAction}
            disabled={isMutating}
            className="w-full"
          >
            <Text className="text-white font-semibold text-center">
              {isMutating ? 'Memproses...' : actionLabel}
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
}
