import { getRecentSearches, addRecentSearch, clearRecentSearches } from '@/lib/api/search';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const AsyncStorage = require('@react-native-async-storage/async-storage');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getRecentSearches', () => {
  it('returns empty array when nothing stored', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const result = await getRecentSearches();
    expect(result).toEqual([]);
  });

  it('returns parsed array', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(['nasi goreng', 'kopi']));
    const result = await getRecentSearches();
    expect(result).toEqual(['nasi goreng', 'kopi']);
  });
});

describe('addRecentSearch', () => {
  it('adds new query to front, removes duplicates, max 10', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(['mie ayam', 'kopi', 'nasi goreng']));
    await addRecentSearch('kopi');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@lastbite/recent-searches',
      JSON.stringify(['kopi', 'mie ayam', 'nasi goreng'])
    );
  });

  it('trims to max 10', async () => {
    const tenItems = Array.from({ length: 10 }, (_, i) => `query-${i}`);
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(tenItems));
    await addRecentSearch('new-query');
    const call = AsyncStorage.setItem.mock.calls[0][1];
    const parsed = JSON.parse(call);
    expect(parsed.length).toBe(10);
    expect(parsed[0]).toBe('new-query');
  });
});

describe('clearRecentSearches', () => {
  it('removes the key', async () => {
    await clearRecentSearches();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@lastbite/recent-searches');
  });
});
