import { colors, typography, radius } from '../tokens';

describe('tokens', () => {
  describe('colors', () => {
    it('exports primary as exact teal hex from brand', () => {
      expect(colors.primary).toBe('#11676a');
    });

    it('exports secondary as exact gold hex from brand', () => {
      expect(colors.secondary).toBe('#dda63a');
    });

    it('exports background as exact creme hex from brand', () => {
      expect(colors.background).toBe('#e4dcca');
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
        'secondary',
        'background',
        'destructive',
        'surface',
        'textOnPrimary',
        'textOnBackground',
        'border',
        'textSecondary',
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
      expect(radius.sm).toBe(4);
      expect(radius.md).toBe(8);
      expect(radius.lg).toBe(12);
      expect(radius.xl).toBe(16);
      expect(radius.full).toBe(9999);
    });

    it('has no additional unexpected radius keys', () => {
      const expectedKeys = ['sm', 'md', 'lg', 'xl', 'full'].sort();
      expect(Object.keys(radius).sort()).toEqual(expectedKeys);
    });
  });
});
