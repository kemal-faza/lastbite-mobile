import { Drawer } from 'expo-router/drawer';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useNotificationResponder } from '@/hooks/useNotificationResponder';
import { MitraDrawerContent } from '@/components/MitraDrawerContent';

export default function MitraLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const isConnected = useNetworkStatus();

  useNotificationResponder();

  if (!isAuthenticated) return <Redirect href="/(food-saver)" />;
  if (user?.role !== 'MITRA') return <Redirect href="/(food-saver)" />;

  return (
    <View className="flex-1">
      {!isConnected && <OfflineBanner />}
      <Drawer
        drawerContent={(props) => <MitraDrawerContent {...props} />}
        screenOptions={{ headerShown: true }}
      >
        <Drawer.Screen name="index" options={{ title: 'Dashboard' }} />
        <Drawer.Screen name="analytics" options={{ title: 'Analisis' }} />
        <Drawer.Screen name="products" options={{ title: 'Daftar Produk' }} />
        <Drawer.Screen
          name="products/add"
          options={{ title: 'Tambah Produk', drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen
          name="products/[id]"
          options={{ title: 'Detail Produk', drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen
          name="products/[id]/edit"
          options={{ title: 'Edit Produk', drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen name="orders" options={{ title: 'Pesanan Masuk' }} />
      </Drawer>
    </View>
  );
}
