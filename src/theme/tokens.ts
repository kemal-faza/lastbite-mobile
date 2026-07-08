export const colors = {
  primary: '#11676a',
  primaryDark: '#0d5254',
  secondary: '#dda63a',
  secondaryLight: '#f0c96a',
  background: '#e4dcca',
  destructive: '#c2382e',
  surface: '#ffffff',
  card: '#ffffff',
  textOnPrimary: '#ffffff',
  textOnBackground: '#1f2937',
  border: '#e5e7eb',
  textSecondary: '#6b7280',
  textMuted: '#999999',
  muted: '#ececf0',
} as const;

export const typography = {
  h1: 24,
  h2: 20,
  body: 16,
  caption: 14,
  small: 12,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 25, // soft blur from Next.js design (large radius + offset)
    elevation: 8,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
} as const;
