import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StarRating } from './StarRating';
import { ReviewCard } from './ReviewCard';
import { colors } from '@/theme';
import type { Review } from './ReviewCard';

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

interface ReviewListProps {
  summary: ReviewSummary;
  reviews: Review[];
  testID?: string;
}

export function ReviewList({ summary, reviews, testID }: ReviewListProps) {
  const maxCount = Math.max(...Object.values(summary.distribution), 1);

  return (
    <View testID={testID} className="mt-4">
      <Text className="text-lg font-bold mb-3">Ulasan</Text>

      <View className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
        <View className="flex-row items-center mb-3">
          <Text className="text-3xl font-bold mr-2">{summary.averageRating.toFixed(1)}</Text>
          <StarRating rating={summary.averageRating} size={18} />
          <Text className="text-sm text-gray-500 ml-2">
            ({summary.totalReviews} ulasan)
          </Text>
        </View>

        {[5, 4, 3, 2, 1].map((star) => {
          const count = summary.distribution[star] || 0;
          const width = maxCount > 0 ? `${Math.round((count / maxCount) * 100)}%` : '0%';

          return (
            <View key={star} className="flex-row items-center mb-1">
              <Text className="text-xs text-gray-500 w-8">{star}</Text>
              <MaterialCommunityIcons name="star" size={10} color={colors.secondary} />
              <View className="flex-1 h-2 bg-gray-100 rounded-full mx-2">
                <View
                  className="h-2 rounded-full"
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ width: width as any, backgroundColor: colors.secondary }}
                />
              </View>
              <Text className="text-xs text-gray-400 w-8 text-right">{count}</Text>
            </View>
          );
        })}
      </View>

      {reviews.length === 0 ? (
        <Text className="text-gray-500 text-center py-4">Belum ada ulasan</Text>
      ) : (
        reviews.map((r) => <ReviewCard key={r.id} review={r} />)
      )}
    </View>
  );
}
