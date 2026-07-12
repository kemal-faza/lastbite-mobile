import { View, ActivityIndicator, Alert, Text } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductForm, ProductFormData } from '@/components/ProductForm';
import { updateMitraProduct } from '@/lib/api/mitra';
import { getProduct, getImageVariants } from '@/lib/api/products';

function mapExpiresAt(iso?: string): string {
  if (!iso) return 'Tutup Toko';
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return 'Tutup Toko';
  const hours = diff / (1000 * 60 * 60);
  if (hours <= 1) return '< 1 Jam';
  if (hours <= 3) return '< 3 Jam';
  if (hours <= 6) return '< 6 Jam';
  return 'Tutup Toko';
}

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading: isFetching, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id as string),
  });

  const handleSubmit = async (formState: ProductFormData, imageUri: string | null) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('description', formState.description);
      formData.append('category', formState.category);
      formData.append('originalPrice', String(formState.originalPrice));
      formData.append('discountedPrice', String(formState.discountedPrice));
      formData.append('stock', String(formState.stock));
      formData.append('expiry', formState.expiry);

      // Only append image if user picked a new one (uri doesn't start with http)
      if (imageUri && !imageUri.startsWith('http')) {
        const filename = imageUri.split('/').pop() || 'photo.jpg';
        const ext = filename.split('.').pop() || 'jpg';
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type: `image/${ext}`,
        } as any);
      }

      await updateMitraProduct(id as string, formData);
      queryClient.invalidateQueries({ queryKey: ['mitra-products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      Alert.alert('Berhasil', 'Produk berhasil diperbarui', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Gagal', err.message || 'Terjadi kesalahan saat memperbarui produk.');
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  if (isError || !data?.product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-destructive">Gagal memuat data produk.</Text>
      </View>
    );
  }

  const product = data.product;
  const resolvedImage = getImageVariants(product.imageVariants);
  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    category: product.category,
    originalPrice: product.originalPrice,
    discountedPrice: product.discountedPrice,
    stock: product.stock,
    expiry: mapExpiresAt((product as any).expiresAt || (product as any).expiry) || 'Tutup Toko',
    imageUri: resolvedImage?.full || resolvedImage?.card || (product as any).imageUrl || undefined,
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'Edit Produk' }} />
      <ProductForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} />
    </View>
  );
}
