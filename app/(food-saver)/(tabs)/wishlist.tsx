import { useCallback } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useBackHandler } from '@/hooks/useBackHandler';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/stores/authStore';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function WishlistScreen() {
  const { isAuthenticated } = useAuthStore();
  const handleBack = useCallback(() => { router.navigate('/profile'); }, []);
  useBackHandler(handleBack);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background">
        <Header title="Favorit Saya" onBack={handleBack} />
        <View className="flex-1">
          <EmptyState
            icon="heart-outline"
            title="Login untuk melihat favorit"
            description="Masuk untuk menyimpan produk favoritmu"
            action={<PrimaryButton onPress={() => router.push('/login')}>Masuk</PrimaryButton>}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      <Header title="Favorit Saya" onBack={handleBack} />
      <Text className="text-xl font-bold text-primary mb-4">Favorit Saya</Text>
      <EmptyState
        icon="heart-broken"
        title="Favorit Kosong"
        description="Simpan produk favoritmu dengan menekan ikon hati di produk"
        action={<PrimaryButton onPress={() => router.push('/')}>Cari Makanan</PrimaryButton>}
      />
    </View>
  );
}
