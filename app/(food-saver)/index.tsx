import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/lib/api/products';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SkeletonList } from '@/components/SkeletonCard';
import { SortPills, type SortOption } from '@/components/SortPills';
import { FilterModal, type FilterState } from '@/components/FilterModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useAuthStore } from '@/stores/authStore';

export default function HomeScreen() {
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('terdekat');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    maxDistance: 0,
    maxPrice: 0,
    expiry: 'all',
  });
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

      {/* Sort & Filter */}
      <View className="flex-row items-center px-4 mb-3">
        <SortPills selected={sort} onSelect={setSort} />
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          className="flex-row items-center ml-2 px-3 py-1.5 rounded-full border border-gray-300 bg-white"
        >
          <MaterialCommunityIcons name="tune" size={16} color={colors.textSecondary} />
          <Text className="text-sm text-gray-600 ml-1">Filter</Text>
          {(filters.maxDistance > 0 || filters.maxPrice > 0 || filters.expiry !== 'all') && (
            <View className="w-2 h-2 rounded-full ml-1" style={{ backgroundColor: colors.destructive }} />
          )}
        </TouchableOpacity>
      </View>

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={setFilters}
      />

      <View className="px-4">
        {isLoading ? (
          <SkeletonList count={4} />
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
          <>
            {data?.products?.length !== undefined && (
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-gray-500">
                  {data.products.length} produk tersedia
                </Text>
              </View>
            )}
            {data.products.map((p: Product) => <ProductCard key={p.id} product={p} />)}
          </>
        )}

        {/* Beli Lagi */}
        {isAuthenticated && (
          <View className="mb-4 mt-4">
            <Text className="text-lg font-bold px-4 mb-3">Beli Lagi</Text>
            <Text className="text-sm text-gray-400 px-4">
              Produk yang pernah kamu beli akan muncul di sini
            </Text>
          </View>
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
