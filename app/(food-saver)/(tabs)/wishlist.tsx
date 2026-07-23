import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useWishlist } from '@/hooks/useWishlist';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/contexts/ToastContext';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';

export default function WishlistScreen() {
  const router = useRouter();
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const { products, isLoading, refetch, toggle } = useWishlist({ loadProducts: true });
  const { showToast } = useToast();

  const handleToggle = (productId: string) => {
    toggle(
      { productId, isWishlisted: true },
      { onError: () => showToast('Gagal memperbarui favorit') },
    ).catch(() => {});
  };

  if (!isAuthenticated) {
    requireAuth(() => {});
    return (
      <EmptyState
        icon="heart-broken"
        title="Menu Favorit"
        description="Masuk untuk melihat menu favorit"
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3.5 border-b border-gray-100 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">Menu Favorit</Text>
        {products && products.length > 0 && (
          <View className="bg-gray-100 px-2.5 py-1 rounded-full">
            <Text className="text-xs text-gray-500">{products.length} produk</Text>
          </View>
        )}
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#166534" />
        </View>
      ) : !products || products.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Belum ada menu favorit"
          description="Jelajahi menu dan tambahkan ke favorit"
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              className="w-[48%]"
              isWishlisted={true}
              onToggleWishlist={() => handleToggle(item.id)}
            />
          )}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}
    </View>
  );
}
