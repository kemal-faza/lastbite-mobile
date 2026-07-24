import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Pesanan Masuk' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail Pesanan' }} />
    </Stack>
  );
}
