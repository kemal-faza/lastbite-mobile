import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function NotificationsScreen() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          icon="bell-outline"
          title="Login untuk melihat notifikasi"
          description="Masuk untuk menerima update pesanan dan promo"
          action={<PrimaryButton onPress={() => router.push('/login')}>Masuk</PrimaryButton>}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-xl font-bold text-primary mb-4">Notifikasi</Text>
      <EmptyState
        icon="bell-sleep"
        title="Belum Ada Notifikasi"
        description="Notifikasi pesanan dan promo akan muncul di sini"
      />
    </View>
  );
}
