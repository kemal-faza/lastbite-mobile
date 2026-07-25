import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontSize: 18, fontWeight: '600' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Pesanan Masuk' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detail Pesanan' }} />
    </Stack>
  );
}
