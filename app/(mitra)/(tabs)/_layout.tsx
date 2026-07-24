import { Tabs } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';

function TabBarWrapper({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const totalTabBarHeight = 60 + insets.bottom;

  return (
    <View
      style={{
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
      }}
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
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBarWrapper {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarAccessibilityLabel: 'Tab Dashboard',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pesanan',
          tabBarAccessibilityLabel: 'Tab Pesanan',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produk',
          tabBarAccessibilityLabel: 'Tab Produk',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="package-variant-closed" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analisis',
          tabBarAccessibilityLabel: 'Tab Analisis',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-line" size={24} color={color} />
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
