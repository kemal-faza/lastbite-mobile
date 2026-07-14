import { render, fireEvent } from '@testing-library/react-native';

// Mock useProducts
jest.mock('@/hooks/useProducts', () => ({
  useProducts: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

import { ProductRecommendation } from '@/components/ProductRecommendation';
import { useProducts } from '@/hooks/useProducts';

const mockProducts = [
  {
    id: 'p1',
    name: 'Nasi Goreng',
    storeName: 'Warung Makan',
    discountedPrice: 25000,
    originalPrice: 35000,
    category: 'meals' as const,
    stock: 5,
    imageUrl: null,
    imageVariants: { thumb: '/thumb1.jpg', card: '/card1.jpg', full: '/full1.jpg' },
    description: 'Enak',
  },
  {
    id: 'p2',
    name: 'Ayam Bakar',
    storeName: 'Warung Makan',
    discountedPrice: 30000,
    originalPrice: 45000,
    category: 'meals' as const,
    stock: 3,
    imageUrl: null,
    imageVariants: { thumb: '/thumb2.jpg', card: '/card2.jpg', full: '/full2.jpg' },
    description: 'Pedas',
  },
  {
    id: 'excluded-prod',
    name: 'Es Teh',
    storeName: 'Warung Makan',
    discountedPrice: 5000,
    originalPrice: 8000,
    category: 'meals' as const,
    stock: 10,
    imageUrl: null,
    imageVariants: null,
    description: 'Manis',
  },
];

describe('ProductRecommendation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Rekomendasi Untuk Kamu" header', async () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: { products: mockProducts },
      isLoading: false,
    });

    const view = await render(
      <ProductRecommendation category="meals" excludeId="excluded-prod" />
    );
    expect(view.getByText('Rekomendasi Untuk Kamu')).toBeTruthy();
  });

  it('filters out the excluded product ID', async () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: { products: mockProducts },
      isLoading: false,
    });

    const view = await render(
      <ProductRecommendation category="meals" excludeId="excluded-prod" />
    );
    expect(view.getByText('Nasi Goreng')).toBeTruthy();
    expect(view.getByText('Ayam Bakar')).toBeTruthy();
    expect(view.queryByText('Es Teh')).toBeNull();
  });

  it('returns null when data is loading', async () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { queryByText } = await render(
      <ProductRecommendation category="meals" excludeId="x" />
    );
    expect(queryByText('Rekomendasi Untuk Kamu')).toBeNull();
  });

  it('returns null when all products are the excluded one', async () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: { products: [mockProducts[2]] },
      isLoading: false,
    });

    const { queryByText } = await render(
      <ProductRecommendation category="meals" excludeId="excluded-prod" />
    );
    expect(queryByText('Rekomendasi Untuk Kamu')).toBeNull();
  });

  it('renders product card with name and price', async () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: { products: mockProducts },
      isLoading: false,
    });

    const view = await render(
      <ProductRecommendation category="meals" excludeId="excluded-prod" />
    );
    expect(view.getByText('Nasi Goreng')).toBeTruthy();
    expect(view.getByText(/Rp.*?25[.,]?000/)).toBeTruthy();
  });

  it('navigates to product detail on card press', async () => {
    const { router } = require('expo-router');
    (useProducts as jest.Mock).mockReturnValue({
      data: { products: mockProducts },
      isLoading: false,
    });

    const view = await render(
      <ProductRecommendation category="meals" excludeId="excluded-prod" />
    );
    fireEvent.press(view.getByText('Nasi Goreng'));
    expect(router.push).toHaveBeenCalledWith('/product/p1');
  });
});
