import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useMitraProfile, useMitraStats } from '@/hooks/useMitra';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import DashboardStatsCard from '@/components/DashboardStatsCard';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

export default function MitraDashboardScreen() {
  const { data: profileData, isLoading: profileLoading } = useMitraProfile();
  const { data: stats, refetch, isRefetching } = useMitraStats();

  useRefreshOnFocus(refetch);

  const profile = profileData?.profile;

  if (profileLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-background">
        <Text className="text-4xl mb-4">🏪</Text>
        <Text className="text-2xl font-bold mb-2">Buka Toko Anda</Text>
        <Text className="text-gray-500 text-center mb-6">
          Mulai jual makanan surplus dan kurangi food waste.
        </Text>
        <Button
          className="w-full"
          onPress={() => router.push('/(mitra)/register')}
        >
          <Text>Daftar Sekarang</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View className="p-4">
        <Text className="text-2xl font-bold text-primary mb-1">
          {profile.storeName || 'Toko'}
        </Text>
        <Text className="text-gray-500 mb-6">{profile.storeDescription}</Text>

        <View className="flex-row flex-wrap -mx-1 mb-3">
          <DashboardStatsCard
            title="Active Orders"
            value={stats?.activeOrders ?? '-'}
          />
          <DashboardStatsCard
            title="Products"
            value={stats?.productCount ?? '-'}
          />
        </View>
        <View className="flex-row flex-wrap -mx-1 mb-6">
          <DashboardStatsCard
            title="Total Sold"
            value={stats?.totalSold ?? '-'}
          />
          <DashboardStatsCard
            title="Revenue"
            value={
              stats?.revenue
                ? `Rp ${stats.revenue.toLocaleString('id-ID')}`
                : '-'
            }
          />
        </View>

        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <Text className="font-bold mb-4">Aksi Cepat</Text>
          <Button className="w-full mb-2" onPress={() => router.push('/(mitra)/products/add')}>
            <Text className="text-white font-semibold">Tambah Produk</Text>
          </Button>
          <Button variant="secondary" className="w-full">
            <Text className="text-foreground font-semibold">Lihat Pesanan</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
