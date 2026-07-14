import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Toast } from '@/components/Toast';

jest.mock('expo-image', () => ({ Image: 'Image' }));

describe('Toast', () => {
  it('renders toast messages', async () => {
    const { getByText } = await render(
      <Toast
        toasts={[
          { id: '1', message: 'Nasi Goreng ditambahkan ke keranjang' },
          { id: '2', message: 'Es Teh ditambahkan ke keranjang' },
        ]}
        onDismiss={jest.fn()}
      />
    );

    expect(getByText('Nasi Goreng ditambahkan ke keranjang')).toBeTruthy();
    expect(getByText('Es Teh ditambahkan ke keranjang')).toBeTruthy();
  });

  it('returns null when toasts array is empty', async () => {
    const { toJSON } = await render(
      <Toast toasts={[]} onDismiss={jest.fn()} />
    );

    expect(toJSON()).toBeNull();
  });
});
