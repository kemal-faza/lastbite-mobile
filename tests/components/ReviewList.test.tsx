import { render, waitFor } from '@testing-library/react-native';
import { ReviewList } from '@/components/ReviewList';

const emptySummary = {
  averageRating: 0,
  totalReviews: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

const populatedSummary = {
  averageRating: 4.2,
  totalReviews: 15,
  distribution: { 1: 0, 2: 1, 3: 3, 4: 5, 5: 6 },
};

const sampleReviews = [
  {
    id: 'r1',
    userName: 'Budi',
    rating: 5,
    comment: 'Enak banget!',
    createdAt: '2026-07-10T08:00:00Z',
  },
];

describe('ReviewList', () => {
  it('shows dash for average rating when totalReviews is 0', async () => {
    const { getByText } = await render(
      <ReviewList summary={emptySummary} reviews={[]} />
    );
    await waitFor(() => {
      expect(getByText('-')).toBeTruthy();
    });
  });

  it('shows "0 ulasan" when totalReviews is 0', async () => {
    const { getByText } = await render(
      <ReviewList summary={emptySummary} reviews={[]} />
    );
    await waitFor(() => {
      expect(getByText('(0 ulasan)')).toBeTruthy();
    });
  });

  it('shows "Belum ada ulasan untuk produk ini" in separate box when empty', async () => {
    const { getByText } = await render(
      <ReviewList summary={emptySummary} reviews={[]} />
    );
    await waitFor(() => {
      expect(getByText('Belum ada ulasan untuk produk ini')).toBeTruthy();
    });
  });

  it('does NOT show "Belum ada ulasan untuk produk ini" when reviews exist', async () => {
    const { queryByText } = await render(
      <ReviewList summary={populatedSummary} reviews={sampleReviews} />
    );
    expect(queryByText('Belum ada ulasan untuk produk ini')).toBeNull();
  });

  it('shows numeric rating when totalReviews > 0', async () => {
    const { getByText } = await render(
      <ReviewList summary={populatedSummary} reviews={sampleReviews} />
    );
    await waitFor(() => {
      expect(getByText('4.2')).toBeTruthy();
    });
  });

  it('renders review cards when reviews exist', async () => {
    const { getByText } = await render(
      <ReviewList summary={populatedSummary} reviews={sampleReviews} />
    );
    await waitFor(() => {
      expect(getByText('Enak banget!')).toBeTruthy();
    });
  });
});
