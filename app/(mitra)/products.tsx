import { View, Text, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { useMitraProducts } from '@/hooks/useMitra';

export default function MitraProductsScreen() {
  const { data } = useMitraProducts();

  return (
    <View className="flex-1 bg-background p-4">
      <Button variant="default" onPress={() => router.push('/products/add')} className="mb-4">
        <Text className="text-white font-semibold">+ Tambah Produk</Text>
      </Button>
      <FlatList
        data={data?.products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-3 rounded-xl mb-2">
            <Text className="font-bold">{item.name}</Text>
            <Text>Stok: {item.stock}</Text>
            <Text className="text-primary">Rp{item.discountedPrice.toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}
