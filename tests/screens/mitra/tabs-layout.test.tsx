import { render } from '@testing-library/react-native';
import TabsLayout from '../../../app/(mitra)/(tabs)/_layout';

jest.mock('expo-router', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Tabs = ({ children }: any) => <>{children}</>;
  Tabs.Screen = ({ options }: any) => {
    const { title } = options || {};
    return React.createElement(View, { 'data-testid': `tab-screen-${title}` },
      React.createElement(Text, null, title)
    );
  };
  return { Tabs, Redirect: () => null };
});

jest.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({ isAuthenticated: true }),
}));

jest.mock('@/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => true,
}));

describe('Mitra Tabs Layout', () => {
  it('renders 5 tab screens with correct labels', async () => {
    const { getByText } = await render(<TabsLayout />);
    expect(getByText('Beranda')).toBeTruthy();
    expect(getByText('Pesanan')).toBeTruthy();
    expect(getByText('Produk')).toBeTruthy();
    expect(getByText('Analisis')).toBeTruthy();
    expect(getByText('Profil')).toBeTruthy();
  });
});
