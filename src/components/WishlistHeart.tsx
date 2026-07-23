import { useEffect, useRef } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface Props {
  isWishlisted: boolean;
  onToggle: () => void;
  loading?: boolean;
  iconSize?: number;
  /** When true, renders the icon without a Button wrapper (for use inside another Pressable). */
  bare?: boolean;
}

export function WishlistHeart({ isWishlisted, onToggle, loading, iconSize = 24, bare }: Props) {
  const scale = useSharedValue(1);
  const isFirstRender = useRef(true);

  // Pop-bounce animation when wishlist state changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Quick up-down scale burst: no springs, no delay between stages
    scale.value = withSequence(
      withTiming(1.12, { duration: 80 }), // Scale UP (80ms)
      withTiming(1, { duration: 80 }),    // Scale DOWN (80ms)
      withTiming(1, { duration: 0 }),     // Hard reset: force scale back to 1
    );
  }, [isWishlisted]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const icon = loading ? (
    <ActivityIndicator size="small" color={colors.destructive} />
  ) : (
    <MaterialCommunityIcons
      name={isWishlisted ? 'heart' : 'heart-outline'}
      size={iconSize}
      color={isWishlisted ? colors.destructive : colors.textSecondary}
    />
  );

  // On web, reanimated requires extra setup; render without animation wrapper
  const animatedIcon =
    Platform.OS === 'web' ? (
      <>{icon}</>
    ) : (
      <Animated.View style={[animatedStyle]}>{icon}</Animated.View>
    );

  if (bare) {
    return animatedIcon;
  }

  return (
    <Button
      variant="plain"
      testID="wishlist-heart"
      onPress={loading ? undefined : onToggle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {animatedIcon}
    </Button>
  );
}
