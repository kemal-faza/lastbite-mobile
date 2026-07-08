import { View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export function SkeletonCard() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={{ opacity: pulseAnim }}
      className="bg-white rounded-xl p-4 mb-3 mx-4"
    >
      <View className="w-full h-40 bg-gray-200 rounded-lg mb-3" />
      <View className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
      <View className="w-1/2 h-3 bg-gray-200 rounded mb-2" />
      <View className="w-1/3 h-5 bg-gray-200 rounded" />
    </Animated.View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={`skeleton-${i}`} />
      ))}
    </View>
  );
}
