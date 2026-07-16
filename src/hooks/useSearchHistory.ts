import { useState, useEffect, useCallback } from 'react';
import { getRecentSearches, addRecentSearch, clearRecentSearches } from '@/lib/api/search';

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const data = await getRecentSearches();
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addQuery = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    setIsLoading(true);
    try {
      await addRecentSearch(trimmed);
      await loadHistory();
    } finally {
      setIsLoading(false);
    }
  }, [loadHistory]);

  const clearAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await clearRecentSearches();
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    history,
    addQuery,
    clearAll,
    isLoading,
  };
}
