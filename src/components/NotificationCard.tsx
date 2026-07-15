import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Notification } from '@/lib/api/notifications';

const ICON_MAP: Record<string, string> = {
  stock_alert: 'package-variant',
  order_status: 'clipboard-list',
  promo: 'ticket-percent',
  general: 'bell',
};

const ICON_COLOR: Record<string, string> = {
  stock_alert: '#f59e0b',
  order_status: '#3b82f6',
  promo: '#ec4899',
  general: '#6b7280',
};

interface Props {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export function NotificationCard({ notification, onPress }: Props) {
  const icon = ICON_MAP[notification.type] || ICON_MAP.general;
  const iconColor = ICON_COLOR[notification.type] || ICON_COLOR.general;
  const isUnread = !notification.isRead;

  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      className={`flex-row px-4 py-3.5 border-b border-gray-100 ${
        isUnread ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      {isUnread && <View className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500" />}
      <MaterialCommunityIcons
        name={icon as any}
        size={22}
        color={iconColor}
        style={{ marginRight: 12, marginTop: 2 }}
      />
      <View className="flex-1">
        <View className="flex-row justify-between items-start">
          <Text
            className={`text-[13px] ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-500'}`}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text className={`text-[11px] ${isUnread ? 'text-gray-500' : 'text-gray-400'} ml-2`}>
            {notification.relativeTime}
          </Text>
        </View>
        <Text
          className={`text-xs mt-1 ${isUnread ? 'text-gray-600' : 'text-gray-400'}`}
          numberOfLines={2}
        >
          {notification.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
