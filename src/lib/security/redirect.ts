/**
 * Redirect / returnUrl security helper.
 *
 * The `returnUrl` search param is user-controllable (e.g. ?returnUrl=...).
 * Without validation an attacker could craft a URL that redirects a victim to
 * an unexpected internal route (role-mismatch, unauthenticated screen, etc.).
 *
 * We restrict allowed destinations to a whitelist of internal route prefixes.
 * Expo Router only navigates to registered routes anyway, so external URLs are
 * rejected by the router — but defense-in-depth here prevents internal route
 * manipulation and keeps the contract explicit.
 */

const SAFE_REDIRECT_PREFIXES: readonly string[] = [
  '/(food-saver)',
  '/(mitra)',
  '/orders',
  '/profile',
  '/cart',
  '/search',
  '/notifications',
  '/wishlist',
  '/product',
  '/checkout',
  '/',
];

/** Returns true if `url` is a safe internal redirect target. */
export function isSafeReturnUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return false;
  }

  // Reject anything that is not a path-absolute internal route.
  // Absolute URLs (http://, https://), scheme URLs (javascript:, data:),
  // and protocol-relative URLs (//evil.com) are all rejected.
  // NOTE: a bare `//` prefix (protocol-relative) must be rejected explicitly —
  // it would otherwise slip through the `/` whitelist via `url.startsWith('//')`.
  if (!url.startsWith('/') || url.startsWith('//')) {
    return false;
  }

  return SAFE_REDIRECT_PREFIXES.some(
    (prefix) => url === prefix || url.startsWith(`${prefix}/`),
  );
}

/**
 * Returns `url` if it is safe, otherwise `fallback`.
 */
export function safeReturnUrl(url: string | null | undefined, fallback: string): string {
  return isSafeReturnUrl(url) ? url! : fallback;
}
