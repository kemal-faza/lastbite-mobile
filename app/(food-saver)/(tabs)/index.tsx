import { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { useProductFilter } from "@/hooks/useProductFilter";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SkeletonList } from "@/components/SkeletonCard";
import { SortPills, type SortOption } from "@/components/SortPills";
import { FilterModal, type FilterState } from "@/components/FilterModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme";
import { useAuthStore } from "@/stores/authStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/contexts/ToastContext";

export default function HomeScreen() {
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  const { isWishlisted, toggle } = useWishlist();

  const {
    category,
    setCategory,
    sort,
    setSort,
    showFilter,
    setShowFilter,
    filters,
    setFilters,
    productsQuery,
  } = useProductFilter();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    isPlaceholderData,
    isFetching,
  } = productsQuery;
  const filteredProducts = data?.products ?? [];

  const handleToggle = useCallback(
    (productId: string) => {
      if (!isAuthenticated) {
        showToast("Login untuk menambah favorit");
        return;
      }
      const isCurrentlyWishlisted = isWishlisted(productId);
      toggle(
        { productId, isWishlisted: isCurrentlyWishlisted },
        { onError: () => showToast("Gagal memperbarui favorit") },
      ).catch(() => {});
    },
    [isAuthenticated, isWishlisted, toggle, showToast],
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text className="text-xl font-bold text-primary p-4">
          {isAuthenticated
            ? "Rekomendasi Buat Kamu"
            : "Temukan Produk Terdekat"}
        </Text>

        <CategoryFilter selected={category} onSelect={setCategory} />

        {/* Sort & Filter */}
        <View className="flex-row items-center px-4 mb-3">
          <View className="flex-1">
            <SortPills selected={sort} onSelect={setSort} />
          </View>
          <TouchableOpacity
            onPress={() => setShowFilter(true)}
            className="flex-shrink-0 flex-row items-center ml-2 px-3 py-1.5 rounded-full border border-gray-300 bg-white"
          >
            <MaterialCommunityIcons
              name="tune"
              size={16}
              color={colors.textSecondary}
            />
            <Text className="text-sm text-gray-600 ml-1">Filter</Text>
            {(filters.maxDistance > 0 ||
              filters.maxPrice > 0 ||
              filters.expiry !== "Hari Ini") && (
              <View
                className="w-2 h-2 rounded-full ml-1"
                style={{ backgroundColor: colors.destructive }}
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="px-4">
          {isLoading ? (
            <SkeletonList count={4} />
          ) : isError ? (
            <View className="items-center justify-center py-12">
              <Text className="text-red-500 text-center mb-2">
                Gagal memuat produk
              </Text>
              <Text className="text-gray-400 text-sm text-center mb-4">
                {error?.message || "Terjadi kesalahan koneksi"}
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
          ) : filteredProducts.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 text-center">
                Tidak ada produk dalam jarak {filters.maxDistance} km
              </Text>
            </View>
          ) : (
            <>
              {filteredProducts.length !== undefined && (
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm text-gray-500">
                    {filteredProducts.length} produk tersedia
                  </Text>
                </View>
              )}
              <View
                className={`flex-row flex-wrap justify-between ${isPlaceholderData && isFetching ? "opacity-50" : ""}`}
              >
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    className="w-[48%] mb-4"
                    isWishlisted={isWishlisted(p.id)}
                    onToggleWishlist={() => handleToggle(p.id)}
                  />
                ))}
              </View>
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

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={setFilters}
      />
    </View>
  );
}
