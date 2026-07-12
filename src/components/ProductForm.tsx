import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Button } from '@/components/ui/button';
import { ExpiryPicker } from './ExpiryPicker';
import { useState } from 'react';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Nama produk minimal 3 karakter' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  category: z.enum(['meals', 'bakery', 'drinks']),
  originalPrice: z.coerce.number().min(1000, { message: 'Harga minimal Rp1.000' }),
  discountedPrice: z.coerce.number().min(1000, { message: 'Harga diskon minimal Rp1.000' }),
  stock: z.coerce.number().min(1, { message: 'Stok minimal 1' }),
  expiry: z.string().min(1, { message: 'Pilih batas waktu' }),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface Props {
  initialData?: Partial<ProductFormData> & { id?: string; imageUri?: string };
  onSubmit: (data: ProductFormData, imageUri: string | null) => Promise<void>;
  isLoading: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(initialData?.imageUri || null);

  const { control, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: (initialData?.category as ProductFormData['category']) || 'meals',
      originalPrice: initialData?.originalPrice || 0,
      discountedPrice: initialData?.discountedPrice || 0,
      stock: initialData?.stock || 1,
      expiry: initialData?.expiry || 'Hari Ini',
    },
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const submitHandler = async (data: ProductFormData) => {
    await onSubmit(data, imageUri);
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      {/* Image Picker */}
      <TouchableOpacity
        onPress={pickImage}
        className="w-32 h-32 bg-gray-200 rounded-xl items-center justify-center mb-4 self-center overflow-hidden border border-gray-300"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-full" contentFit="cover" />
        ) : (
          <Text className="text-gray-500">Pilih Foto</Text>
        )}
      </TouchableOpacity>

      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="mb-1 font-medium text-foreground">Nama Produk</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              className="bg-background border border-border p-3 rounded-xl text-foreground"
              placeholder="Nasi Goreng Surplus"
              placeholderTextColor="#9ca3af"
            />
            {errors.name && (
              <Text className="text-destructive text-xs mt-1">{errors.name.message}</Text>
            )}
          </View>
        )}
      />

      {/* Description */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="mb-1 font-medium text-foreground">Deskripsi</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
              className="bg-background border border-border p-3 rounded-xl text-foreground"
              textAlignVertical="top"
              placeholder="Deskripsikan produk surplus ini..."
              placeholderTextColor="#9ca3af"
            />
            {errors.description && (
              <Text className="text-destructive text-xs mt-1">{errors.description.message}</Text>
            )}
          </View>
        )}
      />

      {/* Category Picker */}
      <View className="mb-4">
        <Text className="mb-2 font-medium text-foreground">Kategori</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row">
              {(['meals', 'bakery', 'drinks'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => onChange(cat)}
                  className={[
                    'flex-1 p-3 rounded-xl border items-center mx-1',
                    value === cat ? 'bg-primary border-primary' : 'bg-background border-border',
                  ].join(' ')}
                >
                  <Text className={value === cat ? 'text-white font-bold' : 'text-foreground capitalize'}>
                    {cat === 'meals' ? 'Makanan' : cat === 'bakery' ? 'Roti' : 'Minuman'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>

      {/* Price Fields */}
      <View className="flex-row gap-4 mb-4">
        <Controller
          control={control}
          name="originalPrice"
          render={({ field: { onChange, value } }) => (
            <View className="flex-1">
              <Text className="mb-1 font-medium text-foreground">Harga Normal</Text>
              <TextInput
                value={value ? String(value) : ''}
                onChangeText={onChange}
                keyboardType="numeric"
                className="bg-background border border-border p-3 rounded-xl text-foreground"
                placeholder="Rp"
                placeholderTextColor="#9ca3af"
              />
              {errors.originalPrice && (
                <Text className="text-destructive text-xs mt-1">{errors.originalPrice.message}</Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="discountedPrice"
          render={({ field: { onChange, value } }) => (
            <View className="flex-1">
              <Text className="mb-1 font-medium text-foreground">Harga Diskon</Text>
              <TextInput
                value={value ? String(value) : ''}
                onChangeText={onChange}
                keyboardType="numeric"
                className="bg-background border border-border p-3 rounded-xl text-foreground"
                placeholder="Rp"
                placeholderTextColor="#9ca3af"
              />
              {errors.discountedPrice && (
                <Text className="text-destructive text-xs mt-1">{errors.discountedPrice.message}</Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Stock */}
      <Controller
        control={control}
        name="stock"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="mb-1 font-medium text-foreground">Stok Tersedia</Text>
            <TextInput
              value={value ? String(value) : ''}
              onChangeText={onChange}
              keyboardType="numeric"
              className="bg-background border border-border p-3 rounded-xl text-foreground"
              placeholder="1"
              placeholderTextColor="#9ca3af"
            />
            {errors.stock && (
              <Text className="text-destructive text-xs mt-1">{errors.stock.message}</Text>
            )}
          </View>
        )}
      />

      {/* Expiry */}
      <Controller
        control={control}
        name="expiry"
        render={({ field: { onChange, value } }) => (
          <ExpiryPicker
            value={value}
            onChange={(val) => onChange(val)}
            error={errors.expiry?.message}
          />
        )}
      />

      {/* Submit */}
      <Button
        className="mt-4 mb-10"
        onPress={handleSubmit(submitHandler)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Simpan Produk</Text>
        )}
      </Button>
    </ScrollView>
  );
}
