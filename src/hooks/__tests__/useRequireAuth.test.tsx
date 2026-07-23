import { renderHook, render } from '@testing-library/react-native';
import { router, useSegments, useRootNavigationState } from 'expo-router';
import { useRequireAuth, RequireAuth } from '../useRequireAuth';
import { useAuthStore } from '@/stores/authStore';
import { Text } from 'react-native';

const defaultSegments: string[] = [];
const mockNavState = { key: 'test' };
const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn(), navigate: jest.fn() };

jest.mock('expo-router', () => ({
  get router() { return mockRouter; },
  useSegments: jest.fn(() => defaultSegments),
  useRootNavigationState: jest.fn(() => mockNavState),
}));

beforeEach(() => {
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.back.mockClear();
  mockRouter.navigate.mockClear();
  defaultSegments.length = 0;
  (useSegments as jest.Mock).mockClear();
  (useRootNavigationState as jest.Mock).mockClear();
  useAuthStore.setState({ user: null, isAuthenticated: false });
});

describe('useRequireAuth', () => {
  it('runs action when authenticated', async () => {
    useAuthStore.setState({ user: { id: '1' } as any, isAuthenticated: true });
    const action = jest.fn();

    const { result } = await renderHook(() => useRequireAuth());
    result.current.requireAuth(action);

    expect(action).toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('redirects to /login with returnUrl when not authenticated', async () => {
    defaultSegments.push('product', 'p123');
    const action = jest.fn();

    const { result } = await renderHook(() => useRequireAuth());
    result.current.requireAuth(action);

    expect(action).not.toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/login',
      params: { returnUrl: '/product/p123' },
    });
  });

  it('handles root segments (no segments)', async () => {
    const action = jest.fn();

    const { result } = await renderHook(() => useRequireAuth());
    result.current.requireAuth(action);

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/login',
      params: { returnUrl: '/' },
    });
  });
});

describe('RequireAuth component', () => {
  it('redirects to /login when not authenticated', async () => {
    defaultSegments.push('cart');

    await render(<RequireAuth><Text>protected</Text></RequireAuth>);

    expect(mockRouter.replace).toHaveBeenCalledWith({
      pathname: '/login',
      params: { returnUrl: '/cart' },
    });
  });

  it('does NOT redirect when navState not ready', async () => {
    (useRootNavigationState as jest.Mock).mockReturnValue(undefined);

    await render(<RequireAuth><Text>protected</Text></RequireAuth>);

    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
