import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function WishlistScreen() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-background">
        <View className="flex-1">
          <EmptyState
            icon="heart-outline"
            title="Login untuk melihat favorit"
            description="Masuk untuk menyimpan produk favoritmu"
            action={<PrimaryButton onPress={() => router.push('/login')}>Masuk</PrimaryButton>}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="flex-1 p-4">
        <Text className="text-xl font-bold text-primary mb-4">Favorit Saya</Text>
        <EmptyState
          icon="heart-broken"
          title="Favorit Kosong"
          description="Simpan produk favoritmu dengan menekan ikon hati di produk"
          action={<PrimaryButton onPress={() => router.push('/')}>Cari Makanan</PrimaryButton>}
        />
      </View>
    </SafeAreaView>
  );
}
