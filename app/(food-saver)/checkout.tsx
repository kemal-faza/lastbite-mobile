import { useState } from 'react';
import { View } from 'react-native';
import { router, Redirect } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/lib/api/orders';
import { useAuthStore } from '@/stores/authStore';

export default function CheckoutScreen() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Redirect href="/login" />;

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
      <View className="flex-row mb-2">
        <Text className="text-base font-semibold">Total: </Text>
        <Text className="text-base">Rp{total.toLocaleString()}</Text>
      </View>
      <View className="bg-secondary/10 p-3 rounded-lg mb-4">
        <Text className="text-sm">Pembayaran dilakukan saat mengambil pesanan (COD). Platform tidak memproses pembayaran.</Text>
      </View>
      <View className="mb-3">
        <Text className="text-foreground text-sm font-medium mb-1.5">Catatan untuk Mitra (opsional)</Text>
        <Textarea value={notes} onChangeText={setNotes} />
      </View>
      <Button variant="default" onPress={handleCheckout} disabled={loading} className="mt-2">
        {loading ? <Text className="text-white">Memproses...</Text> : <Text className="text-white font-semibold">Konfirmasi Pesanan</Text>}
      </Button>
    </View>
  );
}
