import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  fallbackHref?: string;
  showBack?: boolean;
}

export function Header({
  title,
  onBack,
  fallbackHref = '/',
  showBack = true,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackHref);
    }
  };

  return (
    <View
      className="bg-primary flex-row items-center px-4"
      style={{ paddingTop: insets.top, height: 56 + insets.top }}
    >
      {showBack && (
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={8}
          accessibilityLabel="Kembali"
          accessibilityRole="button"
          className="mr-3"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      )}
      <Text className="text-white text-lg font-semibold flex-1">{title}</Text>
    </View>
  );
}
