import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { fetchRevenueSummary } from '@/lib/api/analytics';
import DashboardStatsCard from '@/components/DashboardStatsCard';
import { Header } from '@/components/Header';

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['mitra-analytics'],
    queryFn: () => fetchRevenueSummary({ from: '2026-01-01', to: '2026-12-31' }),
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>Loading...</Text>
      </View>
    );
  }

  const summary = data?.summary;

  return (
    <View className="flex-1 bg-background">
      <Header title="Analisis Penjualan" showBack={false} />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <View className="p-4">
          <View className="flex-row flex-wrap -mx-1 mb-6">
            <DashboardStatsCard
              title="Total Pendapatan"
              value={
                summary?.totalRevenue
                  ? `Rp ${summary.totalRevenue.toLocaleString('id-ID')}`
                  : 'Rp 0'
              }
            />
            <DashboardStatsCard
              title="Makanan Diselamatkan"
              value={summary?.totalSavings ?? '-'}
            />
          </View>

          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
            <Text className="font-bold mb-2">Performa Penjualan</Text>
            <Text className="text-gray-500">
              Statistik performa penjualan akan ditampilkan di sini.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
