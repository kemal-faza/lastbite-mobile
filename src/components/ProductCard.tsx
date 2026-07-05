import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import type { Product } from '@/lib/api/products';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Pressable onPress={() => router.push(`/product/${product.id}`)} className="bg-white rounded-xl p-3 shadow-sm mb-3">
      <Image source={{ uri: product.imageUrl || undefined }} className="w-full h-32 rounded-lg bg-gray-200" />
      <Text className="font-bold mt-2">{product.name}</Text>
      <Text className="text-gray-500 text-sm">{product.storeName}</Text>
      <View className="flex-row items-center mt-1">
        <Text className="text-primary font-bold">Rp{product.discountedPrice.toLocaleString()}</Text>
        <Text className="text-gray-400 line-through ml-2 text-xs">Rp{product.originalPrice.toLocaleString()}</Text>
      </View>
    </Pressable>
  );
}
