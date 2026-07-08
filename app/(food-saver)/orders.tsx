import { View, Text, FlatList } from 'react-native';
import { router } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function OrdersScreen() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <MaterialCommunityIcons name="clipboard-list-outline" size={64} color={colors.textSecondary} />
        <Text className="text-lg font-semibold mt-4 text-center">Login untuk melihat pesanan</Text>
        <Text className="text-sm text-gray-500 mt-1 text-center">Riwayat pesanan akan muncul di sini</Text>
        <PrimaryButton onPress={() => router.push('/login')}>Masuk</PrimaryButton>
      </View>
    );
  }

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
