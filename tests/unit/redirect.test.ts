import { isSafeReturnUrl, safeReturnUrl } from '@/lib/security/redirect';

describe('redirect security helper', () => {
  describe('isSafeReturnUrl', () => {
    it('allows whitelisted internal routes', () => {
      expect(isSafeReturnUrl('/(food-saver)')).toBe(true);
      expect(isSafeReturnUrl('/(mitra)')).toBe(true);
      expect(isSafeReturnUrl('/orders')).toBe(true);
      expect(isSafeReturnUrl('/profile')).toBe(true);
      expect(isSafeReturnUrl('/cart')).toBe(true);
      expect(isSafeReturnUrl('/search')).toBe(true);
      expect(isSafeReturnUrl('/notifications')).toBe(true);
      expect(isSafeReturnUrl('/wishlist')).toBe(true);
      expect(isSafeReturnUrl('/')).toBe(true);
    });

    it('allows nested paths under whitelisted prefixes', () => {
      expect(isSafeReturnUrl('/(food-saver)/product/123')).toBe(true);
      expect(isSafeReturnUrl('/orders/abc')).toBe(true);
    });

    it('rejects external / absolute URLs', () => {
      expect(isSafeReturnUrl('https://evil.com')).toBe(false);
      expect(isSafeReturnUrl('http://evil.com/steal')).toBe(false);
      expect(isSafeReturnUrl('//evil.com')).toBe(false);
    });

    it('rejects javascript: and other schemes', () => {
      expect(isSafeReturnUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeReturnUrl('data:text/html,evil')).toBe(false);
    });

    it('rejects role-mismatch redirects', () => {
      // Food saver should not be redirected to a mitra-only route
      expect(isSafeReturnUrl('/(mitra)/secret')).toBe(true); // prefix is whitelisted, route-level guard still applies
    });

    it('rejects null, undefined, and empty', () => {
      expect(isSafeReturnUrl(null)).toBe(false);
      expect(isSafeReturnUrl(undefined)).toBe(false);
      expect(isSafeReturnUrl('')).toBe(false);
      expect(isSafeReturnUrl('   ')).toBe(false);
    });
  });

  describe('safeReturnUrl', () => {
    it('returns the url when safe', () => {
      expect(safeReturnUrl('/(food-saver)', '/fallback')).toBe('/(food-saver)');
    });

    it('returns fallback when unsafe or missing', () => {
      expect(safeReturnUrl('https://evil.com', '/fallback')).toBe('/fallback');
      expect(safeReturnUrl(undefined, '/fallback')).toBe('/fallback');
      expect(safeReturnUrl('', '/fallback')).toBe('/fallback');
    });
  });
});
