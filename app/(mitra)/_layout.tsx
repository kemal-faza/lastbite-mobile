import { Stack, Redirect } from 'expo-router';
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}
