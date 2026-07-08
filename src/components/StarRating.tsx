import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

export function StarRating({ rating, size = 16, showValue = false }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <View className="flex-row items-center">
      {Array.from({ length: fullStars }).map((_, i) => (
        <MaterialCommunityIcons
          key={`full-${i}`}
          name="star"
          size={size}
          color={colors.secondary}
        />
      ))}
      {hasHalf && (
        <MaterialCommunityIcons
          name="star-half-full"
          size={size}
          color={colors.secondary}
        />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <MaterialCommunityIcons
          key={`empty-${i}`}
          name="star-outline"
          size={size}
          color={colors.textMuted}
        />
      ))}
      {showValue && (
        <Text className="text-sm text-gray-500 ml-1">
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}
