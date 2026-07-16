import { apiFetch } from './client';
import type { ReviewItem, ProductReviewsResponse } from '@/types/domain';

export function mapReviewItem(raw: any): ReviewItem {
  if (!raw) {
    return {
      id: '',
      userId: '',
      userName: '',
      productId: '',
      rating: 0,
      comment: '',
      createdAt: '',
    };
  }
  return {
    id: String(raw.id || ''),
    userId: String(raw.userId || raw.user_id || ''),
    userName: String(raw.userName || raw.user_name || raw.user?.name || ''),
    productId: String(raw.productId || raw.product_id || ''),
    rating: Number(raw.rating || 0),
    comment: String(raw.comment || ''),
    createdAt: String(raw.createdAt || raw.created_at || ''),
  };
}

export function mapProductReviewsResponse(raw: any): ProductReviewsResponse {
  if (!raw) {
    return {
      summary: { averageRating: 0, totalReviews: 0, distribution: {} },
      reviews: [],
    };
  }
  const summary = raw.summary || {};
  return {
    summary: {
      averageRating: Number(summary.averageRating || summary.average_rating || 0),
      totalReviews: Number(summary.totalReviews || summary.total_reviews || 0),
      distribution: summary.distribution || {},
    },
    reviews: Array.isArray(raw.reviews) ? raw.reviews.map(mapReviewItem) : [],
  };
}

export async function getProductReviews(productId: string): Promise<ProductReviewsResponse> {
  const res = await apiFetch<any>(`/reviews/${productId}`);
  return mapProductReviewsResponse(res);
}

export async function createReview(
  orderId: string,
  data: { rating: number; comment?: string },
): Promise<{ review: ReviewItem }> {
  const res = await apiFetch<any>(`/reviews/orders/${orderId}/review`, {
    method: 'POST',
    body: JSON.stringify(data),
    auth: true,
  });
  return {
    review: mapReviewItem(res?.review),
  };
}
