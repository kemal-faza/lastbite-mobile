import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg text-gray-500">Edit Produk: {id}</Text>
    </View>
  );
}
