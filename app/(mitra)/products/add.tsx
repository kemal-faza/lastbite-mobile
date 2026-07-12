import { View, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ProductForm } from '@/components/ProductForm';
import { createMitraProduct } from '@/lib/api/mitra';
import { useQueryClient } from '@tanstack/react-query';

export default function NewProductScreen() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any, imageUri: string | null) => {
    if (!imageUri) {
      Alert.alert('Gambar Diperlukan', 'Silakan pilih foto produk terlebih dahulu.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('originalPrice', String(data.originalPrice));
      formData.append('discountedPrice', String(data.discountedPrice));
      formData.append('stock', String(data.stock));
      formData.append('expiry', data.expiry);

      // Append image as file
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const ext = filename.split('.').pop() || 'jpg';
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: `image/${ext}`,
      } as any);

      await createMitraProduct(formData);
      queryClient.invalidateQueries({ queryKey: ['mitra-products'] });
      Alert.alert('Berhasil', 'Produk berhasil ditambahkan', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Gagal', err.message || 'Terjadi kesalahan saat menyimpan produk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: 'Tambah Produk', headerBackTitle: 'Batal' }} />
      <ProductForm onSubmit={handleSubmit} isLoading={loading} />
    </View>
  );
}
