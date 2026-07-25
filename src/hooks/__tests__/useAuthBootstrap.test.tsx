import { renderHook, waitFor } from '@testing-library/react-native';
import * as tokenStorage from '@/lib/api/tokenStorage';
import { useAuthBootstrap } from '../useAuthBootstrap';
import { useAuthStore } from '@/stores/authStore';
import { getProfile } from '@/lib/api/profile';

// Mock getProfile
jest.mock('@/lib/api/profile', () => ({
  getProfile: jest.fn(),
}));

// Mock tokenStorage (SecureStore-based)
jest.mock('@/lib/api/tokenStorage', () => ({
  getAccessToken: jest.fn(),
  getCachedUser: jest.fn(),
  setCachedUser: jest.fn(),
}));

describe('useAuthBootstrap', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@lastbite.id',
    name: 'Test User',
    phone: '08123456789',
    role: 'FOOD_SAVER',
    isVerified: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('stops bootstrapping immediately when no token exists', async () => {
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue(null);
    (tokenStorage.getCachedUser as jest.Mock).mockResolvedValue(null);

    const { result } = await renderHook(() => useAuthBootstrap());

    // Initially true or already resolved
    await waitFor(() => {
      expect(result.current.isBootstrapping).toBe(false);
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(getProfile).not.toHaveBeenCalled();
  });

  it('restores cached user optimistically and syncs fresh data in background', async () => {
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue('mock-access-token');
    (tokenStorage.getCachedUser as jest.Mock).mockResolvedValue(mockUser);

    const freshUser = { ...mockUser, name: 'Fresh Name' };
    let resolveProfile: any;
    const profilePromise = new Promise((resolve) => {
      resolveProfile = resolve;
    });
    (getProfile as jest.Mock).mockReturnValue(profilePromise);

    const { result } = await renderHook(() => useAuthBootstrap());

    // Wait for the hook to set isBootstrapping to false (optimistic restore)
    await waitFor(() => {
      expect(result.current.isBootstrapping).toBe(false);
    });

    // Verify optimistic user is set immediately
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Resolve the background profile fetch
    resolveProfile(freshUser);

    // Verify background sync updates the store with fresh profile
    await waitFor(() => {
      expect(useAuthStore.getState().user).toEqual(freshUser);
    });

    // Verify fresh profile is cached via SecureStore
    expect(tokenStorage.setCachedUser).toHaveBeenCalledWith(freshUser);
  });

  it('keeps optimistic cached user if background sync fails', async () => {
    (tokenStorage.getAccessToken as jest.Mock).mockResolvedValue('mock-access-token');
    (tokenStorage.getCachedUser as jest.Mock).mockResolvedValue(mockUser);

    (getProfile as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = await renderHook(() => useAuthBootstrap());

    await waitFor(() => {
      expect(result.current.isBootstrapping).toBe(false);
    });

    // Verify optimistic user remains set
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Verify background sync was attempted but failed without changing the user
    await waitFor(() => {
      expect(getProfile).toHaveBeenCalled();
    });
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });
});
