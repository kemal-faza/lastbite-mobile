import React from 'react';
import { render } from '@testing-library/react-native';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';

describe('OrderStatusBadge', () => {
  it('renders correct label for PICKED_UP', async () => {
    const { getByText } = await render(<OrderStatusBadge status="PICKED_UP" />);
    expect(getByText('Selesai')).toBeTruthy();
  });

  it('renders correct label for CANCELLED', async () => {
    const { getByText } = await render(<OrderStatusBadge status="CANCELLED" />);
    expect(getByText('Dibatalkan')).toBeTruthy();
  });

  it('renders correct label for PENDING', async () => {
    const { getByText } = await render(<OrderStatusBadge status="PENDING" />);
    expect(getByText('Menunggu')).toBeTruthy();
  });

  it('renders correct label for PROCESSED', async () => {
    const { getByText } = await render(<OrderStatusBadge status="PROCESSED" />);
    expect(getByText('Diproses')).toBeTruthy();
  });

  it('renders correct label for READY', async () => {
    const { getByText } = await render(<OrderStatusBadge status="READY" />);
    expect(getByText('Siap Diambil')).toBeTruthy();
  });
});
