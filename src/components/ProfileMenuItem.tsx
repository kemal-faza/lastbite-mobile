import { TouchableOpacity, Text } from 'react-native';
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
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-3 px-4 border-b border-gray-100"
    >
      <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} />
      <Text className="flex-1 ml-3 text-gray-700">{label}</Text>
      {showArrow && (
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}
