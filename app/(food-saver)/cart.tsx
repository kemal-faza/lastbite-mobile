import { View, Text, FlatList, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Button } from '@/components/ui/button';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/authStore';
import type { CartItem } from '@/lib/api/cart';
import { EmptyState } from '@/components/EmptyState';
import { getImageVariants } from '@/lib/api/products';
import { TopBar } from '@/components/TopBar';

export default function CartScreen() {
  const { isAuthenticated } = useAuthStore();
  const { cart, updateItem, removeItem } = useCart(isAuthenticated);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background">
        <TopBar />
        <View className="flex-1 justify-center">
          <EmptyState
            icon="cart-outline"
            title="Login untuk mengakses keranjang"
            description="Masuk atau daftar untuk mulai berbelanja"
            action={<PrimaryButton onPress={() => router.push('/login')}>Masuk</PrimaryButton>}
          />
        </View>
      </View>
    );
  }
  const items: CartItem[] = cart.data?.cart.items || [];
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <TopBar />
        <View className="p-4">
          <Text className="text-xl font-bold text-primary mb-4">Keranjang</Text>
          <EmptyState
            icon="cart-off"
            title="Keranjang Kosong"
            description="Cari makanan surplus favoritmu dan tambahkan ke keranjang"
            action={<PrimaryButton onPress={() => router.push('/search')}>Cari Makanan</PrimaryButton>}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TopBar />
      <View className="flex-1 p-4">
        <Text className="text-xl font-bold text-primary mb-4">Keranjang</Text>
        <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-3 rounded-xl mb-2 flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <View className="mr-3">
                <Image
                  source={
                    getImageVariants(item.imageVariants)?.thumb
                      ? { uri: getImageVariants(item.imageVariants)!.thumb }
                      : require('../../assets/placeholder.png')
                  }
                  contentFit="cover"
                  style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: '#e5e7eb' }}
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold">{item.name}</Text>
                <Text className="text-gray-500">{item.storeName}</Text>
                <Text>Rp{item.price.toLocaleString()} x {item.quantity}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center">
                <Pressable onPress={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity - 1 })} className="px-3 py-1 bg-gray-200 rounded">
                  <Text>-</Text>
                </Pressable>
                <Text className="mx-3">{item.quantity}</Text>
                <Pressable onPress={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity + 1 })} className="px-3 py-1 bg-gray-200 rounded">
                  <Text>+</Text>
                </Pressable>
              </View>
              <Pressable
                testID="delete-item"
                onPress={() => removeItem.mutate(item.productId)}
                className="ml-2 p-2 bg-red-50 rounded-lg"
              >
                <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
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
    </View>
  );
}
