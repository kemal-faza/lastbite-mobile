import { View, Text, FlatList } from 'react-native';
import { Button } from '@/components/ui/button';
import { useMitraOrders } from '@/hooks/useMitra';
import { apiFetch } from '@/lib/api/client';

export default function MitraOrdersScreen() {
  const { data, refetch } = useMitraOrders();

  const updateStatus = async (id: string, status: string) => {
    await apiFetch(`/mitra/orders/${id}/status`, {
      auth: true,
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    refetch();
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-bold text-primary mb-4">Pesanan Masuk</Text>
      <FlatList
        data={data?.orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-3 rounded-xl mb-2">
            <Text className="font-bold">{item.buyerName}</Text>
            <Text>Total: Rp{item.total.toLocaleString()}</Text>
            <Text className="text-primary mb-2">{item.status}</Text>
            {item.status === 'PENDING' && (
              <Button variant="outline" onPress={() => updateStatus(item.id, 'PROCESSED')}>
                <Text className="font-medium">Proses</Text>
              </Button>
            )}
            {item.status === 'PROCESSED' && (
              <Button variant="outline" onPress={() => updateStatus(item.id, 'READY')}>
                <Text className="font-medium">Siap Diambil</Text>
              </Button>
            )}
          </View>
        )}
      />
    </View>
  );
}
