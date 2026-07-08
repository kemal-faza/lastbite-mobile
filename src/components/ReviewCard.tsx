import { View, Text } from 'react-native';
import { StarRating } from './StarRating';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
  testID?: string;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ReviewCard({ review, testID }: ReviewCardProps) {
  return (
    <View testID={testID} className="bg-white rounded-xl p-4 mb-3 border border-gray-100">
      <View className="flex-row items-center mb-2">
        <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
          <Text className="text-white text-sm font-bold">
            {review.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-sm">{review.userName}</Text>
          <StarRating rating={review.rating} size={12} />
        </View>
        <Text className="text-xs text-gray-400">{formatDate(review.createdAt)}</Text>
      </View>
      <Text className="text-sm text-gray-700">{review.comment}</Text>
    </View>
  );
}
