import { formatTime, formatDate } from '../formatSafeDate';

/**
 * Helper: create an ISO string from known local date components.
 * Ensures deterministic tests regardless of the runner's timezone.
 */
function isoFromLocal(
  year: number, month: number, day: number,
  hour = 0, minute = 0,
): string {
  const d = new Date(year, month - 1, day, hour, minute);
  return d.toISOString();
}

describe('formatTime', () => {
  it('formats local time to HH:MM', () => {
    const iso = isoFromLocal(2026, 7, 24, 14, 30);
    expect(formatTime(iso)).toBe('14:30');
  });

  it('pads single-digit hours and minutes', () => {
    const iso = isoFromLocal(2026, 7, 24, 7, 5);
    expect(formatTime(iso)).toBe('07:05');
  });

  it('returns empty string for invalid date', () => {
    expect(formatTime('not-a-date')).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(formatTime('')).toBe('');
  });
});

describe('formatDate', () => {
  it('formats local date to "DD Mon YYYY"', () => {
    const iso = isoFromLocal(2026, 7, 24);
    expect(formatDate(iso)).toBe('24 Jul 2026');
  });

  it('uses Indonesian month abbreviations', () => {
    const jan = isoFromLocal(2026, 1, 15);
    expect(formatDate(jan)).toBe('15 Jan 2026');

    const dec = isoFromLocal(2026, 12, 31);
    expect(formatDate(dec)).toBe('31 Des 2026');
  });

  it('returns empty string for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('');
  });
});
