import { View, Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

export type ExpiryOption = 'Tutup Toko' | '< 1 Jam' | '< 3 Jam' | '< 6 Jam';
const OPTIONS: ExpiryOption[] = ['Tutup Toko', '< 1 Jam', '< 3 Jam', '< 6 Jam'];

interface Props {
  value: string;
  onChange: (val: ExpiryOption) => void;
  error?: string;
}

export function ExpiryPicker({ value, onChange, error }: Props) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-medium">Batas Waktu</Text>
      <View className="flex-row flex-wrap gap-2">
        {OPTIONS.map(opt => (
          <TouchableOpacity 
            key={opt}
            onPress={() => onChange(opt)}
            className={clsx(
              "px-3 py-2 rounded-full border",
              value === opt ? "bg-primary border-primary" : "bg-white border-gray-300"
            )}
          >
            <Text className={clsx(value === opt ? "text-white font-bold" : "text-gray-700")}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
