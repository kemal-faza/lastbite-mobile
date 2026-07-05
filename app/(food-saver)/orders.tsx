import { View, Text, FlatList } from 'react-native';
import { useOrders } from '@/hooks/useOrders';

export default function OrdersScreen() {
  const { data } = useOrders();

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-bold text-primary mb-4">Pesanan Saya</Text>
      <FlatList
        data={data?.orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-3 rounded-xl mb-2">
            <Text className="font-bold">{item.storeName}</Text>
            <Text>Total: Rp{item.total.toLocaleString()}</Text>
            <Text className="text-primary">{item.status}</Text>
            <Text className="text-gray-400 text-xs">{item.pickupCode}</Text>
          </View>
        )}
      />
    </View>
  );
}
