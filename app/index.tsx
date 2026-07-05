import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { View, Text, ActivityIndicator } from 'react-native';

export default function IndexScreen() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (user?.role === 'MITRA') {
    return <Redirect href="/(mitra)" />;
  }

  return <Redirect href="/(food-saver)" />;
}