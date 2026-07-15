import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  isWishlisted: boolean;
  onToggle: () => void;
  loading?: boolean;
  size?: number;
}

export function WishlistHeart({ isWishlisted, onToggle, loading, size = 24 }: Props) {
  return (
    <TouchableOpacity
      testID="wishlist-heart"
      onPress={loading ? undefined : onToggle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ef4444" />
      ) : (
        <MaterialCommunityIcons
          name={isWishlisted ? 'heart' : 'heart-outline'}
          size={size}
          color={isWishlisted ? '#ef4444' : '#6b7280'}
        />
      )}
    </TouchableOpacity>
  );
}
