import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

type TrustBadgeType = 'verified' | 'hygiene' | 'popular';

const badgeConfig: Record<TrustBadgeType, { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; color: string }> = {
  verified: { icon: 'shield-check', label: 'Terverifikasi', color: colors.primary },
  hygiene: { icon: 'hand-wash', label: 'Higienis', color: '#059669' },
  popular: { icon: 'fire', label: 'Populer', color: colors.secondary },
};

interface TrustBadgeProps {
  type: TrustBadgeType;
}

export function TrustBadge({ type }: TrustBadgeProps) {
  const config = badgeConfig[type];

  return (
    <View
      className="flex-row items-center px-2 py-1 rounded-full"
      style={{ backgroundColor: `${config.color}15` }}
    >
      <MaterialCommunityIcons name={config.icon} size={12} color={config.color} />
      <Text className="text-xs font-medium ml-1" style={{ color: config.color }}>
        {config.label}
      </Text>
    </View>
  );
}

interface TrustBadgeRowProps {
  badges: TrustBadgeType[];
  testID?: string;
}

export function TrustBadgeRow({ badges, testID }: TrustBadgeRowProps) {
  if (!badges.length) return null;

  return (
    <View testID={testID} className="flex-row gap-2">
      {badges.slice(0, 3).map((type) => (
        <TrustBadge key={type} type={type} />
      ))}
    </View>
  );
}
