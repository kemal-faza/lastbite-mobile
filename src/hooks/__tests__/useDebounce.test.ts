import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', async () => {
    const { result } = await renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('delays value change by specified ms', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } },
    );
    await rerender({ value: 'world' });
    expect(result.current).toBe('hello');
    await act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('world');
  });

  it('cancels pending update on unmount', async () => {
    const { result, rerender, unmount } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } },
    );
    await rerender({ value: 'world' });
    await unmount();
    await act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('hello');
  });

  it('supports custom delay', async () => {
    const { result, rerender } = await renderHook(
      ({ value }: { value: string }) => useDebounce(value, 1000),
      { initialProps: { value: 'a' } },
    );
    await rerender({ value: 'b' });
    await act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('a');
    await act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('b');
  });
});
