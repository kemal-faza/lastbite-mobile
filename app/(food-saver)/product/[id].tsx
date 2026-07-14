import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useProduct } from '@/hooks/useProducts';
import { useProductReviews } from '@/hooks/useReviews';
import { TrustBadgeRow } from '@/components/TrustBadge';
import { ReviewList } from '@/components/ReviewList';
import { ProductRecommendation } from '@/components/ProductRecommendation';
import { SkeletonList } from '@/components/SkeletonCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { getImageVariants } from '@/lib/api/products';
import { addToCart } from '@/lib/api/cart';
import { useAuthStore } from '@/stores/authStore';

/** Calculate discount percentage, returns 0 if prices are equal or invalid. */
function calcDiscountPct(original: number, discounted: number, explicit?: number): number {
  if (explicit != null) return explicit;
  if (original <= 0) return 0;
  return Math.round((1 - discounted / original) * 100);
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useProduct(id);
  const { isAuthenticated } = useAuthStore();
  const product = data?.product;
  const { data: reviewData, isLoading: isLoadingReviews } = useProductReviews(id);
  const queryClient = useQueryClient();

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
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 16 }}>
        <View className="w-full h-64 bg-gray-200 overflow-hidden">
          <Image
            source={
              getImageVariants(product.imageVariants)?.full
                ? { uri: getImageVariants(product.imageVariants)!.full }
                : require('../../../assets/placeholder.png')
            }
            contentFit="cover"
            transition={300}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
        <View className="p-4 pb-0">
          <Text className="text-2xl font-bold">{product.name}</Text>
          <Text className="text-gray-500">{product.storeName}</Text>
          {/* Price + discount badge */}
          <View className="flex-row items-center gap-2 mt-2">
            <Text className="text-primary text-xl font-bold">
              Rp{product.discountedPrice.toLocaleString()}
            </Text>
            {(() => {
              const pct = calcDiscountPct(
                product.originalPrice,
                product.discountedPrice,
                product.discountPercent,
              );
              return pct > 0 ? (
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.destructive }}
                >
                  <Text className="text-white text-xs font-bold">-{pct}%</Text>
                </View>
              ) : null;
            })()}
          </View>
          <Text className="text-gray-400 line-through">
            Rp{product.originalPrice.toLocaleString()}
          </Text>

          {/* Trust badges */}
          <View className="flex-row items-center justify-between mt-3 mb-4">
            <TrustBadgeRow badges={['popular']} />
            <Text
              className={`text-sm font-semibold ${
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
          {product.storeAddress && (
            <View className="bg-white rounded-lg p-3 mt-4 border border-gray-200">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons name="map-marker" size={20} color={colors.primary} />
                <Text className="font-semibold ml-2">Lokasi Toko</Text>
              </View>
              <Text className="text-gray-500 text-sm mb-3">{product.storeAddress}</Text>
              {product.storeLat && product.storeLng && (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      `https://www.google.com/maps/dir/?api=1&destination=${product.storeLat},${product.storeLng}`
                    ).catch(() => {});
                  }}
                  className="flex-row items-center justify-center bg-primary/10 py-2 rounded-lg"
                >
                  <MaterialCommunityIcons name="directions" size={16} color={colors.primary} />
                  <Text className="text-primary font-medium text-sm ml-1">Petunjuk Arah</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Reviews */}
          <View className="mt-4">
            {isLoadingReviews ? (
              <SkeletonList count={2} />
            ) : (
              <ReviewList
                summary={reviewData?.summary ?? {
                  averageRating: 0,
                  totalReviews: 0,
                  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                }}
                reviews={reviewData?.reviews ?? []}
              />
            )}
          </View>

          {/* Recommendations */}
          <ProductRecommendation
            category={product.category}
            excludeId={product.id}
          />
        </View>
      </ScrollView>

      {/* Floating button container */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        <Button
          testID="add-to-cart-button"
          variant="default"
          onPress={async () => {
            if (!isAuthenticated) { router.push('/login'); return; }
            try {
              await addToCart(product.id);
              queryClient.invalidateQueries({ queryKey: ['cart'] });
            } catch (e: any) {
              alert(e.message || 'Gagal menambahkan ke keranjang');
            }
          }}
        >
          <Text className="text-white font-semibold">Tambah ke Keranjang</Text>
        </Button>
      </View>
    </View>
  );
}
