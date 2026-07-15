import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from './client';

const RECENT_KEY = '@lastbite/recent-searches';
const MAX_RECENT = 10;

interface TrendingQuery {
  query: string;
  count: number;
}

export async function getTrendingSearches(limit = 8): Promise<TrendingQuery[]> {
  const data = await apiFetch<{ queries: TrendingQuery[] }>(
    `/products/trending?limit=${limit}`
  );
  return data.queries;
}

export async function getRecentSearches(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addRecentSearch(query: string): Promise<void> {
  const recent = await getRecentSearches();
  const filtered = recent.filter(q => q !== query);
  const updated = [query, ...filtered].slice(0, MAX_RECENT);
  await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export async function clearRecentSearches(): Promise<void> {
  await AsyncStorage.removeItem(RECENT_KEY);
}
