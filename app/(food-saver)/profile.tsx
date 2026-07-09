import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuthStore } from '@/stores/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { ImpactStats } from '@/components/ImpactStats';
import { ProfileMenuItem } from '@/components/ProfileMenuItem';
import { TopBar } from '@/components/TopBar';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background">
        <TopBar />
        <View className="flex-1 p-4 justify-center items-center">
          <MaterialCommunityIcons name="account-circle-outline" size={80} color={colors.textSecondary} />
          <Text className="text-xl font-bold mt-4">Masuk LastBite</Text>
          <Text className="text-sm text-gray-500 mt-1 mb-8 text-center">
            Masuk untuk mendapatkan rekomendasi{'\n'}personal dan melacak pesanan
          </Text>
          <PrimaryButton onPress={() => router.push('/login')}>Masuk</PrimaryButton>
          <Button variant="outline" onPress={() => router.push('/register')} className="mt-3 w-full max-w-xs">
            <Text className="font-medium">Daftar Akun Baru</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TopBar />
      <View className="flex-1 p-4">
        <View className="items-center mt-8 mb-6">
        <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-4">
          <Text className="text-white text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text className="text-xl font-bold">{user?.name}</Text>
        <Text className="text-sm text-gray-500">{user?.email}</Text>
        <View className="bg-primary/10 px-3 py-1 rounded-full mt-2">
          <Text className="text-primary text-xs font-semibold">
            {user?.role === 'MITRA' ? 'Mitra' : 'Food Saver'}
          </Text>
        </View>
      </View>

      <ImpactStats moneySaved={0} foodSaved={0} />

      <View className="bg-white rounded-xl mb-4">
        <ProfileMenuItem
          icon="clipboard-list"
          label="Riwayat Pesanan"
          onPress={() => router.push('/orders')}
        />
        <ProfileMenuItem
          icon="heart-outline"
          label="Menu Favorit"
          onPress={() => router.push('/wishlist')}
        />
        <ProfileMenuItem
          icon="shield-account"
          label="Keamanan Akun"
          onPress={() => {}}
        />
        <ProfileMenuItem
          icon="cog-outline"
          label="Pengaturan"
          onPress={() => {}}
        />
        <ProfileMenuItem
          icon="help-circle-outline"
          label="Pusat Bantuan"
          onPress={() => {}}
          showArrow={false}
        />
      </View>

      {user?.role === 'MITRA' && (
        <View className="bg-white rounded-xl mb-4">
          <ProfileMenuItem
            icon="store"
            label="Dashboard Mitra"
            onPress={() => router.push('/(mitra)')}
          />
        </View>
      )}

      <View className="flex-1 justify-end pb-4">
        <Button variant="outline" onPress={logout} className="border-destructive">
          <MaterialCommunityIcons name="logout" size={18} color={colors.destructive} />
          <Text className="text-destructive font-medium ml-1">Keluar</Text>
        </Button>
      </View>
      </View>
    </View>
  );
}
