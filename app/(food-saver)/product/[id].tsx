import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from 'react-native-paper';
import { useProduct } from '@/hooks/useProducts';
import { addToCart } from '@/lib/api/cart';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useProduct(id);
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
        <Button mode="contained" onPress={() => addToCart(product.id)} className="mt-6">
          Tambah ke Keranjang
        </Button>
      </View>
    </ScrollView>
  );
}
