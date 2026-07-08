import { View, Text, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function CartScreen() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <MaterialCommunityIcons name="cart-outline" size={64} color={colors.textSecondary} />
        <Text className="text-lg font-semibold mt-4 text-center">Login untuk mengakses keranjang</Text>
        <Text className="text-sm text-gray-500 mt-1 text-center">Masuk atau daftar untuk mulai berbelanja</Text>
        <PrimaryButton onPress={() => router.push('/login')}>Masuk</PrimaryButton>
      </View>
    );
  }

  const { cart, updateItem } = useCart();
  const items = cart.data?.cart.items || [];
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-bold text-primary mb-4">Keranjang</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-3 rounded-xl mb-2 flex-row justify-between items-center">
            <View>
              <Text className="font-bold">{item.name}</Text>
              <Text className="text-gray-500">{item.storeName}</Text>
              <Text>Rp{item.price.toLocaleString()} x {item.quantity}</Text>
            </View>
            <View className="flex-row items-center">
              <Pressable onPress={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity - 1 })} className="px-3 py-1 bg-gray-200 rounded">
                <Text>-</Text>
              </Pressable>
              <Text className="mx-3">{item.quantity}</Text>
              <Pressable onPress={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity + 1 })} className="px-3 py-1 bg-gray-200 rounded">
                <Text>+</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <View className="border-t border-gray-300 pt-4 mt-4">
        <Text className="text-lg font-bold">Total: Rp{total.toLocaleString()}</Text>
        <Button variant="default" onPress={() => router.push('/checkout')} disabled={items.length === 0} className="mt-2">
          <Text className="text-white font-semibold">Checkout</Text>
        </Button>
      </View>
    </View>
  );
}
