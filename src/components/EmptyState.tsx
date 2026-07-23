import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';

interface EmptyStateProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description?: string;
  action?: React.ReactNode;
  testID?: string;
}

export function EmptyState({ icon, title, description, action, testID }: EmptyStateProps) {
  return (
    <View testID={testID} className="items-center justify-center py-12 px-4 w-full">
      <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
        <MaterialCommunityIcons name={icon} size={48} color={colors.textSecondary} />
      </View>
      <Text className="text-lg font-semibold text-center mb-2">{title}</Text>
      {description ? (
        <Text className="text-sm text-gray-500 text-center mb-6">{description}</Text>
      ) : null}
      {action ? <View className="mt-4 w-full">{action}</View> : null}
    </View>
  );
}
