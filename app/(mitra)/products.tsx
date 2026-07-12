import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Swipeable } from 'react-native-gesture-handler';
import { Button } from '@/components/ui/button';
import { useMitraProducts } from '@/hooks/useMitra';
import { getImageVariants } from '@/lib/api/products';
import { deleteMitraProduct } from '@/lib/api/mitra';
import { useQueryClient } from '@tanstack/react-query';
import { FontAwesome } from '@expo/vector-icons';

export default function MitraProductsScreen() {
  const { data } = useMitraProducts();
  const queryClient = useQueryClient();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Hapus Produk',
      'Apakah kamu yakin ingin menghapus produk ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMitraProduct(id);
              queryClient.invalidateQueries({ queryKey: ['mitra-products'] });
            } catch (e: any) {
              Alert.alert('Gagal', 'Terjadi kesalahan saat menghapus produk.');
            }
          },
        },
      ],
    );
  };

  const renderRightActions = (id: string) => (
    <View className="flex-row items-center mb-2">
      <TouchableOpacity
        onPress={() => router.push(`/(mitra)/products/${id}/edit`)}
        accessibilityLabel="Edit produk"
        accessibilityRole="button"
        className="bg-blue-500 justify-center items-center w-16 h-full rounded-l-xl"
      >
        <FontAwesome name="pencil" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleDelete(id)}
        accessibilityLabel="Hapus produk"
        accessibilityRole="button"
        className="bg-red-500 justify-center items-center w-16 h-full rounded-r-xl"
      >
        <FontAwesome name="trash" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-background p-4">
      <Button
        variant="default"
        onPress={() => router.push('/(mitra)/products/add')}
        className="mb-4"
      >
        <Text className="text-white font-semibold">+ Tambah Produk</Text>
      </Button>
      <FlatList
        data={data?.products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const thumbUrl = getImageVariants(item.imageVariants)?.thumb;
          return (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push(`/(mitra)/products/${item.id}`)}
                className="bg-white p-3 rounded-xl mb-2 flex-row items-center"
              >
                <View className="mr-3">
                  <Image
                    source={
                      thumbUrl
                        ? { uri: thumbUrl }
                        : require('../../assets/placeholder.png')
                    }
                    contentFit="cover"
                    style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: '#e5e7eb' }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-foreground">{item.name}</Text>
                  <Text className="text-muted-foreground">Stok: {item.stock}</Text>
                  <Text className="text-primary">Rp{item.discountedPrice.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          );
        }}
      />
    </View>
  );
}
