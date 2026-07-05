import { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { apiFetch } from '@/lib/api/client';
import { uploadImage } from '@/lib/api/uploads';

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    let imageUrl = null;
    if (image) {
      const uploaded = await uploadImage({ uri: image, name: 'product.jpg', type: 'image/jpeg' });
      imageUrl = uploaded.url;
    }

    await apiFetch('/products', {
      auth: true,
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        originalPrice: Number(originalPrice),
        discountedPrice: Number(discountedPrice),
        stock: Number(stock),
        category: 'meals',
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        imageUrl,
      }),
    });
    router.back();
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-bold text-primary mb-4">Tambah Produk</Text>
      <Button onPress={pickImage} className="mb-4">Pilih Gambar</Button>
      {image && <Image source={{ uri: image }} className="w-full h-40 rounded-lg mb-4" />}
      <TextInput label="Nama" value={name} onChangeText={setName} className="mb-3" />
      <TextInput label="Deskripsi" value={description} onChangeText={setDescription} className="mb-3" />
      <TextInput label="Harga Asli" value={originalPrice} onChangeText={setOriginalPrice} keyboardType="numeric" className="mb-3" />
      <TextInput label="Harga Diskon" value={discountedPrice} onChangeText={setDiscountedPrice} keyboardType="numeric" className="mb-3" />
      <TextInput label="Stok" value={stock} onChangeText={setStock} keyboardType="numeric" className="mb-3" />
      <Button mode="contained" onPress={handleSubmit}>Simpan</Button>
    </View>
  );
}
