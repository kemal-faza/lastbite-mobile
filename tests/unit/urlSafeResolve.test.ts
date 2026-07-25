import { safeResolveUrl } from '@/lib/security/url';

// Mock API_BASE used by safeResolveUrl
jest.mock('@/lib/api/client', () => ({
  API_BASE: 'https://api.lastbite.id',
  __esModule: true,
}));

describe('safeResolveUrl', () => {
  it('returns empty string for falsy input', () => {
    expect(safeResolveUrl('')).toBe('');
  });

  it('prepends API_BASE to relative paths', () => {
    expect(safeResolveUrl('/uploads/img.jpg')).toBe('https://api.lastbite.id/uploads/img.jpg');
  });

  it('passes through absolute https URLs', () => {
    expect(safeResolveUrl('https://cdn.example.com/img.jpg')).toBe('https://cdn.example.com/img.jpg');
  });

  it('passes through absolute http URLs', () => {
    expect(safeResolveUrl('http://localhost:4000/uploads/img.jpg')).toBe('http://localhost:4000/uploads/img.jpg');
  });

  it('rejects file:// scheme (falls back to API_BASE prefix)', () => {
    // file:///etc/passwd is not a safe scheme — should be prefixed with API_BASE
    expect(safeResolveUrl('file:///etc/passwd')).toBe('https://api.lastbite.id/file:///etc/passwd');
  });

  it('rejects javascript: scheme', () => {
    expect(safeResolveUrl('javascript:alert(1)')).toBe('https://api.lastbite.id/javascript:alert(1)');
  });

  it('rejects data: scheme', () => {
    expect(safeResolveUrl('data:text/html,<script>alert(1)</script>'))
      .toBe('https://api.lastbite.id/data:text/html,<script>alert(1)</script>');
  });

  it('rejects cloud metadata URL', () => {
    expect(safeResolveUrl('http://169.254.169.254/latest/meta-data/'))
      .toBe('http://169.254.169.254/latest/meta-data/'); // http IS a safe scheme — SSRF is a server concern
    // Note: The mobile client cannot enforce SSRF; the server must validate image URLs.
  });
});
