import { useState } from 'react';
import { useGeolocation } from './useGeolocation';
import { useProducts } from './useProducts';
import { useDebounce } from './useDebounce';

export interface FilterState {
  maxDistance: number;
  maxPrice: number;
  expiry: 'Hari Ini' | '< 1 Jam' | '< 3 Jam' | '< 6 Jam';
}

export function useProductFilter(initialCategory = '') {
  const { lat, lng } = useGeolocation();
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<'default' | 'price-asc' | 'distance-asc' | 'remaining-asc'>('default');
  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [filters, setFilters] = useState<FilterState>({
    maxDistance: 0,
    maxPrice: 0,
    expiry: 'Hari Ini',
  });

  const sortParam: 'price_asc' | 'distance_asc' | 'stock_asc' | undefined =
    sort === 'price-asc' ? 'price_asc' :
    sort === 'distance-asc' ? 'distance_asc' :
    sort === 'remaining-asc' ? 'stock_asc' :
    undefined;

  const apiFilters = {
    category: category || undefined,
    sort: sortParam,
    maxPrice: filters.maxPrice > 0 ? filters.maxPrice : undefined,
    expiry: filters.expiry !== 'Hari Ini' ? filters.expiry : undefined,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
    radius: filters.maxDistance > 0 ? filters.maxDistance : undefined,
    search: debouncedQuery.trim().length >= 2 ? debouncedQuery : undefined,
  };

  const productsQuery = useProducts(apiFilters);

  const resetFilters = () => {
    setCategory('');
    setSort('default');
    setFilters({
      maxDistance: 0,
      maxPrice: 0,
      expiry: 'Hari Ini',
    });
  };

  return {
    category,
    setCategory,
    sort,
    setSort,
    showFilter,
    setShowFilter,
    query,
    setQuery,
    filters,
    setFilters,
    apiFilters,
    productsQuery,
    resetFilters,
  };
}
