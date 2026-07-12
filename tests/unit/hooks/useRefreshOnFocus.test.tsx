import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { AppState } from 'react-native';

describe('useRefreshOnFocus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export useRefreshOnFocus as a function', () => {
    expect(typeof useRefreshOnFocus).toBe('function');
  });

  it('should not call refetch on initial mount', () => {
    const refetchMock = jest.fn();
    renderHook(() => useRefreshOnFocus(refetchMock));
    expect(refetchMock).not.toHaveBeenCalled();
  });

  it('should call refetch when coming from background to active', async () => {
    const refetchMock = jest.fn();
    renderHook(() => useRefreshOnFocus(refetchMock));

    // Wait for useEffect to register the listener
    await waitFor(() => {
      expect((AppState.addEventListener as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    const changeHandler = (AppState.addEventListener as jest.Mock).mock.calls[0][1];

    // Go to background
    act(() => { changeHandler('background'); });
    expect(refetchMock).not.toHaveBeenCalled();

    // Back to active - should trigger refetch
    act(() => { changeHandler('active'); });
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });
});
