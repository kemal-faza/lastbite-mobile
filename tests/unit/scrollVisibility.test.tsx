import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, Pressable, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ScrollVisibilityProvider, useScrollVisibility } from '@/contexts/ScrollVisibilityContext';

function TestConsumer() {
  const { isVisible, show, hide, handleScroll, handleScrollEnd, headerTranslateY, tabBarTranslateY } = useScrollVisibility();

  return (
    <View>
      <Text testID="visibility-status">{isVisible ? 'VISIBLE' : 'HIDDEN'}</Text>
      <Text testID="header-y">{headerTranslateY.value}</Text>
      <Text testID="tabbar-y">{tabBarTranslateY.value}</Text>
      <Pressable testID="show-btn" onPress={show}>
        <Text>Show</Text>
      </Pressable>
      <Pressable testID="hide-btn" onPress={hide}>
        <Text>Hide</Text>
      </Pressable>
      <Pressable
        testID="scroll-down-btn"
        onPress={() => {
          handleScroll({
            nativeEvent: {
              contentOffset: { x: 0, y: 50 },
              contentSize: { width: 400, height: 1000 },
              layoutMeasurement: { width: 400, height: 500 },
            },
          } as NativeSyntheticEvent<NativeScrollEvent>);
          handleScroll({
            nativeEvent: {
              contentOffset: { x: 0, y: 100 },
              contentSize: { width: 400, height: 1000 },
              layoutMeasurement: { width: 400, height: 500 },
            },
          } as NativeSyntheticEvent<NativeScrollEvent>);
          handleScrollEnd();
        }}
      >
        <Text>Scroll Down</Text>
      </Pressable>
      <Pressable
        testID="scroll-up-btn"
        onPress={() => {
          handleScroll({
            nativeEvent: {
              contentOffset: { x: 0, y: 50 },
              contentSize: { width: 400, height: 1000 },
              layoutMeasurement: { width: 400, height: 500 },
            },
          } as NativeSyntheticEvent<NativeScrollEvent>);
          handleScrollEnd();
        }}
      >
        <Text>Scroll Up</Text>
      </Pressable>
    </View>
  );
}

describe('ScrollVisibilityContext', () => {
  it('toggles visibility and responds to scroll events with Reanimated shared values', async () => {
    const { getByTestId, getByText } = await render(
      <ScrollVisibilityProvider>
        <TestConsumer />
      </ScrollVisibilityProvider>
    );

    expect(getByText('VISIBLE')).toBeTruthy();

    await fireEvent.press(getByTestId('hide-btn'));
    await waitFor(() => expect(getByText('HIDDEN')).toBeTruthy());

    await fireEvent.press(getByTestId('show-btn'));
    await waitFor(() => expect(getByText('VISIBLE')).toBeTruthy());

    await fireEvent.press(getByTestId('scroll-down-btn'));
    await waitFor(() => expect(getByText('HIDDEN')).toBeTruthy());

    await fireEvent.press(getByTestId('scroll-up-btn'));
    await waitFor(() => expect(getByText('VISIBLE')).toBeTruthy());
  });
});
