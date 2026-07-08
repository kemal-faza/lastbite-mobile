import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface QueueIndicatorProps {
  queueCount: number;
  position: number;    // -1 = not in queue
  label?: string;      // default: "Antrian Pesanan"
}

export function QueueIndicator({ queueCount, position, label = 'Antrian Pesanan' }: QueueIndicatorProps) {
  const isInQueue = position >= 0;
  const progress = isInQueue ? Math.max(0, 1 - position / Math.max(queueCount, 1)) : 0;

  return (
    <View className="bg-white rounded-xl p-4 border border-gray-100">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="account-group" size={18} color={colors.primary} />
          <Text className="text-sm font-semibold ml-2">{label}</Text>
        </View>
        <Text className="text-xs text-gray-400">{queueCount} orang menunggu</Text>
      </View>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.round(progress * 100)}%`,
            backgroundColor: colors.primary,
          }}
        />
      </View>
      {isInQueue ? (
        <Text className="text-xs text-primary text-center">
          Posisi anda: #{position + 1} dari {queueCount}
        </Text>
      ) : (
        <Text className="text-xs text-gray-400 text-center">Belum dalam antrian</Text>
      )}
    </View>
  );
}
