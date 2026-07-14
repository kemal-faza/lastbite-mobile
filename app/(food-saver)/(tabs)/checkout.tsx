import { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { router, Redirect, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/lib/api/orders';
import { useAuthStore } from '@/stores/authStore';
import { PaymentSummary } from '@/components/PaymentSummary';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useToast } from '@/contexts/ToastContext';
import type { CartItem } from '@/lib/api/cart';

const NOTES_MAX = 500;

export default function CheckoutScreen() {
  const { isAuthenticated, user } = useAuthStore();
  const { cart } = useCart(isAuthenticated);
  const { storeName } = useLocalSearchParams<{ storeName?: string }>();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isAuthenticated) return <Redirect href="/login" />;

  const allItems: CartItem[] = cart.data?.cart.items || [];
  const items = storeName
    ? allItems.filter((item) => item.storeName === storeName)
    : allItems;

  const handleCheckout = async () => {
    if (items.length === 0 || !user?.name || !user?.phone) return;
    setLoading(true);
    try {
      const res = await createOrder(user.name, user.phone, notes || undefined, storeName);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showToast('Pesanan berhasil dibuat!');
      router.replace(`/order/confirm/${res.order.id}`);
    } catch (e: any) {
      alert(e.message || 'Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-xl font-bold text-primary mb-4">
          {storeName ? `Checkout - ${storeName}` : 'Checkout'}
        </Text>

        {/* Section 1: Ringkasan Pesanan */}
        <Text className="text-base font-semibold mb-3">Ringkasan Pesanan</Text>
        {items.map((item) => (
          <View key={item.id} className="bg-white p-3 rounded-xl mb-2 flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="font-bold">{item.name}</Text>
              <Text className="text-gray-500 text-sm">{item.storeName}</Text>
            </View>
            <View className="items-end">
              <Text className="font-semibold">Rp{item.price.toLocaleString('id-ID')}</Text>
              <Text className="text-gray-500 text-sm">x{item.quantity}</Text>
            </View>
          </View>
        ))}

        <View className="h-4" />

        {/* Section 2: Info Pembeli */}
        <Text className="text-base font-semibold mb-3">Info Pembeli</Text>
        <View className="bg-white p-4 rounded-xl mb-2">
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="account" size={18} color={colors.textSecondary} />
            <Text className="text-gray-600 ml-2 mr-1">Nama:</Text>
            <Text className="font-medium">{user?.name || 'Belum diatur'}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="phone" size={18} color={colors.textSecondary} />
            <Text className="text-gray-600 ml-2 mr-1">Telepon:</Text>
            <Text className="font-medium">{user?.phone || 'Belum diatur'}</Text>
          </View>
        </View>

        <View className="h-4" />

        {/* Section 3: Catatan */}
        <Text className="text-base font-semibold mb-3">Catatan untuk Mitra (opsional)</Text>
        <View className="bg-white rounded-xl p-3">
          <TextInput
            testID="notes-input"
            className="border border-gray-200 rounded-lg p-3 min-h-[80px] text-base"
            value={notes}
            onChangeText={(text) => {
              if (text.length <= NOTES_MAX) setNotes(text);
            }}
            placeholder="Contoh: Tanpa sambal, pisah bungkus..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={NOTES_MAX}
            textAlignVertical="top"
          />
          <Text className="text-xs text-gray-400 text-right mt-1">{notes.length}/{NOTES_MAX}</Text>
        </View>

        <View className="h-4" />

        {/* Section 4: Ringkasan Pembayaran */}
        <PaymentSummary items={items} />

        <View className="h-4" />

        {/* Info COD */}
        <View className="bg-secondary/10 p-3 rounded-lg mb-4">
          <Text className="text-sm text-gray-600">
            Pembayaran dilakukan saat mengambil pesanan (COD). Platform tidak memproses pembayaran.
          </Text>
        </View>

        {/* Section 5: Konfirmasi */}
        <Button
          testID="confirm-button"
          variant="default"
          onPress={handleCheckout}
          disabled={loading || items.length === 0}
          className="mt-2"
        >
          {loading ? (
            <Text className="text-white">Memproses...</Text>
          ) : (
            <Text className="text-white font-semibold">Konfirmasi Pesanan</Text>
          )}
        </Button>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
