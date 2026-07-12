import { View, Text } from 'react-native';

type Props = {
  title: string;
  value: number | string;
};

export default function DashboardStatsCard({ title, value }: Props) {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 m-1">
      <Text className="text-gray-500 text-xs mb-1">{title}</Text>
      <Text className="text-xl font-bold text-gray-900">{value}</Text>
    </View>
  );
}
