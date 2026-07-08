import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/lib/api/products';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { useAuthStore } from '@/stores/authStore';

export default function HomeScreen() {
  const [category, setCategory] = useState('');
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading, isError, error, refetch, isRefetching } = useProducts(
    category ? { category } : undefined
  );

  return (
    <ScrollView className="flex-1 bg-background">
      <Text className="text-xl font-bold text-primary p-4">
        {isAuthenticated ? 'Rekomendasi Buat Kamu' : 'Temukan Produk Terdekat'}
      </Text>
      <CategoryFilter selected={category} onSelect={setCategory} />
      <View className="px-4">
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" />
            <Text className="text-gray-500 mt-2">Memuat produk...</Text>
          </View>
        ) : isError ? (
          <View className="items-center justify-center py-12">
            <Text className="text-red-500 text-center mb-2">
              Gagal memuat produk
            </Text>
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
        ) : !data?.products?.length ? (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500 text-center">
              Belum ada produk tersedia saat ini
            </Text>
          </View>
        ) : (
          data.products.map((p: Product) => <ProductCard key={p.id} product={p} />)
        )}
        {isRefetching && !isLoading && (
          <View className="items-center py-2">
            <ActivityIndicator size="small" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
