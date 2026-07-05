import { View, Text } from 'react-native';

export function OfflineBanner() {
  return (
    <View className="bg-destructive p-2">
      <Text className="text-white text-center text-sm">Mode offline. Beberapa fitur tidak tersedia.</Text>
    </View>
  );
}
