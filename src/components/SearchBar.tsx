import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Cari makanan...',
  autoFocus,
}: Props) {
  return (
    <View className="flex-row items-center bg-white border border-gray-300 rounded-full px-4 py-2.5 gap-2.5">
      <MaterialCommunityIcons name="magnify" size={20} color={value ? colors.primary : '#9ca3af'} />
      <TextInput
        className="flex-1 text-sm text-gray-700"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          testID="searchbar-clear"
          onPress={() => onChangeText('')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons name="close-circle" size={18} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
}
