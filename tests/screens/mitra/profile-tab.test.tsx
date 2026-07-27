import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { router } from 'expo-router';

jest.mock('@rn-primitives/slot', () => ({
  Slot: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/lib/api/mitra', () => ({
  getMitraProfile: jest.fn().mockResolvedValue({
    profile: { id: '1', storeName: 'Dapur Bu Ani', storeDescription: null, storeAddress: null },
  }),
}));

jest.mock('@/lib/api/profile', () => ({
  updateProfile: jest.fn().mockResolvedValue({ id: '1', name: 'New Name' }),
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(() => ({ mutateAsync: jest.fn() })),
}));

const mockLogout = jest.fn();

describe('MitraProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (jest.requireMock('@/stores/authStore').useAuthStore as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'Budi Santoso',
        email: 'mitra@example.com',
        phone: '08123456789',
        role: 'MITRA',
        isVerified: true,
      },
      isAuthenticated: true,
      logout: mockLogout,
      updateUser: jest.fn(),
    });

    (jest.requireMock('@tanstack/react-query').useQuery as jest.Mock).mockReturnValue({
      data: { id: '1', storeName: 'Dapur Bu Ani', storeDescription: null, storeAddress: null },
      isLoading: false,
    });
  });

  it('shows Mitra store name, email, role badge, and Info Akun options', async () => {
    const module = await import('../../../app/(mitra)/(tabs)/profile');
    const MitraProfileScreen = module.default;
    const { getByText, queryByText } = await render(React.createElement(MitraProfileScreen));

    expect(getByText('Dapur Bu Ani')).toBeTruthy();
    expect(getByText('mitra@example.com')).toBeTruthy();
    expect(getByText('Mitra')).toBeTruthy();
    expect(getByText('Info Akun')).toBeTruthy();
    expect(getByText('Keamanan Akun')).toBeTruthy();
    expect(getByText('Pengaturan')).toBeTruthy();
    expect(getByText('Pusat Bantuan')).toBeTruthy();

    // Verify buyer-specific sections are NOT rendered
    expect(queryByText('Uang Dihemat')).toBeFalsy();
    expect(queryByText('Riwayat Pesanan')).toBeFalsy();
    expect(queryByText('Menu Favorit')).toBeFalsy();
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
