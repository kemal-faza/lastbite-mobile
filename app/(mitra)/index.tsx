import { View, Text } from 'react-native';
import { useMitraProfile } from '@/hooks/useMitra';

export default function MitraDashboardScreen() {
  const { data } = useMitraProfile();
  const profile = data?.profile;

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-primary">{profile?.storeName || 'Toko'}</Text>
      <Text className="text-gray-500 mb-6">{profile?.storeDescription}</Text>
      <View className="bg-white p-4 rounded-xl">
        <Text className="font-bold mb-2">Aksi Cepat</Text>
        <Text>Tambah Produk</Text>
        <Text>Lihat Pesanan</Text>
      </View>
    </View>
  );
}
