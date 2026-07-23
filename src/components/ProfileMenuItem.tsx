import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface ProfileMenuItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  showArrow?: boolean;
}

export function ProfileMenuItem({ icon, label, onPress, showArrow = true }: ProfileMenuItemProps) {
  return (
    <Button
      variant="plain"
      onPress={onPress}
      className="flex-row items-center justify-between py-3.5 px-4 border-b border-gray-100 w-full"
    >
      <View className="flex-row items-center flex-1 mr-2">
        <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} />
        <Text className="ml-3 text-gray-700 font-medium text-sm flex-1">{label}</Text>
      </View>
      {showArrow && (
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
      )}
    </Button>
  );
}
