import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { getImageVariants, type Product } from '@/lib/api/products';

export function ProductCard({ product }: { product: Product }) {
  const variants = getImageVariants(product.imageVariants);
  const imageSource = variants?.card
    ? { uri: variants.card }
    : require('../../assets/placeholder.png');

  return (
    <Pressable onPress={() => router.push(`/product/${product.id}`)} className="bg-white rounded-xl p-3 shadow-sm mb-3">
      <Image source={imageSource} contentFit="cover" transition={300} className="w-full h-32 rounded-lg bg-gray-200" />
      <Text className="font-bold mt-2">{product.name}</Text>
      <Text className="text-gray-500 text-sm">{product.storeName}</Text>
      <View className="flex-row items-center mt-1">
        <Text className="text-primary font-bold">Rp{product.discountedPrice.toLocaleString()}</Text>
        <Text className="text-gray-400 line-through ml-2 text-xs">Rp{product.originalPrice.toLocaleString()}</Text>
      </View>
    </Pressable>
  );
}
