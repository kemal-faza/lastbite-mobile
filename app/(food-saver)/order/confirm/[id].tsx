import { useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
        <Button variant="outline" onPress={() => router.replace('/orders')} className="mt-6">
          <Text className="font-medium">Lihat Pesanan</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4 justify-center">
      <Text className="text-center text-gray-500 mb-2">Kode Pickup</Text>
      <Text className="text-center text-3xl font-bold tracking-widest mb-6">{order.pickupCode}</Text>
      <Text className="text-center mb-8">Tunjukkan kode ini ke Mitra saat mengambil.</Text>
      <Button variant="default" onPress={() => setDialogVisible(true)}>
        <Text className="text-white font-semibold">Pesanan Diambil</Text>
      </Button>

      <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
            <DialogDescription>Yakin pesanan sudah diambil?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                <Text className="font-medium">Batal</Text>
              </Button>
            </DialogClose>
            <Button variant="default" onPress={handlePickup}>
              <Text className="text-white font-semibold">Ya</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
