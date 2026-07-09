import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { colors } from '@/theme';

export default function FoodSaverLayout() {
  const isConnected = useNetworkStatus();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-primary">
      <StatusBar style="light" />
      {!isConnected && <OfflineBanner />}
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
              <View
                className={`items-center justify-center -mt-4 rounded-full w-14 h-14 shadow-lg ${focused ? 'bg-primary' : 'bg-primary/80'}`}
              >
                <MaterialCommunityIcons name="cart" size={28} color="white" />
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
        {/* Hidden from tab bar — accessed programmatically */}
        <Tabs.Screen name="checkout" options={{ href: null }} />
        <Tabs.Screen name="product/[id]" options={{ href: null }} />
        <Tabs.Screen name="order/confirm/[id]" options={{ href: null }} />
        <Tabs.Screen name="wishlist" options={{ href: null }} />
        <Tabs.Screen name="notifications" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
}
