import { apiFetch } from './client';

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

export interface ProductReviewsResponse {
  summary: ReviewSummary;
  reviews: ReviewItem[];
}

export async function getProductReviews(productId: string) {
  return apiFetch<ProductReviewsResponse>(`/reviews/${productId}`);
}

export async function createReview(data: {
  productId: string;
  rating: number;
  comment: string;
}) {
  return apiFetch<ReviewItem>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  });
}
