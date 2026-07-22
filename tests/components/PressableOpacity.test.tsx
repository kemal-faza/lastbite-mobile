import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PressableOpacity } from '@/components/PressableOpacity';

describe('PressableOpacity', () => {
  it('renders children', async () => {
    const { getByText } = await render(
      <PressableOpacity>
        <Text>Press me</Text>
      </PressableOpacity>
    );
    expect(getByText('Press me')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByTestId } = await render(
      <PressableOpacity onPress={onPress} testID="btn">
        <Text>Press me</Text>
      </PressableOpacity>
    );
    fireEvent.press(getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onPressIn callback', async () => {
    const onPressIn = jest.fn();
    const { getByTestId } = await render(
      <PressableOpacity onPressIn={onPressIn} testID="btn">
        <Text>Press me</Text>
      </PressableOpacity>
    );
    fireEvent(getByTestId('btn'), 'pressIn');
    expect(onPressIn).toHaveBeenCalledTimes(1);
  });

  it('calls onPressOut callback', async () => {
    const onPressOut = jest.fn();
    const { getByTestId } = await render(
      <PressableOpacity onPressOut={onPressOut} testID="btn">
        <Text>Press me</Text>
      </PressableOpacity>
    );
    fireEvent(getByTestId('btn'), 'pressOut');
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });
});
