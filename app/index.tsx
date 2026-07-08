import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function IndexScreen() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(food-saver)" />;
  }

  if (user?.role === 'MITRA') {
    return <Redirect href="/(mitra)" />;
  }

  return <Redirect href="/(food-saver)" />;
}