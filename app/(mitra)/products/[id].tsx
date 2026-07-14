import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { getProduct, getImageVariants } from '@/lib/api/products';
import { Button } from '@/components/ui/button';

export default function MitraProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id as string),
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  if (isError || !data?.product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-destructive">Produk tidak ditemukan.</Text>
      </View>
    );
  }

  const product = data.product;
  const imageUrl = getImageVariants(product.imageVariants)?.full;

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Detail Produk' }} />

      {/* Hero Image */}
      <Image
        source={imageUrl ? { uri: imageUrl } : require('@/assets/placeholder.png')}
        style={{ width: '100%', height: 300, backgroundColor: '#e5e7eb' }}
        contentFit="cover"
      />

      <View className="p-4">
        {/* Name and Category */}
        <Text className="text-2xl font-bold text-foreground mb-1">{product.name}</Text>
        <Text className="text-muted-foreground mb-4 capitalize">{product.category}</Text>

        {/* Price Comparison */}
        <View className="flex-row items-center gap-2 mb-4">
          <Text className="text-primary text-xl font-bold">
            Rp{product.discountedPrice.toLocaleString()}
          </Text>
          <Text className="text-muted-foreground line-through">
            Rp{product.originalPrice.toLocaleString()}
          </Text>
        </View>

        {/* Stock Badge */}
        <View className="bg-muted p-3 rounded-lg mb-4">
          <Text className="font-medium text-foreground">
            Stok Tersisa: {product.stock} porsi
          </Text>
        </View>

        {/* Description */}
        <Text className="font-bold text-lg text-foreground mb-2">Deskripsi</Text>
        <Text className="text-muted-foreground leading-relaxed mb-6">
          {product.description || 'Tidak ada deskripsi.'}
        </Text>
      </View>

      {/* Edit Button */}
      <View className="p-4 border-t border-border">
        <Button onPress={() => router.push(`/(mitra)/products/${product.id}/edit`)}>
          <Text className="text-white font-bold text-center">Edit Produk</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
