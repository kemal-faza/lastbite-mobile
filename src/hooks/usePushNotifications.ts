import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerDeviceToken } from '@/lib/api/devices';
import { useAuthStore } from '@/stores/authStore';

export function usePushNotifications() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !Device.isDevice) return;

    Notifications.requestPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') return;
      Notifications.getExpoPushTokenAsync().then(({ data }) => {
        registerDeviceToken(data);
      });
    });
  }, [isAuthenticated]);
}
