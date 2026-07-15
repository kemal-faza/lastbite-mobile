import { render, fireEvent } from '@testing-library/react-native';
import { NotificationCard } from '@/components/NotificationCard';
import type { Notification } from '@/lib/api/notifications';

describe('NotificationCard', () => {
  const mockNotification: Notification = {
    id: 'notif-1',
    title: 'Stok Tersedia!',
    body: 'Nasi Padang sudah tersedia lagi.',
    type: 'stock_alert',
    productId: 'prod-1',
    isRead: false,
    createdAt: new Date().toISOString(),
    relativeTime: '2 mnt lalu',
  };

  it('renders unread with blue accent', async () => {
    const { getByText } = await render(
      <NotificationCard notification={mockNotification} onPress={jest.fn()} />
    );
    expect(getByText('Stok Tersedia!')).toBeTruthy();
    expect(getByText('Nasi Padang sudah tersedia lagi.')).toBeTruthy();
  });

  it('renders read with muted style', async () => {
    const { getByText } = await render(
      <NotificationCard
        notification={{ ...mockNotification, isRead: true }}
        onPress={jest.fn()}
      />
    );
    expect(getByText('Stok Tersedia!')).toBeTruthy();
  });

  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <NotificationCard notification={mockNotification} onPress={onPress} />
    );
    fireEvent.press(getByText('Stok Tersedia!'));
    expect(onPress).toHaveBeenCalledWith(mockNotification);
  });
});
