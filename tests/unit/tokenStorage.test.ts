import * as SecureStore from 'expo-secure-store';
import { setTokens, setSession, clearTokens, getAccessToken, getRefreshToken, getCachedUser } from '@/lib/api/tokenStorage';

// Uses the global expo-secure-store mock from jest.setup.js (which has __store)

// Reset in-memory store before each test
const getStore = () => (SecureStore as any).__store as Record<string, string>;

beforeEach(() => {
  Object.keys(getStore()).forEach(k => delete getStore()[k]);
  jest.clearAllMocks();
});

describe('tokenStorage (SecureStore)', () => {
  describe('setTokens', () => {
    it('persists access and refresh tokens', async () => {
      await setTokens('at-123', 'rt-456');
      expect(getStore()).toHaveProperty('accessToken', 'at-123');
      expect(getStore()).toHaveProperty('refreshToken', 'rt-456');
    });
  });

  describe('setSession', () => {
    it('persists tokens and serialized user', async () => {
      await setSession('at-1', 'rt-1', { id: 'u1', email: 'a@b.com' });
      expect(getStore().accessToken).toBe('at-1');
      expect(getStore().refreshToken).toBe('rt-1');
      expect(JSON.parse(getStore().user)).toEqual({ id: 'u1', email: 'a@b.com' });
    });
  });

  describe('clearTokens', () => {
    it('removes all keys', async () => {
      await setTokens('at', 'rt');
      await SecureStore.setItemAsync('user', '{}');
      await clearTokens();
      expect(getStore()).not.toHaveProperty('accessToken');
      expect(getStore()).not.toHaveProperty('refreshToken');
      expect(getStore()).not.toHaveProperty('user');
    });
  });

  describe('getAccessToken', () => {
    it('returns the stored access token', async () => {
      await SecureStore.setItemAsync('accessToken', 'tok');
      expect(await getAccessToken()).toBe('tok');
    });

    it('returns null when not set', async () => {
      expect(await getAccessToken()).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('returns the stored refresh token', async () => {
      await SecureStore.setItemAsync('refreshToken', 'rt');
      expect(await getRefreshToken()).toBe('rt');
    });

    it('returns null when not set', async () => {
      expect(await getRefreshToken()).toBeNull();
    });
  });

  describe('getCachedUser', () => {
    it('returns parsed user JSON', async () => {
      await SecureStore.setItemAsync('user', JSON.stringify({ id: 'u1' }));
      expect(await getCachedUser()).toEqual({ id: 'u1' });
    });

    it('returns null when not set', async () => {
      expect(await getCachedUser()).toBeNull();
    });

    it('returns null for malformed JSON', async () => {
      await SecureStore.setItemAsync('user', '{broken');
      expect(await getCachedUser()).toBeNull();
    });
  });
});
