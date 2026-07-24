import { Tabs } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';
import { useScrollVisibility } from '@/contexts/ScrollVisibilityContext';

function TabBarWrapper({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { tabBarTranslateY } = useScrollVisibility();
  const totalTabBarHeight = 60 + insets.bottom;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: tabBarTranslateY.value * (totalTabBarHeight / 100),
      },
    ],
    opacity: interpolate(tabBarTranslateY.value, [0, 100], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: totalTabBarHeight,
          backgroundColor: '#ffffff',
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          zIndex: 40,
          overflow: 'visible',
          paddingBottom: insets.bottom,
        },
        animatedStyle,
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            testID={`tab-${route.name}`}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            {options.tabBarIcon &&
              options.tabBarIcon({
                focused: isFocused,
                color: isFocused ? colors.primary : '#666666',
                size: 24,
              })}
            <Text
              style={{
                fontSize: 10,
                color: isFocused ? colors.primary : '#666666',
                marginTop: 2,
                fontWeight: isFocused ? '600' : '400',
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore();
  const { cart: cartQuery } = useCart(isAuthenticated);
  const itemCount = cartQuery.data?.cart.items?.length || 0;

  return (
    <Tabs
      tabBar={(props) => <TabBarWrapper {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarAccessibilityLabel: 'Tab Beranda',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cari',
          tabBarAccessibilityLabel: 'Tab Cari',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Keranjang',
          tabBarAccessibilityLabel: 'Tab Keranjang',
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
          tabBarAccessibilityLabel: 'Tab Pesanan',
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
          tabBarAccessibilityLabel: 'Tab Profil',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
