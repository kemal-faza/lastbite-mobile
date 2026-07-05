import { Drawer } from 'expo-router/drawer';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function MitraLayout() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/login" />;
  if (user?.role !== 'MITRA') return <Redirect href="/(food-saver)" />;

  return (
    <Drawer screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="index" options={{ title: 'Ringkasan' }} />
      <Drawer.Screen name="products" options={{ title: 'Daftar Produk' }} />
      <Drawer.Screen
        name="products/add"
        options={{ title: 'Tambah Produk', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="products/[id]"
        options={{ title: 'Edit Produk', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen name="orders" options={{ title: 'Pesanan Masuk' }} />
    </Drawer>
  );
}
