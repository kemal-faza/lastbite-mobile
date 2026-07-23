import { render, fireEvent } from '@testing-library/react-native';
import { WishlistHeart } from '@/components/WishlistHeart';

jest.mock('@/components/ui/text', () => ({
  TextClassContext: {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  },
  Text: 'Text',
}));

jest.mock('react-native-reanimated');

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('WishlistHeart', () => {
  it('renders heart outline when not wishlisted', async () => {
    const onToggle = jest.fn();
    const { getByTestId } = await render(
      <WishlistHeart isWishlisted={false} onToggle={onToggle} />
    );
    expect(getByTestId('wishlist-heart')).toBeTruthy();
  });

  it('renders filled red heart when wishlisted', async () => {
    const onToggle = jest.fn();
    const { getByTestId } = await render(
      <WishlistHeart isWishlisted={true} onToggle={onToggle} />
    );
    expect(getByTestId('wishlist-heart')).toBeTruthy();
  });

  it('calls onToggle when pressed', async () => {
    const onToggle = jest.fn();
    const { getByTestId } = await render(
      <WishlistHeart isWishlisted={false} onToggle={onToggle} />
    );
    fireEvent.press(getByTestId('wishlist-heart'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('is disabled when loading', async () => {
    const onToggle = jest.fn();
    const { getByTestId } = await render(
      <WishlistHeart isWishlisted={false} onToggle={onToggle} loading={true} />
    );
    fireEvent.press(getByTestId('wishlist-heart'));
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('renders icon without Button wrapper when bare=true', async () => {
    const { queryByTestId } = await render(
      <WishlistHeart isWishlisted={false} onToggle={jest.fn()} bare />
    );
    // bare mode skips Button wrapper, so testID="wishlist-heart" should NOT exist
    expect(queryByTestId('wishlist-heart')).toBeNull();
  });

  it('uses 3-stage withTiming animation (no spring delay) on isWishlisted change', async () => {
    const reanimated = jest.requireMock('react-native-reanimated');
    const withTimingSpy = jest.spyOn(reanimated, 'withTiming');

    const { rerender } = await render(
      <WishlistHeart isWishlisted={false} onToggle={jest.fn()} />
    );

    // Clear spy: first render triggers useEffect but isFirstRender skips it
    withTimingSpy.mockClear();

    // Trigger state change — useEffect fires the animation
    await rerender(<WishlistHeart isWishlisted={true} onToggle={jest.fn()} />);

    // Wait for useEffect side effects
    const { act } = require('react');
    await act(() => {});

    // Verify timing-based animation: up → down → hard reset
    const timingCallArgs = withTimingSpy.mock.calls.map((call: unknown[]) => call[0]);
    expect(timingCallArgs).toEqual([1.12, 1, 1]);

    // Verify durations: 80ms up, 80ms down, 0ms hard reset
    const timingConfigs = withTimingSpy.mock.calls.map((call: unknown[]) => call[1]);
    expect(timingConfigs).toEqual([
      { duration: 80 },
      { duration: 80 },
      { duration: 0 },
    ]);

    withTimingSpy.mockRestore();
  });
});
