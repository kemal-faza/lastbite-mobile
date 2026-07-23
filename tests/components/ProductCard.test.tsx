import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from '@/components/ProductCard';

jest.mock('@/components/ui/text', () => ({
  TextClassContext: {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  },
  Text: 'Text',
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('react-native-reanimated');

const baseProduct = {
  id: 'prod-1',
  name: 'Nasi Goreng',
  storeName: 'Test Store',
  originalPrice: 20000,
  discountedPrice: 15000,
  stock: 5,
  imageUrl: null,
  imageVariants: null,
  category: 'meals' as const,
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product name and store', async () => {
    const { getByText } = await render(<ProductCard product={baseProduct} />);
    expect(getByText('Nasi Goreng')).toBeTruthy();
    expect(getByText('Test Store')).toBeTruthy();
  });

  it('navigates to product detail on card press', async () => {
    const { router } = require('expo-router');
    const { getByText } = await render(<ProductCard product={baseProduct} />);

    fireEvent.press(getByText('Nasi Goreng'));
    expect(router.push).toHaveBeenCalledWith('/product/prod-1');
  });

  it('calls onToggleWishlist and does NOT navigate when heart is pressed', async () => {
    const onToggleWishlist = jest.fn();
    const { router } = require('expo-router');
    const { getByTestId } = await render(
      <ProductCard
        product={baseProduct}
        isWishlisted={false}
        onToggleWishlist={onToggleWishlist}
      />,
    );

    fireEvent.press(getByTestId('product-card-heart'));
    expect(onToggleWishlist).toHaveBeenCalledTimes(1);
    expect(router.push).not.toHaveBeenCalled();
  });

  it('renders bare WishlistHeart (no nested Button) when onToggleWishlist is provided', async () => {
    const { getByTestId, queryByTestId } = await render(
      <ProductCard
        product={baseProduct}
        isWishlisted={true}
        onToggleWishlist={jest.fn()}
      />,
    );

    // Outer Pressable should exist
    expect(getByTestId('product-card-heart')).toBeTruthy();
    // Inner WishlistHeart should be bare — no testID="wishlist-heart" Button
    expect(queryByTestId('wishlist-heart')).toBeNull();
  });
});
