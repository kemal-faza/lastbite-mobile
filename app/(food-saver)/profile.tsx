import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuthStore } from '@/stores/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
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
    );
  }

  return (
    <View className="flex-1 bg-background p-4">
      <View className="items-center mt-8 mb-8">
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

      <View className="bg-white rounded-xl p-4 mb-4">
        <Text className="font-bold mb-2">Akun</Text>
        <View className="flex-row items-center py-3 border-b border-gray-100">
          <MaterialCommunityIcons name="email-outline" size={20} color={colors.textSecondary} />
          <Text className="ml-3 text-gray-700">{user?.email}</Text>
        </View>
        {user?.phone && (
          <View className="flex-row items-center py-3">
            <MaterialCommunityIcons name="phone-outline" size={20} color={colors.textSecondary} />
            <Text className="ml-3 text-gray-700">{user?.phone}</Text>
          </View>
        )}
      </View>

      <View className="bg-white rounded-xl p-4">
        <Text className="font-bold mb-2">Pesanan</Text>
        <Button variant="ghost" onPress={() => router.push('/orders')} className="w-full justify-start">
          <MaterialCommunityIcons name="clipboard-list" size={20} color={colors.primary} />
          <Text className="ml-2 font-medium">Lihat Pesanan Saya</Text>
        </Button>
      </View>

      <View className="flex-1 justify-end pb-4">
        <Button variant="outline" onPress={logout} className="border-destructive">
          <MaterialCommunityIcons name="logout" size={18} color={colors.destructive} />
          <Text className="text-destructive font-medium ml-1">Keluar</Text>
        </Button>
      </View>
    </View>
  );
}
