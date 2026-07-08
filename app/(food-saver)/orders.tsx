import { View, Text, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/authStore';
import { EmptyState } from '@/components/EmptyState';
import { getImageVariants } from '@/lib/api/products';

export default function OrdersScreen() {
  const { isAuthenticated } = useAuthStore();
  const { data } = useOrders(isAuthenticated);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background p-4">
        <EmptyState
          icon="clipboard-list-outline"
          title="Login untuk melihat pesanan"
          description="Riwayat pesanan akan muncul di sini"
          action={<PrimaryButton onPress={() => router.push('/login')}>Masuk</PrimaryButton>}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-bold text-primary mb-4">Pesanan Saya</Text>
      <FlatList
        data={data?.orders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            icon="package-variant-closed"
            title="Belum ada pesanan"
            description="Pesananmu akan muncul setelah kamu checkout"
          />
        }
        renderItem={({ item }) => {
          const firstItem = item.items?.[0];
          return (
            <View className="bg-white p-3 rounded-xl mb-2 flex-row items-center">
              {firstItem && (
                <Image
                  source={
                    getImageVariants(firstItem.imageVariants)?.thumb
                      ? { uri: getImageVariants(firstItem.imageVariants)!.thumb }
                      : require('../../assets/placeholder.png')
                  }
                  style={{ width: 64, height: 64, borderRadius: 8 }}
                  contentFit="cover"
                  className="mr-3 bg-gray-200"
                />
              )}
              <View className="flex-1">
                <Text className="font-bold">{item.storeName}</Text>
                <Text>Total: Rp{item.total.toLocaleString()}</Text>
                <Text className="text-primary">{item.status}</Text>
                <Text className="text-gray-400 text-xs">{item.pickupCode}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
