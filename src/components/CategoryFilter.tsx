import { ScrollView, Text, Pressable } from 'react-native';

const CATEGORIES = [
  { key: '', label: 'Semua' },
  { key: 'meals', label: 'Makanan' },
  { key: 'bakery', label: 'Roti' },
  { key: 'drinks', label: 'Minuman' },
];

interface Props {
  selected: string;
  onSelect: (key: string) => void;
}

export function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-3">
      {CATEGORIES.map((cat) => (
        <Pressable
          key={cat.key}
          onPress={() => onSelect(cat.key)}
          className={`px-4 py-2 rounded-full mr-2 ${selected === cat.key ? 'bg-primary' : 'bg-white'}`}
        >
          <Text className={selected === cat.key ? 'text-white font-semibold' : 'text-gray-700'}>{cat.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
