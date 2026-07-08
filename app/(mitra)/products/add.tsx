import { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as ImagePicker from 'expo-image-picker';
import { apiFetch } from '@/lib/api/client';
import { prepareAndUploadImage } from '@/lib/api/uploads';

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
      const uploaded = await prepareAndUploadImage(image);
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
      <Button variant="outline" onPress={pickImage} className="mb-4">
        <Text className="font-medium">Pilih Gambar</Text>
      </Button>
      {image && <Image source={{ uri: image }} className="w-full h-40 rounded-lg mb-4" />}
      <View className="mb-3">
        <Text className="text-foreground text-sm font-medium mb-1.5">Nama</Text>
        <Input value={name} onChangeText={setName} />
      </View>
      <View className="mb-3">
        <Text className="text-foreground text-sm font-medium mb-1.5">Deskripsi</Text>
        <Input value={description} onChangeText={setDescription} />
      </View>
      <View className="mb-3">
        <Text className="text-foreground text-sm font-medium mb-1.5">Harga Asli</Text>
        <Input value={originalPrice} onChangeText={setOriginalPrice} keyboardType="numeric" />
      </View>
      <View className="mb-3">
        <Text className="text-foreground text-sm font-medium mb-1.5">Harga Diskon</Text>
        <Input value={discountedPrice} onChangeText={setDiscountedPrice} keyboardType="numeric" />
      </View>
      <View className="mb-3">
        <Text className="text-foreground text-sm font-medium mb-1.5">Stok</Text>
        <Input value={stock} onChangeText={setStock} keyboardType="numeric" />
      </View>
      <Button variant="default" onPress={handleSubmit}>
        <Text className="text-white font-semibold">Simpan</Text>
      </Button>
    </View>
  );
}
