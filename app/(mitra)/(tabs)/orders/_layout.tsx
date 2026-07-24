import { Stack } from 'expo-router';
import { DrawerToggleButton } from 'expo-router/drawer';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Pesanan Masuk',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detail Pesanan',
        }}
      />
    </Stack>
  );
}
