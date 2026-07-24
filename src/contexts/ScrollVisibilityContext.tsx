import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useSharedValue, withTiming, SharedValue } from 'react-native-reanimated';

interface ScrollVisibilityContextType {
  isVisible: boolean;
  headerTranslateY: SharedValue<number>;
  tabBarTranslateY: SharedValue<number>;
  show: () => void;
  hide: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleScrollEnd: () => void;
}

const defaultSharedValue = { value: 0 } as SharedValue<number>;

const ScrollVisibilityContext = createContext<ScrollVisibilityContextType>({
  isVisible: true,
  headerTranslateY: defaultSharedValue,
  tabBarTranslateY: defaultSharedValue,
  show: () => {},
  hide: () => {},
  handleScroll: () => {},
  handleScrollEnd: () => {},
});

export const ScrollVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);
  const headerTranslateY = useSharedValue(0);
  const tabBarTranslateY = useSharedValue(0);
  const lastScrollY = useRef(0);

  const show = useCallback(() => {
    isVisibleRef.current = true;
    headerTranslateY.value = withTiming(0, { duration: 150 });
    tabBarTranslateY.value = withTiming(0, { duration: 150 });
    setIsVisible(true);
  }, [headerTranslateY, tabBarTranslateY]);

  const hide = useCallback(() => {
    isVisibleRef.current = false;
    headerTranslateY.value = withTiming(-60, { duration: 150 });
    tabBarTranslateY.value = withTiming(100, { duration: 150 });
    setIsVisible(false);
  }, [headerTranslateY, tabBarTranslateY]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    if (currentScrollY <= 0) {
      headerTranslateY.value = withTiming(0, { duration: 150 });
      tabBarTranslateY.value = withTiming(0, { duration: 150 });
      lastScrollY.current = 0;
      return;
    }

    if (contentHeight > 0 && currentScrollY + layoutHeight >= contentHeight - 10) {
      lastScrollY.current = currentScrollY;
      return;
    }

    const diff = currentScrollY - lastScrollY.current;
    lastScrollY.current = currentScrollY;

    // Pure GPU Reanimated SharedValue updates (Zero React state re-renders)
    const nextHeaderY = Math.max(-60, Math.min(0, headerTranslateY.value - diff));
    const nextTabBarY = Math.max(0, Math.min(100, tabBarTranslateY.value + diff * (100 / 60)));

    headerTranslateY.value = nextHeaderY;
    tabBarTranslateY.value = nextTabBarY;
  }, [headerTranslateY, tabBarTranslateY]);

  const handleScrollEnd = useCallback(() => {
    if (headerTranslateY.value < -30) {
      hide();
    } else {
      show();
    }
  }, [hide, show, headerTranslateY]);

  return (
    <ScrollVisibilityContext.Provider
      value={{ isVisible, headerTranslateY, tabBarTranslateY, show, hide, handleScroll, handleScrollEnd }}
    >
      {children}
    </ScrollVisibilityContext.Provider>
  );
};

export const useScrollVisibility = () => useContext(ScrollVisibilityContext);
