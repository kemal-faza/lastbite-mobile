import { apiFetch } from '../../../src/lib/api/client';
import { useAuthStore } from '../../../src/stores/authStore';

// Mock apiFetch
jest.mock('../../../src/lib/api/client', () => ({
  apiFetch: jest.fn(),
  setSession: jest.fn(),
  clearTokens: jest.fn(),
  registerUnauthorizedHandler: jest.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  describe('login', () => {
    it('should call apiFetch and set user in store', async () => {
      const { authService } = await import('../../../src/lib/auth');
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test', phone: null, role: 'FOOD_SAVER', isVerified: true };
      const mockTokens = { accessToken: 'abc', refreshToken: 'def' };

      (apiFetch as jest.Mock).mockResolvedValueOnce({
        tokens: mockTokens,
        user: mockUser,
      });

      const result = await authService.login('test@test.com', 'password');

      expect(result.user.id).toBe('1');
      expect(result.user.name).toBe('Test');
      // Zustand should be updated
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.id).toBe('1');
    });

    it('should throw on failed login and not update store', async () => {
      const { authService } = await import('../../../src/lib/auth');

      (apiFetch as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(authService.login('bad@test.com', 'wrong')).rejects.toThrow('Invalid credentials');
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear user state and tokens', async () => {
      const { authService } = await import('../../../src/lib/auth');
      // First login
      const mockUser = { id: '1', email: 'test@test.com', name: 'Test', phone: null, role: 'FOOD_SAVER', isVerified: true };
      const mockTokens = { accessToken: 'abc', refreshToken: 'def' };
      (apiFetch as jest.Mock).mockResolvedValueOnce({ tokens: mockTokens, user: mockUser });
      await authService.login('test@test.com', 'password');

      // Then logout
      await authService.logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('should be safe to call logout when not logged in', async () => {
      const { authService } = await import('../../../src/lib/auth');

      await expect(authService.logout()).resolves.not.toThrow();
    });
  });

  describe('bootstrap', () => {
    it('should return isAuthenticated=false when no token', async () => {
      const { authService } = await import('../../../src/lib/auth');

      const result = await authService.bootstrap();

      expect(result.isAuthenticated).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return null when no token stored', async () => {
      const { authService } = await import('../../../src/lib/auth');

      const token = await authService.getToken();

      expect(token).toBeNull();
    });
  });
});
