import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useMitraOrders } from '@/hooks/useMitra';
import { MitraOrderCard } from '@/components/MitraOrderCard';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { EmptyState } from '@/components/EmptyState';
import { router } from 'expo-router';
import type { MitraOrder } from '@/lib/api/mitra';

type Tab = 'aktif' | 'riwayat';

const ACTIVE_STATUSES: MitraOrder['status'][] = ['PENDING', 'PROCESSED', 'READY'];
const HISTORY_STATUSES: MitraOrder['status'][] = ['PICKED_UP', 'CANCELLED'];

const STATUS_SORT_ORDER: Record<MitraOrder['status'], number> = {
  PENDING: 0,
  PROCESSED: 1,
  READY: 2,
  PICKED_UP: 3,
  CANCELLED: 4,
};

export default function MitraOrdersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('aktif');
  const { data, refetch, isPending, isRefetching } = useMitraOrders();

  useRefreshOnFocus(refetch);

  const orders = data?.orders ?? [];

  const activeOrders = useMemo(
    () =>
      orders
        .filter((o: MitraOrder) => ACTIVE_STATUSES.includes(o.status))
        .sort(
          (a: MitraOrder, b: MitraOrder) =>
            STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]
        ),
    [orders]
  );

  const historyOrders = useMemo(
    () => orders.filter((o: MitraOrder) => HISTORY_STATUSES.includes(o.status)),
    [orders]
  );

  const displayedOrders = activeTab === 'aktif' ? activeOrders : historyOrders;
  const tabCounts = {
    aktif: activeOrders.length,
    riwayat: historyOrders.length,
  };

  if (isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Custom Top Tabs */}
      <View className="flex-row px-4 pt-4 pb-0">
        <TouchableOpacity
          className="mr-6 pb-3"
          onPress={() => setActiveTab('aktif')}
        >
          <Text
            className={`text-base ${
              activeTab === 'aktif' ? 'font-bold text-primary' : 'text-gray-500'
            }`}
          >
            Aktif ({tabCounts.aktif})
          </Text>
          {activeTab === 'aktif' && (
            <View className="h-0.5 bg-primary mt-1" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="pb-3"
          onPress={() => setActiveTab('riwayat')}
        >
          <Text
            className={`text-base ${
              activeTab === 'riwayat' ? 'font-bold text-primary' : 'text-gray-500'
            }`}
          >
            Riwayat ({tabCounts.riwayat})
          </Text>
          {activeTab === 'riwayat' && (
            <View className="h-0.5 bg-primary mt-1" />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedOrders}
        keyExtractor={(item: MitraOrder) => item.id}
        renderItem={({ item }: { item: MitraOrder }) => (
          <MitraOrderCard
            order={item}
            onPress={() => router.push(`/(mitra)/orders/${item.id}`)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        ListEmptyComponent={
          <EmptyState
            icon="package-variant-closed"
            title="Belum ada pesanan"
            description={
              activeTab === 'aktif'
                ? 'Tidak ada pesanan aktif saat ini'
                : 'Belum ada riwayat pesanan'
            }
          />
        }
      />
    </View>
  );
}
