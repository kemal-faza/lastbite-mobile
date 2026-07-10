import { ScrollView, TouchableOpacity, Text } from 'react-native';

export type SortOption = 'default' | 'price-asc' | 'distance-asc' | 'remaining-asc';

interface SortPillsProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
  testID?: string;
}

const sortOptions: { key: SortOption; label: string }[] = [
  { key: 'default', label: 'Default' },
  { key: 'price-asc', label: 'Termurah' },
  { key: 'distance-asc', label: 'Terdekat' },
  { key: 'remaining-asc', label: 'Segera Habis' },
];

export function SortPills({ selected, onSelect, testID }: SortPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      testID={testID}
    >
      {sortOptions.map((opt) => (
        <TouchableOpacity
          key={opt.key}
          onPress={() => onSelect(opt.key)}
          className={`px-4 py-1.5 rounded-full mr-2 ${
            selected === opt.key
              ? 'bg-primary'
              : 'bg-white border border-gray-300'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selected === opt.key ? 'text-white' : 'text-gray-600'
            }`}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
