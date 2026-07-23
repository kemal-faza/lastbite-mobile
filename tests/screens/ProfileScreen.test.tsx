import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../../app/(food-saver)/(tabs)/profile';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@rn-primitives/slot', () => ({
  Slot: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/stores/authStore');
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));
jest.mock('@/hooks/useImpact', () => ({
  useImpact: () => ({ moneySaved: 0, foodSaved: 0, isLoading: false }),
}));
jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('ProfileScreen Auth Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to /(auth)/login when Masuk button is pressed by unauthenticated user', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
      updateUser: jest.fn(),
    });

    const { getByText } = await renderWithProviders(<ProfileScreen />);
    const masukButton = getByText('Masuk');
    fireEvent.press(masukButton);

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/login',
      params: { returnUrl: '/(food-saver)/(tabs)/profile' },
    });
  });

  it('navigates to /register when Daftar Akun Baru button is pressed', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
      updateUser: jest.fn(),
    });

    const { getByText } = await renderWithProviders(<ProfileScreen />);
    const registerButton = getByText('Daftar Akun Baru');
    fireEvent.press(registerButton);

    expect(router.push).toHaveBeenCalledWith('/register');
  });
});
