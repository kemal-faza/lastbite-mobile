import { useEffect } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useWishlist } from '@/hooks/useWishlist';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/contexts/ToastContext';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Header } from '@/components/Header';
import { useBackHandler } from '@/hooks/useBackHandler';

export default function WishlistScreen() {
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const { products, isLoading, refetch, toggle } = useWishlist({ loadProducts: true });
  const { showToast } = useToast();

  const handleBack = () => router.back();
  useBackHandler(handleBack);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth(() => {});
    }
  }, [isAuthenticated, requireAuth]);

  const handleToggle = (productId: string) => {
    toggle(
      { productId, isWishlisted: true },
      { onError: () => showToast('Gagal memperbarui favorit') },
    ).catch(() => {});
  };

  if (!isAuthenticated) {
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
      <Header title="Menu Favorit" onBack={handleBack} fallbackHref="/profile" />

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
