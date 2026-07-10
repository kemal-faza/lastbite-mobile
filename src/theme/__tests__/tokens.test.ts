import { colors, typography, radius, shadows, spacing } from '../tokens';

describe('tokens', () => {
  describe('colors', () => {
    it('exports primary as exact teal hex from brand', () => {
      expect(colors.primary).toBe('#11676a');
    });

    it('exports secondary as exact gold hex from brand', () => {
      expect(colors.secondary).toBe('#dda63a');
    });

    it('exports background as #f5f0e4 matching tailwind.config.js mobile visual', () => {
      expect(colors.background).toBe('#f5f0e4');
    });

    it('exports destructive as exact red hex from brand', () => {
      expect(colors.destructive).toBe('#c2382e');
    });

    it('exports surface as white', () => {
      expect(colors.surface).toBe('#ffffff');
    });

    it('exports textOnPrimary for contrast on teal', () => {
      expect(colors.textOnPrimary).toBe('#ffffff');
    });

    it('exports textOnBackground for contrast on creme', () => {
      expect(colors.textOnBackground).toBe('#1f2937');
    });

    it('exports border color', () => {
      expect(colors.border).toBe('#e5e7eb');
    });

    it('exports textSecondary color', () => {
      expect(colors.textSecondary).toBe('#6b7280');
    });

    it('has no additional unexpected color keys', () => {
      const expectedKeys = [
        'primary',
        'primaryDark',
        'secondary',
        'secondaryLight',
        'background',
        'destructive',
        'surface',
        'card',
        'textOnPrimary',
        'textOnBackground',
        'border',
        'textSecondary',
        'textMuted',
        'muted',
      ].sort();
      expect(Object.keys(colors).sort()).toEqual(expectedKeys);
    });
  });

  describe('typography', () => {
    it('exports font size mappings', () => {
      expect(typography.h1).toBe(24);
      expect(typography.h2).toBe(20);
      expect(typography.body).toBe(16);
      expect(typography.caption).toBe(14);
      expect(typography.small).toBe(12);
    });

    it('has no additional unexpected typography keys', () => {
      const expectedKeys = ['h1', 'h2', 'body', 'caption', 'small'].sort();
      expect(Object.keys(typography).sort()).toEqual(expectedKeys);
    });
  });

  describe('radius', () => {
    it('exports border radius values', () => {
      expect(radius.sm).toBe(8);
      expect(radius.md).toBe(10);
      expect(radius.lg).toBe(14);
      expect(radius.xl).toBe(20);
      expect(radius.full).toBe(9999);
    });

    it('has no additional unexpected radius keys', () => {
      const expectedKeys = ['sm', 'md', 'lg', 'xl', 'full'].sort();
      expect(Object.keys(radius).sort()).toEqual(expectedKeys);
    });
  });

  describe('shadows', () => {
    it('exports shadow elevation values', () => {
      expect(shadows.sm.elevation).toBe(1);
      expect(shadows.md.elevation).toBe(3);
      expect(shadows.lg.elevation).toBe(8);
    });

    it('has no additional unexpected shadow keys', () => {
      const expectedKeys = ['sm', 'md', 'lg'].sort();
      expect(Object.keys(shadows).sort()).toEqual(expectedKeys);
    });

    it('each shadow has required properties', () => {
      const required = ['shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'elevation'];
      Object.values(shadows).forEach(entry => {
        required.forEach(prop => expect(entry).toHaveProperty(prop));
      });
    });
  });

  describe('spacing', () => {
    it('exports spacing scale values', () => {
      expect(spacing.xs).toBe(4);
      expect(spacing.sm).toBe(8);
      expect(spacing.md).toBe(12);
      expect(spacing.lg).toBe(16);
      expect(spacing.xl).toBe(24);
      expect(spacing['2xl']).toBe(32);
    });

    it('has no additional unexpected spacing keys', () => {
      const expectedKeys = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].sort();
      expect(Object.keys(spacing).sort()).toEqual(expectedKeys);
    });
  });
});
