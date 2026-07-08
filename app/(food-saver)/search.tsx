import { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/lib/api/products';
import { ProductCard } from '@/components/ProductCard';
import { colors } from '@/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce input 300ms
  const handleChangeText = useCallback((text: string) => {
    setQuery(text);
    const timer = setTimeout(() => setDebouncedQuery(text), 300);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, isError, error, refetch } = useProducts(
    debouncedQuery ? { search: debouncedQuery } : undefined
  );

  return (
    <View className="flex-1 bg-background p-4">
      <TextInput
        className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base mb-4"
        placeholder="Cari produk, toko, atau kategori..."
        value={query}
        onChangeText={handleChangeText}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {isLoading ? (
        <View className="items-center justify-center py-12">
          <ActivityIndicator size="large" />
          <Text className="text-gray-500 mt-2">Mencari produk...</Text>
        </View>
      ) : isError ? (
        <View className="items-center justify-center py-12">
          <Text className="text-red-500 text-center mb-2">
            Gagal mencari produk
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
      ) : !debouncedQuery ? (
        <View className="items-center justify-center py-12">
          <Text className="text-gray-500 text-center">
            Ketik nama produk atau toko untuk mulai mencari
          </Text>
        </View>
      ) : !data?.products?.length ? (
        <View className="items-center justify-center py-12">
          <Text className="text-gray-500 text-center">
            Tidak ada produk untuk "{debouncedQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={data.products as Product[]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text className="text-sm text-gray-400 mb-2">
              {data.products.length} produk ditemukan
            </Text>
          }
        />
      )}
    </View>
  );
}
