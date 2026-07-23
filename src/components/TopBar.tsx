import { View, Text, Image, Pressable } from 'react-native';
import { router, useSegments } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotifications } from '@/hooks/useNotifications';

export function TopBar() {
  const { unreadCount } = useNotifications();
  const segments = useSegments();
  const currentPath = '/' + segments.join('/');

  return (
    <View
      className="bg-primary flex-row items-center justify-between px-4"
      style={{ height: 60 }}
    >
      <View className="flex-row items-center">
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 28, height: 28 }}
          resizeMode="contain"
        />
        <Text className="ml-2 text-white text-lg font-bold">LastBite</Text>
      </View>
      <Pressable
        onPress={() => router.push({ pathname: '/notifications', params: { fromScreen: currentPath } })}
        hitSlop={10}
        accessibilityLabel="Buka notifikasi"
        accessibilityRole="button"
      >
        <View className="relative">
          <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1.5 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
              <Text className="text-white text-[10px] font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}
