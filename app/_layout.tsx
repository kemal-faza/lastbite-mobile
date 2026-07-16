import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { PortalHost } from '@rn-primitives/portal';
import { useNotificationManager } from '@/hooks/useNotifications';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';
import { ToastProvider } from '@/contexts/ToastContext';
import '../global.css';

const queryClient = new QueryClient();

function AppContent() {
  useNotificationManager();
  const { isBootstrapping } = useAuthBootstrap();

  if (isBootstrapping) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AppContent />
            <PortalHost />
          </ToastProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
