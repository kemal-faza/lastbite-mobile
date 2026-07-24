import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { router } from 'expo-router';

jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/lib/api/mitra', () => ({
  getMitraProfile: jest.fn().mockResolvedValue({
    profile: { id: '1', storeName: 'Dapur Bu Ani', storeDescription: null, storeAddress: null },
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

const mockLogout = jest.fn();

describe('MitraProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (jest.requireMock('@/stores/authStore').useAuthStore as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'Budi Santoso',
        email: 'process.env.EXPO_PUBLIC_DEV_MITRA_EMAIL',
        phone: '08123456789',
        role: 'MITRA',
        isVerified: true,
      },
      isAuthenticated: true,
      logout: mockLogout,
    });

    (jest.requireMock('@tanstack/react-query').useQuery as jest.Mock).mockReturnValue({
      data: { id: '1', storeName: 'Dapur Bu Ani', storeDescription: null, storeAddress: null },
      isLoading: false,
    });
  });

  it('shows Mitra store name, email, and role badge', async () => {
    // Dynamic import to trigger module-not-found failure in RED phase
    const module = await import('../../../app/(mitra)/(tabs)/profile');
    const MitraProfileScreen = module.default;
    const { getByText } = await render(React.createElement(MitraProfileScreen));

    expect(getByText('Dapur Bu Ani')).toBeTruthy();
    expect(getByText('process.env.EXPO_PUBLIC_DEV_MITRA_EMAIL')).toBeTruthy();
    expect(getByText('Mitra')).toBeTruthy();
  });

  it('calls logout and redirects to food-saver on Keluar press', async () => {
    const module = await import('../../../app/(mitra)/(tabs)/profile');
    const MitraProfileScreen = module.default;
    const { getByTestId } = await render(React.createElement(MitraProfileScreen));

    fireEvent.press(getByTestId('logout-button'));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith('/(food-saver)');
    });
  });
});
