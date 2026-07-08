import { useEffect, useState } from 'react';
import { Text } from 'react-native';

interface CountdownTimerProps {
  expiresAt: string; // ISO date string
  onExpired?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<number>(() => {
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  });

  useEffect(() => {
    if (remaining <= 0) {
      onExpired?.();
      return;
    }
    const timer = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timer);
          onExpired?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining, onExpired]);

  const isUrgent = remaining < 300; // < 5 minutes

  return (
    <Text
      className={`text-3xl font-bold text-center ${
        isUrgent ? 'text-destructive' : 'text-primary'
      }`}
    >
      {formatTime(remaining)}
    </Text>
  );
}
