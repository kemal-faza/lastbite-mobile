import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/lib/api/orders';

export default function CheckoutScreen() {
  const { cart } = useCart();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const items = cart.data?.cart.items || [];
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await createOrder(notes);
      router.replace(`/order/confirm/${res.order.id}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-bold text-primary mb-4">Checkout</Text>
      <Text className="mb-2">Total: Rp{total.toLocaleString()}</Text>
      <View className="bg-secondary/10 p-3 rounded-lg mb-4">
        <Text className="text-sm">Pembayaran dilakukan saat mengambil pesanan (COD). Platform tidak memproses pembayaran.</Text>
      </View>
      <TextInput label="Catatan untuk Mitra (opsional)" value={notes} onChangeText={setNotes} multiline className="mb-4" />
      <Button mode="contained" onPress={handleCheckout} loading={loading}>
        Konfirmasi Pesanan
      </Button>
    </View>
  );
}
