import { API_BASE } from '@/lib/api/client';

const SAFE_SCHEMES: readonly string[] = ['http:', 'https:'];

/**
 * Resolve an image/product URL safely.
 *
 * If `url` is an absolute URL with http: or https: scheme, returns it as-is.
 * Otherwise, prefixes it with API_BASE (treating it as a relative path).
 *
 * This prevents the app from loading images from scheme URLs (javascript:,
 * data:, file://) under the guise of a "product image URL".
 */
export function safeResolveUrl(url: string): string {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    if (SAFE_SCHEMES.includes(parsed.protocol)) {
      return url;
    }
  } catch {
    // Not a parseable absolute URL — treat as relative path
  }

  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}
