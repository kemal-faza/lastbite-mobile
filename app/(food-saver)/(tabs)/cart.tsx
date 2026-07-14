import { View, Text, ScrollView, Pressable, TouchableOpacity, Alert } from 'react-native';
import { useRef, useCallback } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
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
// --- Cart item row with swipe-to-delete ---
function CartItemRow({
  item,
  updateItem,
  removeItem,
}: {
  item: CartItem;
  updateItem: any;
  removeItem: any;
}) {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = useCallback(() => {
    swipeableRef.current?.close();
    Alert.alert('Hapus Item', `Hapus "${item.name}" dari keranjang?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => removeItem.mutate(item.productId),
      },
    ]);
  }, [item.name, item.productId, removeItem]);

  return (
    <View className="mb-2 rounded-xl overflow-hidden">
      <Swipeable
        ref={swipeableRef}
        overshootRight={false}
        renderRightActions={() => (
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleDelete}
              accessibilityLabel="Hapus item"
              accessibilityRole="button"
              className="bg-red-500 justify-center items-center w-16 self-stretch"
            >
              <MaterialCommunityIcons name="trash-can-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        )}
      >
        <View className="bg-white p-3 flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <View className="mr-3">
              <Image
                source={
                  getImageVariants(item.imageVariants)?.thumb
                    ? { uri: getImageVariants(item.imageVariants)!.thumb }
                    : require('@/assets/placeholder.png')
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
          <View className="flex-row items-center">
            <Pressable
              onPress={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity - 1 })}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              <Text>-</Text>
            </Pressable>
            <Text className="mx-3">{item.quantity}</Text>
            <Pressable
              onPress={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              <Text>+</Text>
            </Pressable>
          </View>
        </View>
      </Swipeable>
    </View>
  );
}

export default function CartScreen() {
  const { isAuthenticated } = useAuthStore();
  const { cart, updateItem, removeItem } = useCart(isAuthenticated);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background">
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

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-1 p-4">
          <Text className="text-xl font-bold text-primary mb-4">Keranjang</Text>
          <View className="flex-1 items-center justify-center">
            <EmptyState
              icon="cart-off"
              title="Keranjang Kosong"
              description="Cari makanan surplus favoritmu dan tambahkan ke keranjang"
              action={<PrimaryButton onPress={() => router.push('/search')}>Cari Makanan</PrimaryButton>}
            />
          </View>
        </View>
      </View>
    );
  }

  // Group items by store
  const storeGroups = items.reduce((groups, item) => {
    const store = item.storeName;
    if (!groups[store]) groups[store] = [];
    groups[store].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);

  const storeNames = Object.keys(storeGroups);

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-xl font-bold text-primary mb-4">Keranjang</Text>

        {storeNames.map((storeName) => {
          const storeItems = storeGroups[storeName];
          const storeTotal = storeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

          return (
            <View key={storeName} className="mb-6">
              {/* Store Header */}
              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons name="store-outline" size={20} color="#374151" />
                <Text className="text-lg font-bold text-gray-800 ml-2">{storeName}</Text>
              </View>

              {/* Store Items with swipe-to-delete */}
              {storeItems.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  updateItem={updateItem}
                  removeItem={removeItem}
                />
              ))}

              {/* Store subtotal & checkout */}
              <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <Text className="text-base font-semibold">Subtotal: Rp{storeTotal.toLocaleString()}</Text>
                <Button
                  testID={`checkout-${storeName.replace(/\s+/g, '-')}`}
                  variant="default"
                  onPress={() => router.push(`/checkout?storeName=${encodeURIComponent(storeName)}`)}
                >
                  <Text className="text-white font-semibold">Checkout</Text>
                </Button>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
