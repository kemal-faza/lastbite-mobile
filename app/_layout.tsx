import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  usePushNotifications();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
    </QueryClientProvider>
  );
}
