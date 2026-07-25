import { useState, useRef, useEffect, useCallback } from 'react';

const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_BASE_COOLDOWN_SEC = 30;

interface OtpAttemptsOptions {
  /** Maximum failed attempts before the user is locked out (default 5). */
  maxAttempts?: number;
  /** Base cooldown in seconds. Doubles with each failure: base * 2^(attempts-1). */
  baseCooldownSec?: number;
}

interface OtpAttemptsState {
  /** Number of failed attempts so far. */
  attempts: number;
  /** Current cooldown remaining in seconds. 0 means no cooldown. */
  cooldown: number;
  /** Whether the user can currently attempt (under max + no cooldown). */
  canAttempt: boolean;
  /** Call this after a failed OTP verification. */
  recordFailure: () => void;
  /** Maximum allowed attempts for this instance. */
  maxAttempts: number;
}

/**
 * Rate-limits OTP verification attempts with exponential backoff.
 *
 * After each failed attempt, a cooldown is applied that doubles
 * with each subsequent failure. Once maxAttempts is reached, no
 * further attempts are allowed (until the component unmounts/remounts).
 *
 * Used in `verify-otp.tsx` to prevent brute-force OTP guessing.
 */
export function useOtpAttempts(options: OtpAttemptsOptions = {}): OtpAttemptsState {
  const {
    maxAttempts = DEFAULT_MAX_ATTEMPTS,
    baseCooldownSec = DEFAULT_BASE_COOLDOWN_SEC,
  } = options;

  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) {
      if (timer.current) clearInterval(timer.current);
      return;
    }

    timer.current = setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [cooldown]);

  const canAttempt = attempts < maxAttempts && cooldown === 0;

  const recordFailure = useCallback(() => {
    if (attempts >= maxAttempts) return;

    setAttempts((a) => a + 1);
    // Exponential backoff: base * 2^(newAttempts-1), capped at 3600s (1 hour)
    setCooldown(Math.min(baseCooldownSec * 2 ** attempts, 3600));
  }, [attempts, maxAttempts, baseCooldownSec]);

  return { attempts, cooldown, canAttempt, recordFailure, maxAttempts };
}
