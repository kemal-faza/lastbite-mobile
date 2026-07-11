import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  usePushNotifications();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Host>
            <BottomSheetModalProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </BottomSheetModalProvider>
          </Host>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
