import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity
            testID="products-back-button"
            onPress={() => router.back()}
            className="ml-4"
            accessibilityLabel="Kembali"
            accessibilityRole="button"
          >
            <FontAwesome name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Daftar Produk' }} />
      <Stack.Screen name="add" options={{ title: 'Tambah Produk' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail Produk' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Edit Produk' }} />
    </Stack>
  );
}
