import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('expo-router', () => ({
  Redirect: ({ href }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, `Redirecting to ${href}`);
  },
  useLocalSearchParams: () => ({ id: 'order-1' }),
  router: {},
}));

describe('OrderConfirmRedirect', () => {
  it('renders redirect to order detail with same id', async () => {
    const RedirectScreen = require('../../app/(food-saver)/(tabs)/order/confirm/[id]').default;
    const { getByText } = await render(<RedirectScreen />);
    expect(getByText('Redirecting to /order/order-1')).toBeTruthy();
  });
});
