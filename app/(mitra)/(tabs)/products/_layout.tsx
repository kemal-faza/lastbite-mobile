import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontSize: 18, fontWeight: '600' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Daftar Produk' }} />
      <Stack.Screen name="add" options={{ title: 'Tambah Produk' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail Produk' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Edit Produk' }} />
    </Stack>
  );
}
