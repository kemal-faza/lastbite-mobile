import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useOtpAttempts } from '@/hooks/useOtpAttempts';

describe('useOtpAttempts', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with 0 attempts and no cooldown', async () => {
    const { result } = await renderHook(() => useOtpAttempts());
    expect(result.current.attempts).toBe(0);
    expect(result.current.cooldown).toBe(0);
    expect(result.current.canAttempt).toBe(true);
  });

  it('increments attempts and applies cooldown on failure', async () => {
    const { result } = await renderHook(() => useOtpAttempts({ maxAttempts: 5 }));

    await act(async () => {
      result.current.recordFailure();
    });

    expect(result.current.attempts).toBe(1);
    expect(result.current.cooldown).toBeGreaterThan(0);
  });

  it('blocks attempts once max is reached', async () => {
    const { result } = await renderHook(() => useOtpAttempts({ maxAttempts: 3 }));

    await act(async () => { result.current.recordFailure(); });
    await act(async () => { result.current.recordFailure(); });
    await act(async () => { result.current.recordFailure(); });

    expect(result.current.attempts).toBe(3);
    expect(result.current.canAttempt).toBe(false);
  });

  it('applies exponential backoff cooldown', async () => {
    const { result } = await renderHook(() => useOtpAttempts({ maxAttempts: 5, baseCooldownSec: 30 }));

    // 1st failure: cooldown = 30 * 2^0 = 30
    await act(async () => { result.current.recordFailure(); });
    expect(result.current.cooldown).toBe(30);

    // 2nd failure: cooldown = 30 * 2^1 = 60
    await act(async () => { jest.advanceTimersByTime(30 * 1000); });
    await act(async () => { result.current.recordFailure(); });
    expect(result.current.cooldown).toBe(60);
  });

  it('cooldown decrements over time', async () => {
    const { result } = await renderHook(() => useOtpAttempts({ maxAttempts: 5 }));

    await act(async () => { result.current.recordFailure(); });
    const initialCooldown = result.current.cooldown;

    await act(async () => { jest.advanceTimersByTime(10 * 1000); });
    expect(result.current.cooldown).toBe(initialCooldown - 10);
  });
});
