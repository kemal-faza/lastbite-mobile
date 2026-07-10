/**
 * Format distance in km to compact human-readable string.
 * Mirrors lastbite-nextjs/src/lib/utils/distance.ts formatDistance.
 */
export function formatDistance(km: number | null | undefined): string {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)} km`;
}
