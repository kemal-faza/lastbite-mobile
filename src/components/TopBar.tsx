import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function TopBar() {
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
        onPress={() => router.push('/notifications')}
        hitSlop={10}
        accessibilityLabel="Buka notifikasi"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="bell-outline" size={24} color="white" />
      </Pressable>
    </View>
  );
}
