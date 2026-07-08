import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/hooks/useProducts';
import { useProductReviews } from '@/hooks/useReviews';
import { MapPreview } from '@/components/MapPreview';
import { TrustBadgeRow } from '@/components/TrustBadge';
import { ReviewList } from '@/components/ReviewList';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { addToCart } from '@/lib/api/cart';
import { useAuthStore } from '@/stores/authStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useProduct(id);
  const { isAuthenticated } = useAuthStore();
  const product = data?.product;
  const { data: reviewData } = useProductReviews(id);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-gray-500 mt-2">Memuat detail produk...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <Text className="text-red-500 text-center mb-2">Gagal memuat detail produk</Text>
        <Text className="text-gray-400 text-sm text-center mb-4">
          {error?.message || 'Terjadi kesalahan koneksi'}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-primary px-6 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-gray-500 text-center">Produk tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Image source={{ uri: product.imageUrl || undefined }} className="w-full h-64 bg-gray-200" />
      <View className="p-4">
        <Text className="text-2xl font-bold">{product.name}</Text>
        <Text className="text-gray-500">{product.storeName}</Text>
        <Text className="text-primary text-xl font-bold mt-2">Rp{product.discountedPrice.toLocaleString()}</Text>
        <Text className="text-gray-400 line-through">Rp{product.originalPrice.toLocaleString()}</Text>

        {/* Trust badges */}
        <View className="flex-row items-center justify-between mt-3 mb-4">
          <TrustBadgeRow
            badges={[
              ...(product.storeLat ? ['verified' as const] : []),
              'hygiene' as const,
              'popular' as const,
            ]}
          />
          <Text
            className={`text-xs font-medium ${
              product.stock <= 3 ? 'text-destructive' : 'text-gray-500'
            }`}
          >
            {product.stock <= 3
              ? `Sisa ${product.stock}`
              : `Stok: ${product.stock}`}
          </Text>
        </View>

        <Text className="mt-4">{product.description}</Text>

        {product.expiresAt && (
          <View className="bg-secondary/10 rounded-lg p-3 mt-4 flex-row items-center">
            <MaterialCommunityIcons name="clock-outline" size={18} color={colors.secondary} />
            <Text className="text-sm text-secondary font-medium ml-2">
              Berlaku hingga: {new Date(product.expiresAt).toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit',
              })}
            </Text>
          </View>
        )}
        {product.storeLat && product.storeLng && (
          <MapPreview lat={product.storeLat} lng={product.storeLng} storeName={product.storeName} />
        )}

        {/* Reviews */}
        <View className="mt-4">
          {reviewData ? (
            <ReviewList
              summary={reviewData.summary}
              reviews={reviewData.reviews}
            />
          ) : (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="small" />
              <Text className="text-gray-400 text-xs mt-2">Memuat ulasan...</Text>
            </View>
          )}
        </View>

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
