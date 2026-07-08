import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme';

interface ImpactStatsProps {
  moneySaved: number;
  foodSaved: number;
}

export function ImpactStats({ moneySaved, foodSaved }: ImpactStatsProps) {
  const stats = [
    {
      icon: 'cash-multiple' as const,
      value: `Rp${moneySaved.toLocaleString('id')}`,
      label: 'Uang Dihemat',
      color: colors.secondary,
    },
    {
      icon: 'food' as const,
      value: `${foodSaved}`,
      label: 'Makanan Diselamatkan',
      color: colors.primary,
    },
  ];

  return (
    <View className="flex-row gap-3 mb-4">
      {stats.map((stat) => (
        <View
          key={stat.label}
          className="flex-1 bg-white rounded-xl p-4 border border-gray-100 items-center"
        >
          <MaterialCommunityIcons name={stat.icon} size={24} color={stat.color} />
          <Text className="text-lg font-bold mt-1">{stat.value}</Text>
          <Text className="text-xs text-gray-500 text-center mt-1">{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}
