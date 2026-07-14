import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  fallbackHref?: string;
}

export function Header({ title, onBack, fallbackHref = '/' }: HeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      try {
        router.back();
      } catch {
        router.replace(fallbackHref);
      }
    }
  };

  return (
    <View className="bg-primary flex-row items-center px-4" style={{ height: 56 }}>
      <TouchableOpacity
        onPress={handleBack}
        hitSlop={8}
        accessibilityLabel="Kembali"
        accessibilityRole="button"
        className="mr-3"
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <Text className="text-white text-lg font-semibold flex-1">{title}</Text>
    </View>
  );
}
