import { Drawer } from 'expo-router/drawer';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function MitraLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const isConnected = useNetworkStatus();

  if (!isAuthenticated) return <Redirect href="/(food-saver)" />;
  if (user?.role !== 'MITRA') return <Redirect href="/(food-saver)" />;

  return (
    <View className="flex-1">
      {!isConnected && <OfflineBanner />}
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
    </View>
  );
}
