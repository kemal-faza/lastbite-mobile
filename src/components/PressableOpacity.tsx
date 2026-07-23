import { Animated, Pressable, type PressableProps } from 'react-native';
import { type ReactNode, useCallback, useRef } from 'react';

export interface PressableOpacityProps extends Omit<PressableProps, 'children'> {
  activeOpacity?: number;
  children: ReactNode;
}

export function PressableOpacity({
  activeOpacity = 0.2,
  children,
  className,
  onPressIn,
  onPressOut,
  style,
  ...props
}: PressableOpacityProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      Animated.timing(opacity, {
        toValue: activeOpacity,
        duration: 100,
        useNativeDriver: true,
      }).start();
      onPressIn?.(e);
    },
    [activeOpacity, opacity, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      onPressOut?.(e);
    },
    [opacity, onPressOut],
  );

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={className}
      style={style}
      {...props}
    >
      <Animated.View style={[{ opacity }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
