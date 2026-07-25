import { renderHook, act } from '@testing-library/react-native';
import { useSubmitThrottle } from '@/hooks/useSubmitThrottle';

describe('useSubmitThrottle', () => {
  let dateNowSpy: jest.SpyInstance;
  let now = 0;

  beforeEach(() => {
    now = 1_000_000_000_000; // arbitrary fixed time
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
  });

  it('allows the first submission', async () => {
    const { result } = await renderHook(() => useSubmitThrottle(100));
    let called = false;
    await act(async () => {
      await result.current.submit(async () => { called = true; });
    });
    expect(called).toBe(true);
  });

  it('blocks rapid double submissions within the interval', async () => {
    const { result } = await renderHook(() => useSubmitThrottle(500));
    let count = 0;
    const action = async () => { count++; };

    await act(async () => { await result.current.submit(action); });
    await act(async () => { await result.current.submit(action); });

    // Second call should be blocked
    expect(count).toBe(1);
  });

  it('allows submission after the cooldown expires', async () => {
    const { result } = await renderHook(() => useSubmitThrottle(200));
    let count = 0;
    const action = async () => { count++; };

    await act(async () => { await result.current.submit(action); });
    expect(count).toBe(1);

    // Advance time past the cooldown
    now += 300;
    dateNowSpy.mockImplementation(() => now);

    await act(async () => { await result.current.submit(action); });
    expect(count).toBe(2);
  });

  it('resets loading to false after submission completes', async () => {
    const { result } = await renderHook(() => useSubmitThrottle(100));

    await act(async () => {
      await result.current.submit(async () => {
        // no-op
      });
    });

    expect(result.current.loading).toBe(false);
  });
});
