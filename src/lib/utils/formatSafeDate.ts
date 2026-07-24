/**
 * Pure-JS date formatters that avoid Hermes-incompatible APIs
 * (toLocaleTimeString, toLocaleDateString with options).
 * These are safe on all React Native Hermes engine configurations.
 */

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
] as const;

/**
 * Format an ISO date string to HH:MM (24-hour).
 * Returns empty string on invalid input.
 */
export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
}

/**
 * Format an ISO date string to "DD Mon YYYY" (e.g. "24 Jul 2026").
 * Returns empty string on invalid input.
 * Safe alternative to toLocaleDateString('id-ID', ...) on Hermes.
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const day = d.getDate();
    const month = MONTHS_SHORT[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return '';
  }
}
