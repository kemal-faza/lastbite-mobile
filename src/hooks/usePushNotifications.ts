import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerDeviceToken } from '@/lib/api/devices';
import { useAuthStore } from '@/stores/authStore';

export function usePushNotifications() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const setup = async () => {
      try {
        if (!Device.isDevice) return;
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return;
        const { data } = await Notifications.getExpoPushTokenAsync();
        await registerDeviceToken(data);
      } catch {
        // Silent fail — push notification registration is non-critical
      }
    };

    setup();
  }, [isAuthenticated]);
}
