import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { useNotifications, useNotificationTap } from '@/hooks/useNotifications';
import { NotificationCard } from '@/components/NotificationCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { EmptyState } from '@/components/EmptyState';

export default function NotificationsScreen() {
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const { notifications, unreadCount, isLoading, refresh } = useNotifications();
  const handleTap = useNotificationTap();

  if (!isAuthenticated) {
    requireAuth(() => {});
    return (
      <EmptyState
        icon="bell-sleep"
        title="Notifikasi"
        description="Masuk untuk melihat notifikasi"
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3.5 border-b border-gray-100 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">Notifikasi</Text>
        {unreadCount > 0 && (
          <View className="bg-red-500 rounded-full min-w-[22px] h-[22px] items-center justify-center px-1.5">
            <Text className="text-white text-[11px] font-bold">{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#166534" />
        </View>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="bell-outline"
          title="Belum ada notifikasi"
          description="Notifikasi akan muncul di sini"
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={handleTap}
            />
          )}
          refreshing={isLoading}
          onRefresh={refresh}
        />
      )}
    </View>
  );
}
