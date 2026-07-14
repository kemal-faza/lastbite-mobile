import { View, Text } from 'react-native';
import { getStatusLabel, getStatusVariant } from '@/lib/orderStatus';

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  testID?: string;
}

export function OrderStatusBadge({ status, size = 'md', testID }: OrderStatusBadgeProps) {
  const variant = getStatusVariant(status);
  const label = getStatusLabel(status);
  const paddingClasses = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const textClasses = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <View testID={testID} className={`rounded-full self-start ${paddingClasses} ${variant.bg}`}>
      <Text className={`font-semibold ${variant.text} ${textClasses}`}>{label}</Text>
    </View>
  );
}
