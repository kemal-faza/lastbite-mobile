import { Text } from 'react-native';
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
      className="flex-row items-center gap-2 py-3 px-4 border-b border-gray-100"
    >
      <MaterialCommunityIcons name={icon} size={20} color={colors.textSecondary} />
      <Text className="flex-1 ml-3 text-gray-700">{label}</Text>
      {showArrow && (
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
      )}
    </Button>
  );
}
