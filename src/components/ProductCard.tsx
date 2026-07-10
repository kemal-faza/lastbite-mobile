import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { getImageVariants, type Product } from '@/lib/api/products';

export function ProductCard({ product, className = '' }: { product: Product; className?: string }) {
  const variants = getImageVariants(product.imageVariants);
  const imageSource = variants?.card
    ? { uri: variants.card }
    : require('../../assets/placeholder.png');

  return (
    <Pressable onPress={() => router.push(`/product/${product.id}`)} className={`bg-white rounded-xl p-2 shadow-sm ${className}`}>
      <View className="w-full aspect-square rounded-lg bg-gray-200 overflow-hidden">
        <Image source={imageSource} contentFit="cover" transition={300} style={{ width: '100%', height: '100%' }} />
      </View>
      <Text className="font-bold text-sm mt-2" numberOfLines={2}>{product.name}</Text>
      <Text className="text-gray-500 text-xs" numberOfLines={1}>{product.storeName}</Text>
      <Text className="text-destructive text-xs mt-0.5">Sisa {product.stock} porsi</Text>
      <View className="flex-row items-center mt-1 flex-wrap">
        <Text className="text-primary font-bold text-sm">Rp{product.discountedPrice.toLocaleString()}</Text>
        <Text className="text-gray-400 line-through ml-1 text-xs">Rp{product.originalPrice.toLocaleString()}</Text>
      </View>
    </Pressable>
  );
}
