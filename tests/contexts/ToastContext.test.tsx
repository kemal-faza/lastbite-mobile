import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, Pressable } from 'react-native';
import { ToastProvider, useToast } from '@/contexts/ToastContext';

function TestComponent() {
  const { showToast } = useToast();
  return (
    <View>
      <Pressable testID="show-toast" onPress={() => showToast('Test message')}>
        <Text>Show</Text>
      </Pressable>
    </View>
  );
}

describe('ToastContext', () => {
  it('shows toast when showToast is called', async () => {
    const { getByTestId, findByText } = await render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.press(getByTestId('show-toast'));
    expect(await findByText('Test message')).toBeTruthy();
  });
});
