import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function FoodSaverLayout() {
  const isConnected = useNetworkStatus();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-primary">
      <StatusBar style="light" />
      {!isConnected && <OfflineBanner />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="order/confirm/[id]" />
        <Stack.Screen name="order/[id]" options={{ headerShown: true, title: 'Detail Pesanan' }} />
        <Stack.Screen name="wishlist" />
        <Stack.Screen name="notifications" />
      </Stack>
    </SafeAreaView>
  );
}
