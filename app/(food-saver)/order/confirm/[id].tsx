import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrder } from '@/hooks/useOrders';
import { CountdownTimer } from '@/components/CountdownTimer';
import { QueueIndicator } from '@/components/QueueIndicator';
import { colors } from '@/theme';

export default function OrderConfirmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: orderData, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-gray-500 mt-2">Memuat pesanan...</Text>
      </View>
    );
  }

  if (isError || !orderData?.order) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.destructive} />
        <Text className="text-red-500 text-center mt-2">Gagal memuat pesanan</Text>
      </View>
    );
  }

  const order = orderData.order;
  const pickupExpiresAt = order.pickupExpiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString();

  return (
    <ScrollView className="flex-1 bg-background">
        <View className="bg-primary p-6 items-center">
          <MaterialCommunityIcons name="check-circle" size={64} color="white" />
          <Text className="text-white text-lg font-bold mt-2">Pesanan Berhasil!</Text>
          <Text className="text-white/80 text-sm">Tunjukkan kode ini ke mitra</Text>
        </View>

        <View className="bg-white mx-4 -mt-4 rounded-xl p-6 items-center border border-gray-100 shadow-md">
          <Text className="text-sm text-gray-500 mb-1">Kode Pickup</Text>
          <Text className="text-2xl font-bold tracking-widest text-primary">
            {order.pickupCode || 'LAST-XXXX'}
          </Text>
        </View>

        <View className="mx-4 mt-4 bg-destructive/5 rounded-xl p-4 items-center">
          <Text className="text-sm text-destructive mb-2">Waktu Tersisa</Text>
          <CountdownTimer expiresAt={pickupExpiresAt} />
        </View>

        <View className="mx-4 mt-4">
          <Text className="text-lg font-bold mb-3">Detail Pesanan</Text>
          <View className="bg-white rounded-xl p-4 border border-gray-100">
            {order.items?.map((item: any) => (
              <View key={item.id} className="flex-row justify-between py-2 border-b border-gray-50">
                <Text className="text-sm text-gray-700 flex-1">{item.name} x{item.quantity}</Text>
                <Text className="text-sm font-medium">Rp{(item.price * item.quantity).toLocaleString()}</Text>
              </View>
            ))}
            <View className="flex-row justify-between pt-3 mt-1 border-t border-gray-200">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold text-primary">Rp{(order.total || 0).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View className="mx-4 mt-4">
          <QueueIndicator queueCount={3} position={0} label="Antrian Pengambilan" />
        </View>

        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={() => alert('Pesanan berhasil diambil!')}
            className="bg-primary py-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Saya Sudah Mengambil Pesanan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
}
