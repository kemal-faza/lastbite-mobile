import { View, Text, ScrollView, Pressable } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface DrawerItem {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: string;
}

const DRAWER_ITEMS: DrawerItem[] = [
  { label: 'Dashboard', icon: 'view-dashboard', route: '/(mitra)' },
  { label: 'Daftar Produk', icon: 'package-variant-closed', route: '/(mitra)/products' },
  { label: 'Pesanan Masuk', icon: 'clipboard-list', route: '/(mitra)/orders' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MitraDrawerContent(_props: Record<string, unknown>) {
  const { logout } = useAuthStore();
  const currentPath = usePathname() ?? '';

  const handleLogout = () => {
    logout();
    router.replace('/(food-saver)');
  };

  const isActive = (route: string) => {
    if (!currentPath) return false;
    // Match current path against drawer route
    const normalizedRoute = route.replace('/(mitra)', '');
    const normalizedPath = currentPath.replace('/(mitra)', '');
    // Root route: only active when on the exact root path
    if (normalizedRoute === '') {
      return normalizedPath === '' || normalizedPath === '/' || normalizedPath === '/index';
    }
    // Non-root routes: exact match OR nested sub-page
    return normalizedPath === normalizedRoute || normalizedPath.startsWith(normalizedRoute + '/');
  };

  return (
    <View className="flex-1 bg-background">
      {/* Drawer header */}
      <View className="bg-primary px-4 py-6">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="store" size={28} color="white" />
          <Text className="text-white text-lg font-bold ml-3">LastBite Mitra</Text>
        </View>
      </View>

      {/* Menu items */}
      <ScrollView className="flex-1 pt-2">
        {DRAWER_ITEMS.map((item) => {
          const active = isActive(item.route);
          return (
            <Pressable
              key={item.route}
              onPress={() => {
                router.push(item.route as any);
              }}
              className={`flex-row items-center px-4 py-3.5 mx-2 rounded-lg ${
                active ? 'bg-primary/10' : ''
              }`}
              accessibilityLabel={item.label}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={active ? colors.primary : '#6b7280'}
              />
              <Text
                className={`ml-3 text-base ${
                  active ? 'font-bold text-primary' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Logout button */}
      <View className="border-t border-gray-200 pt-2 pb-6 px-4">
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center py-3.5 rounded-lg"
          accessibilityLabel="Keluar"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="logout"
            size={22}
            color={colors.destructive}
          />
          <Text className="ml-3 text-base font-medium" style={{ color: colors.destructive }}>
            Keluar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
