import { View } from "react-native";
import { Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from "react-native-reanimated";
import { OfflineBanner } from "@/components/OfflineBanner";
import { TopBar } from "@/components/TopBar";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import {
  ScrollVisibilityProvider,
  useScrollVisibility,
} from "@/contexts/ScrollVisibilityContext";

import { colors } from "@/theme";

function AnimatedHeader() {
  const isConnected = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const { headerTranslateY } = useScrollVisibility();
  const segments = useSegments();

  const isHomeScreen =
    (segments.length === 2 && segments[0] === "(food-saver)" && segments[1] === "(tabs)") ||
    (segments.length === 3 && segments[0] === "(food-saver)" && segments[1] === "(tabs)" && segments[2] === "index");

  const animatedTopBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: headerTranslateY.value,
      },
    ],
    opacity: interpolate(headerTranslateY.value, [-60, 0], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <>
      {/* 1. Fixed Status Bar Overlay - zIndex 60 */}
      <View
        style={{
          position: "absolute",
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

      {/* 2. Animated TopBar Overlay - zIndex 50 (Rendered ONLY on Homepage) */}
      {isHomeScreen && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: insets.top,
              left: 0,
              right: 0,
              height: 60,
              backgroundColor: colors.primary,
              zIndex: 50,
              overflow: "hidden",
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

function FoodSaverLayoutContent() {
  return (
    <View className="flex-1 bg-background">
      <AnimatedHeader />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="wishlist" />
        </Stack>
      </View>
    </View>
  );
}

export default function FoodSaverLayout() {
  return (
    <ScrollVisibilityProvider>
      <FoodSaverLayoutContent />
    </ScrollVisibilityProvider>
  );
}
