import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useProductFilter } from "@/hooks/useProductFilter";
import { getTrendingSearches } from "@/lib/api/search";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/contexts/ToastContext";
import { useScrollVisibility } from "@/contexts/ScrollVisibilityContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 16;
  const [trending, setTrending] = useState<
    Array<{ query: string; count: number }>
  >([]);
  const { history: recent, addQuery, clearAll } = useSearchHistory();

  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();
  const { isWishlisted, toggle } = useWishlist();
  const { handleScroll, handleScrollEnd } = useScrollVisibility();

  const { query, setQuery, productsQuery, debouncedQuery, isDebouncing } =
    useProductFilter();

  const { data, isLoading, isError, isFetching } = productsQuery;
  const products = data?.products ?? [];

  // Load trending on mount
  useEffect(() => {
    getTrendingSearches()
      .then(setTrending)
      .catch(() => {});
  }, []);

  // Refresh recent when query changes to results
  const handleSubmit = useCallback(async () => {
    if (query.trim().length >= 1) {
      await addQuery(query);
    }
  }, [query, addQuery]);

  const handleTrendingTap = useCallback(
    async (q: string) => {
      setQuery(q);
      if (q.trim().length >= 1) {
        await addQuery(q);
      }
    },
    [setQuery, addQuery],
  );

  const handleRecentTap = useCallback(
    async (q: string) => {
      setQuery(q);
      if (q.trim().length >= 1) {
        await addQuery(q);
      }
    },
    [setQuery, addQuery],
  );

  const handleClearRecent = useCallback(async () => {
    await clearAll();
  }, [clearAll]);

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

  // Show suggestions when query is empty
  const showSuggestions = query.trim().length < 1;
  const isBusy = isLoading || isDebouncing || (isFetching && products.length === 0);
  const isEmptySuggestions = trending.length === 0 && recent.length === 0;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="px-4 pb-2" style={{ paddingTop: headerHeight + 12 }}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={handleSubmit}
          placeholder="Cari makanan..."
        />
      </View>

      {/* Suggestions or Results */}
      {showSuggestions ? (
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={
            isEmptySuggestions
              ? { flexGrow: 1, justifyContent: "center", paddingBottom: 80 }
              : { paddingBottom: 80 }
          }
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          {/* Trending */}
          {trending.length > 0 && (
            <View className="mb-5">
              <Text className="text-xs font-bold text-gray-500 uppercase mb-3">
                Trending
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {trending.map((item) => (
                  <TouchableOpacity
                    key={item.query}
                    onPress={() => handleTrendingTap(item.query)}
                    className="bg-gray-100 px-3.5 py-2 rounded-full"
                  >
                    <Text className="text-sm text-gray-700">{item.query}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Recent */}
          {recent.length > 0 && (
            <View>
              <Text className="text-xs font-bold text-gray-500 uppercase mb-3">
                Terakhir Dicari
              </Text>
              {recent.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => handleRecentTap(item)}
                  className="flex-row items-center justify-between py-2.5 border-b border-gray-100"
                >
                  <View className="flex-row items-center gap-2.5">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color="#9ca3af"
                    />
                    <Text className="text-sm text-gray-700">{item}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={handleClearRecent}
                className="self-end mt-2.5"
              >
                <Text className="text-xs text-red-500">Hapus semua</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* No suggestions state */}
          {isEmptySuggestions && (
            <View className="flex-1 items-center justify-center">
              <EmptyState
                icon="magnify"
                title="Cari makanan favoritmu"
                description="Ketuk ikon pencarian dan mulai mengetik"
              />
            </View>
          )}
        </ScrollView>
      ) : (
        // Results
        <View className="flex-1 px-4">
          {isBusy && (
            <ActivityIndicator className="mt-4" size="small" color="#166534" />
          )}
          {isError && !isBusy && (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500 mb-2">Gagal memuat hasil</Text>
              <TouchableOpacity onPress={() => productsQuery.refetch()}>
                <Text className="text-primary font-semibold">Coba lagi</Text>
              </TouchableOpacity>
            </View>
          )}
          {!isBusy && !isError && products.length === 0 && (
            <View className="flex-1 items-center justify-center">
              <EmptyState
                icon="magnify-close"
                title="Tidak ditemukan"
                description={`Tidak ada hasil untuk "${debouncedQuery}"`}
              />
            </View>
          )}
          {!isBusy && !isError && products.length > 0 && (
            <>
              <Text className="text-xs text-gray-500 mb-2">
                {products.length} hasil untuk "{debouncedQuery}"
              </Text>
              <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 80 }}
                onScroll={handleScroll}
                onScrollEndDrag={handleScrollEnd}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                  <ProductCard
                    product={item}
                    className="w-[48%]"
                    isWishlisted={isWishlisted(item.id)}
                    onToggleWishlist={() => handleToggle(item.id)}
                  />
                )}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}
