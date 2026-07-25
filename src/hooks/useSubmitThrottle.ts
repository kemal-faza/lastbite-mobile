import { useCallback, useRef, useState } from 'react';

/**
 * Prevents rapid-fire submissions by enforcing a minimum interval
 * between calls. Used for auth endpoints (login, register, OTP)
 * to mitigate accidental double-taps and basic abuse.
 *
 * @param minIntervalMs Minimum milliseconds between allowed submissions (default 2000)
 * @returns {{ submit: (action: () => Promise<void>) => Promise<void>, loading: boolean }}
 */
export function useSubmitThrottle(minIntervalMs = 2000) {
  const [loading, setLoading] = useState(false);
  const lastSubmit = useRef(0);

  const submit = useCallback(
    async (action: () => Promise<void>) => {
      const now = Date.now();
      if (loading || now - lastSubmit.current < minIntervalMs) {
        return;
      }

      lastSubmit.current = now;
      setLoading(true);
      try {
        await action();
      } finally {
        setLoading(false);
      }
    },
    [loading, minIntervalMs],
  );

  return { submit, loading };
}
