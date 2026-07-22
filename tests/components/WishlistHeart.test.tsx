import { render, fireEvent } from '@testing-library/react-native';
import { WishlistHeart } from '@/components/WishlistHeart';

jest.mock('@/components/ui/text', () => ({
  TextClassContext: {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  },
  Text: 'Text',
}));

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
});
