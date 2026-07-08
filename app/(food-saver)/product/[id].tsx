import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/hooks/useProducts';
import { MapPreview } from '@/components/MapPreview';
import { addToCart } from '@/lib/api/cart';
import { useAuthStore } from '@/stores/authStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useProduct(id);
  const { isAuthenticated } = useAuthStore();
  const product = data?.product;

  if (!product) return <Text>Loading...</Text>;

  return (
    <ScrollView className="flex-1 bg-background">
      <Image source={{ uri: product.imageUrl || undefined }} className="w-full h-64 bg-gray-200" />
      <View className="p-4">
        <Text className="text-2xl font-bold">{product.name}</Text>
        <Text className="text-gray-500">{product.storeName}</Text>
        <Text className="text-primary text-xl font-bold mt-2">Rp{product.discountedPrice.toLocaleString()}</Text>
        <Text className="text-gray-400 line-through">Rp{product.originalPrice.toLocaleString()}</Text>
        <Text className="mt-4">{product.description}</Text>
        {product.storeLat && product.storeLng && (
          <MapPreview lat={product.storeLat} lng={product.storeLng} storeName={product.storeName} />
        )}
        <Button
          variant="default"
          onPress={() => {
            if (!isAuthenticated) { router.push('/login'); return; }
            addToCart(product.id);
          }}
          className="mt-6"
        >
          <Text className="text-white font-semibold">Tambah ke Keranjang</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
