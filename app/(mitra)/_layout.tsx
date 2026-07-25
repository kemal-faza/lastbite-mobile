import { Stack, Redirect, useSegments } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { useAuthStore } from '@/stores/authStore';
import { OfflineBanner } from '@/components/OfflineBanner';
import { TopBar } from '@/components/TopBar';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import {
  ScrollVisibilityProvider,
  useScrollVisibility,
} from '@/contexts/ScrollVisibilityContext';
import { colors } from '@/theme';

function AnimatedHeader() {
  const isConnected = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const { headerTranslateY } = useScrollVisibility();
  const segments = useSegments() as string[];

  const isHomeScreen =
    (segments.length === 2 && segments[0] === '(mitra)' && segments[1] === '(tabs)') ||
    (segments.length === 3 && segments[0] === '(mitra)' && segments[1] === '(tabs)' && segments[2] === 'index');

  const animatedTopBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: headerTranslateY.value,
      },
    ],
    opacity: interpolate(headerTranslateY.value, [-60, 0], [0, 1], Extrapolation?.CLAMP ?? 'clamp'),
  }));

  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: colors.primary,
          zIndex: 60,
        }}
      >
        <StatusBar style="light" />
        {!isConnected && <OfflineBanner />}
      </View>

      {isHomeScreen && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: insets.top,
              left: 0,
              right: 0,
              height: 60,
              backgroundColor: colors.primary,
              zIndex: 50,
              overflow: 'hidden',
            },
            animatedTopBarStyle,
          ]}
        >
          <TopBar />
        </Animated.View>
      )}
    </>
  );
}

function MitraLayoutContent() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/(food-saver)" />;
  if (user?.role !== 'MITRA') return <Redirect href="/(food-saver)" />;

  return (
    <View className="flex-1 bg-background">
      <AnimatedHeader />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="register" />
        </Stack>
      </View>
    </View>
  );
}

export default function MitraLayout() {
  return (
    <ScrollVisibilityProvider>
      <MitraLayoutContent />
    </ScrollVisibilityProvider>
  );
}

