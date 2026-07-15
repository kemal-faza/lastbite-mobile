import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore();
  const { cart: cartQuery } = useCart(isAuthenticated);
  const itemCount = cartQuery.data?.cart.items?.length || 0;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cari',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center -mt-4">
              <View className={`items-center justify-center rounded-full w-14 h-14 shadow-lg ${focused ? 'bg-primary' : 'bg-primary/80'}`}>
                <MaterialCommunityIcons name="cart" size={28} color="white" />
              </View>
              {itemCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1">
                  <Text className="text-white text-xs font-bold">{itemCount > 99 ? '99+' : itemCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pesanan',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />

      {/* Hidden screens (tab bar visible, href: null) */}
      <Tabs.Screen
        name="product/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="checkout"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="order/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}
