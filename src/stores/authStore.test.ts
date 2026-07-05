import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() =>
    useAuthStore.setState({ user: null, isAuthenticated: false }),
  );

  it('sets user and isAuthenticated on setUser', () => {
    useAuthStore
      .getState()
      .setUser({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: 'FOOD_SAVER',
        phone: null,
        isVerified: false,
      });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.name).toBe('Test');
  });

  it('clears user on logout', () => {
    useAuthStore
      .getState()
      .setUser({
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: 'FOOD_SAVER',
        phone: null,
        isVerified: false,
      });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
