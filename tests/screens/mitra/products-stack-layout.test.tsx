import { render } from '@testing-library/react-native';
import ProductsLayout from '../../../app/(mitra)/(tabs)/products/_layout';

// Mock expo-router Stack and router
jest.mock('expo-router', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  const Stack = ({ children, screenOptions }: any) => <>{children}</>;
  Stack.Screen = ({ options }: any) => {
    const { title } = options || {};
    return React.createElement(View, { 'data-testid': `screen-${title}` },
      React.createElement(Text, null, title)
    );
  };
  return {
    Stack,
    router: { back: jest.fn() },
  };
});

describe('ProductsLayout', () => {
  it('renders Stack with 4 screens (index, add, [id], [id]/edit)', async () => {
    const { getByText } = await render(<ProductsLayout />);
    expect(getByText('Daftar Produk')).toBeTruthy();
    expect(getByText('Tambah Produk')).toBeTruthy();
    expect(getByText('Detail Produk')).toBeTruthy();
    expect(getByText('Edit Produk')).toBeTruthy();
  });
});
