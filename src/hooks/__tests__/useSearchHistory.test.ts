import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSearchHistory } from '../useSearchHistory';
import * as searchApi from '@/lib/api/search';

jest.mock('@/lib/api/search', () => ({
  getRecentSearches: jest.fn(),
  addRecentSearch: jest.fn(),
  clearRecentSearches: jest.fn(),
}));

describe('useSearchHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads history on mount', async () => {
    const mockSearches = ['roti', 'kopi'];
    (searchApi.getRecentSearches as jest.Mock).mockResolvedValueOnce(mockSearches);

    const { result } = await renderHook(() => useSearchHistory());

    await waitFor(() => {
      expect(result.current.history).toEqual(mockSearches);
    });
    expect(searchApi.getRecentSearches).toHaveBeenCalledTimes(1);
  });

  it('addQuery adds search term and refreshes history', async () => {
    (searchApi.getRecentSearches as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(['susu']);
    (searchApi.addRecentSearch as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = await renderHook(() => useSearchHistory());

    await waitFor(() => {
      expect(result.current.history).toEqual([]);
    });

    await act(async () => {
      await result.current.addQuery('susu');
    });

    expect(searchApi.addRecentSearch).toHaveBeenCalledWith('susu');
    expect(result.current.history).toEqual(['susu']);
  });

  it('addQuery ignores strings shorter than 2 characters', async () => {
    (searchApi.getRecentSearches as jest.Mock).mockResolvedValueOnce([]);

    const { result } = await renderHook(() => useSearchHistory());

    await act(async () => {
      await result.current.addQuery('a');
    });

    expect(searchApi.addRecentSearch).not.toHaveBeenCalled();
  });

  it('clearAll clears history and sets history to empty array', async () => {
    (searchApi.getRecentSearches as jest.Mock).mockResolvedValueOnce(['kopi']);
    (searchApi.clearRecentSearches as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = await renderHook(() => useSearchHistory());

    await waitFor(() => {
      expect(result.current.history).toEqual(['kopi']);
    });

    await act(async () => {
      await result.current.clearAll();
    });

    expect(searchApi.clearRecentSearches).toHaveBeenCalledTimes(1);
    expect(result.current.history).toEqual([]);
  });
});
