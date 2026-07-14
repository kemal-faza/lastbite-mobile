import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useProducts } from '@/hooks/useProducts';
import { getImageVariants, type Product } from '@/lib/api/products';

function RecommendationCard({ product }: { product: Product }) {
  const variants = getImageVariants(product.imageVariants);
  const imageSource = variants?.thumb
    ? { uri: variants.thumb }
    : require('../../assets/placeholder.png');

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      className="bg-white rounded-xl overflow-hidden mr-3 border border-gray-100"
      style={{ width: 140 }}
    >
      <View className="w-full h-24 bg-gray-200">
        <Image
          source={imageSource}
          contentFit="cover"
          transition={200}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View className="p-2">
        <Text className="font-semibold text-xs text-gray-900" numberOfLines={2}>
          {product.name}
        </Text>
        <Text className="text-gray-400 text-[10px] mt-0.5" numberOfLines={1}>
          {product.storeName}
        </Text>
        <Text className="text-primary text-xs font-bold mt-1">
          Rp{product.discountedPrice.toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}

interface ProductRecommendationProps {
  category: Product['category'];
  excludeId: string;
}

export function ProductRecommendation({ category, excludeId }: ProductRecommendationProps) {
  const { data, isLoading } = useProducts({ category, limit: 5 });

  if (isLoading || !data) return null;

  const filtered = data.products.filter((p: Product) => p.id !== excludeId);
  if (filtered.length === 0) return null;

  return (
    <View className="mt-4">
      <Text className="text-lg font-bold mb-3">Rekomendasi Untuk Kamu</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {filtered.map((product: Product) => (
          <RecommendationCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </View>
  );
}
