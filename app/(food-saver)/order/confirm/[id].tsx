import { useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Button, Dialog, Portal } from 'react-native-paper';
import { useOrder } from '@/hooks/useOrders';
import { verifyPickup } from '@/lib/api/orders';

export default function OrderConfirmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, refetch } = useOrder(id);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const order = data?.order;

  if (!order) return <Text>Loading...</Text>;

  const handlePickup = async () => {
    setDialogVisible(false);
    await verifyPickup(id, order.pickupCode);
    setSuccess(true);
    refetch();
  };

  if (success) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-6xl text-primary">V</Text>
        <Text className="text-xl font-bold mt-4">Pesanan Berhasil Diambil!</Text>
        <Button onPress={() => router.replace('/orders')} className="mt-6">Lihat Pesanan</Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4 justify-center">
      <Text className="text-center text-gray-500 mb-2">Kode Pickup</Text>
      <Text className="text-center text-3xl font-bold tracking-widest mb-6">{order.pickupCode}</Text>
      <Text className="text-center mb-8">Tunjukkan kode ini ke Mitra saat mengambil.</Text>
      <Button mode="contained" onPress={() => setDialogVisible(true)}>
        Pesanan Diambil
      </Button>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Konfirmasi</Dialog.Title>
          <Dialog.Content>
            <Text>Yakin pesanan sudah diambil?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Batal</Button>
            <Button onPress={handlePickup}>Ya</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
