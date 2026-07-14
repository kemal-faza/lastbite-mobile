import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OfflineBanner } from '@/components/OfflineBanner';
import { TopBar } from '@/components/TopBar';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function FoodSaverLayout() {
  const isConnected = useNetworkStatus();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-primary">
      <StatusBar style="light" />
      {!isConnected && <OfflineBanner />}
      <TopBar />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}
