import { render } from '@testing-library/react-native';
import React from 'react';
import FoodSaverLayout from '../../../app/(food-saver)/_layout';
import { useAuthStore } from '@/stores/authStore';
import { Redirect } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@rn-primitives/slot', () => ({
  Slot: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => true,
}));

jest.mock('@/contexts/ScrollVisibilityContext', () => ({
  ScrollVisibilityProvider: ({ children }: any) => <>{children}</>,
  useScrollVisibility: () => ({
    headerTranslateY: { value: 0 },
    tabBarTranslateY: { value: 0 },
    handleScroll: jest.fn(),
  }),
}));

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('Mitra Navigation Guard in FoodSaverLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects authenticated MITRA user to /(mitra)', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '1', role: 'MITRA' },
      isAuthenticated: true,
    });

    await renderWithQueryClient(<FoodSaverLayout />);
    expect(Redirect).toHaveBeenCalledWith({ href: '/(mitra)' }, undefined);
  });

  it('does not redirect FOOD_SAVER user to /(mitra)', async () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { id: '2', role: 'FOOD_SAVER' },
      isAuthenticated: true,
    });

    await renderWithQueryClient(<FoodSaverLayout />);
    expect(Redirect).not.toHaveBeenCalledWith({ href: '/(mitra)' }, undefined);
  });
});
