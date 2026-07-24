import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';
import { useQuery } from '@tanstack/react-query';
import { getMitraProfile } from '@/lib/api/mitra';

export default function MitraProfileScreen() {
  const { user, logout } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['mitra-profile'],
    queryFn: () => getMitraProfile().then(r => r.profile),
    enabled: user?.role === 'MITRA',
  });

  const namaToko = profile?.storeName || user?.name || 'Mitra';
  const email = user?.email || '-';

  const handleLogout = async () => {
    await logout();
    router.replace('/(food-saver)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-3">
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text className="text-3xl font-bold text-primary">
                {namaToko.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <Text className="text-2xl font-bold text-center">{namaToko}</Text>
          {user?.name && user.name !== namaToko && (
            <Text className="text-base text-gray-600 mt-1">{user.name}</Text>
          )}
          <View className="bg-primary/10 px-3 py-1 rounded-full mt-2">
            <Text className="text-primary text-xs font-semibold">Mitra</Text>
          </View>
          <Text className="text-sm text-gray-500 mt-2">{email}</Text>
        </View>

        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Pressable
            testID="logout-button"
            onPress={handleLogout}
            className="flex-row items-center py-3"
            accessibilityLabel="Keluar"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="logout" size={22} color={colors.destructive} />
            <Text className="ml-3 text-base font-medium" style={{ color: colors.destructive }}>
              Keluar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
