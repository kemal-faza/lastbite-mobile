import { ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  isWishlisted: boolean;
  onToggle: () => void;
  loading?: boolean;
  iconSize?: number;
}

export function WishlistHeart({ isWishlisted, onToggle, loading, iconSize = 24 }: Props) {
  return (
    <Button
      variant="plain"
      testID="wishlist-heart"
      onPress={loading ? undefined : onToggle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ef4444" />
      ) : (
        <MaterialCommunityIcons
          name={isWishlisted ? 'heart' : 'heart-outline'}
          size={iconSize}
          color={isWishlisted ? '#ef4444' : '#6b7280'}
        />
      )}
    </Button>
  );
}
