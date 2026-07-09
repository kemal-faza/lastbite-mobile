import { View } from 'react-native';
import { router } from 'expo-router';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useAuthStore } from '@/stores/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

export function MitraDrawerContent(props: any) {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/(food-saver)');
  };

  return (
    <View className="flex-1">
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View className="border-t border-gray-200 pt-2 pb-4 px-4">
        <DrawerItem
          label="Keluar"
          icon={({ size }) => (
            <MaterialCommunityIcons
              name="logout"
              size={size}
              color={colors.destructive}
            />
          )}
          onPress={handleLogout}
          inactiveTintColor={colors.destructive}
          activeTintColor={colors.destructive}
        />
      </View>
    </View>
  );
}
