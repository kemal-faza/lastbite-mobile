import { View, Text } from 'react-native';
import type { ToastItem } from '@/contexts/ToastContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <View className="absolute top-14 left-4 right-4 items-center" pointerEvents="box-none">
      {toasts.map((toast) => (
        <View
          key={toast.id}
          className="bg-gray-900/90 rounded-xl px-4 py-3.5 mb-2 flex-row items-center shadow-lg"
        >
          <MaterialCommunityIcons name="check-circle" size={20} color="#22c55e" />
          <Text className="text-white text-sm font-medium ml-2.5 flex-1">{toast.message}</Text>
        </View>
      ))}
    </View>
  );
}
