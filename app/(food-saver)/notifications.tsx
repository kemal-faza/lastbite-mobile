import { useEffect } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useNotifications, useNotificationTap } from "@/hooks/useNotifications";
import { NotificationCard } from "@/components/NotificationCard";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { useBackHandler } from "@/hooks/useBackHandler";

export default function NotificationsScreen() {
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const { notifications, unreadCount, isLoading, refresh } = useNotifications();
  const handleTap = useNotificationTap();

  const handleBack = () => router.back();
  useBackHandler(handleBack);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth(() => {});
    }
  }, [isAuthenticated, requireAuth]);

  if (!isAuthenticated) {
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
      <Header
        title="Notifikasi"
        onBack={handleBack}
        fallbackHref="/"
      />

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
            <NotificationCard notification={item} onPress={handleTap} />
          )}
          refreshing={isLoading}
          onRefresh={refresh}
        />
      )}
    </View>
  );
}
