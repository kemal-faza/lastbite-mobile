import { render } from '@testing-library/react-native';
import { PaymentSummary } from '@/components/PaymentSummary';

const sampleItems = [
  { id: 'ci-1', productId: 'p1', name: 'Nasi Goreng', storeName: 'Warung', price: 25000, originalPrice: 35000, quantity: 2, imageUrl: null, imageVariants: null, stock: 5 },
  { id: 'ci-2', productId: 'p2', name: 'Es Teh', storeName: 'Warung', price: 5000, originalPrice: 8000, quantity: 1, imageUrl: null, imageVariants: null, stock: 10 },
];

describe('PaymentSummary', () => {
  it('renders subtotal (original prices * qty)', async () => {
    const { getByText } = await render(<PaymentSummary items={sampleItems} />);
    // subtotal = (35000*2) + (8000*1) = 78000
    expect(getByText(/Subtotal/)).toBeTruthy();
    expect(getByText(/78\.000/)).toBeTruthy();
  });

  it('renders discount as (original - price) * qty with minus prefix', async () => {
    const { getByText } = await render(<PaymentSummary items={sampleItems} />);
    // discount = ((35000-25000)*2) + ((8000-5000)*1) = 20000 + 3000 = 23000
    expect(getByText(/Diskon/)).toBeTruthy();
    expect(getByText(/-Rp.*23\.000/)).toBeTruthy();
  });

  it('renders total (price * qty)', async () => {
    const { getByText } = await render(<PaymentSummary items={sampleItems} />);
    // total = (25000*2) + (5000*1) = 55000
    expect(getByText(/Total/)).toBeTruthy();
    expect(getByText(/55\.000/)).toBeTruthy();
  });

  it('shows all zeros for empty cart', async () => {
    const { getAllByText } = await render(<PaymentSummary items={[]} />);
    const zeros = getAllByText(/0/);
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it('does not show minus prefix for zero discount', async () => {
    const noDiscount = [{ id: 'ci-3', productId: 'p3', name: 'Item', storeName: 'S', price: 10000, originalPrice: 10000, quantity: 1, imageUrl: null, imageVariants: null, stock: 1 }];
    const { queryByText } = await render(<PaymentSummary items={noDiscount} />);
    expect(queryByText(/-/)).toBeNull();
  });
});
