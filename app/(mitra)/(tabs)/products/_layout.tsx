import { Stack } from 'expo-router';

export default function ProductsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Daftar Produk' }} />
      <Stack.Screen name="add" options={{ title: 'Tambah Produk' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail Produk' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Edit Produk' }} />
    </Stack>
  );
}
