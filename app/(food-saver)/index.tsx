import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';

export default function HomeScreen() {
  const [category, setCategory] = useState('');
  const { data, isLoading } = useProducts(category ? { category } : undefined);

  return (
    <ScrollView className="flex-1 bg-background">
      <Text className="text-xl font-bold text-primary p-4">Rekomendasi Buat Kamu</Text>
      <CategoryFilter selected={category} onSelect={setCategory} />
      <View className="px-4">
        {isLoading ? <Text>Loading...</Text> : data?.products.map((p) => <ProductCard key={p.id} product={p} />)}
      </View>
    </ScrollView>
  );
}
