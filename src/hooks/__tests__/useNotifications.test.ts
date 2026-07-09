import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotifications } from '../useNotifications';
import { fetchNotifications, markNotificationRead } from '@/lib/api/notifications';
import React from 'react';

jest.mock('@/lib/api/notifications', () => ({
  fetchNotifications: jest.fn(),
  markNotificationRead: jest.fn(),
}));

const mockFetch = fetchNotifications as jest.MockedFunction<typeof fetchNotifications>;
const mockMark = markNotificationRead as jest.MockedFunction<typeof markNotificationRead>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty defaults initially', async () => {
    mockFetch.mockResolvedValue({ notifications: [], unreadCount: 0 });

    const { result } = await renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
  });

  it('returns notifications when API returns data', async () => {
    mockFetch.mockResolvedValue({
      notifications: [
        { id: 'n1', type: 'order_status', title: 'Test', body: 'Body', isRead: false, createdAt: '2026-07-10T12:00:00Z' },
      ],
      unreadCount: 1,
    });

    const { result } = await renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(1);
    });
    expect(result.current.notifications).toHaveLength(1);
  });

  it('markAsRead calls API and invalidates query', async () => {
    mockFetch.mockResolvedValue({ notifications: [], unreadCount: 1 });
    mockMark.mockResolvedValue({ success: true });

    const { result } = await renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.markAsRead('n1');
    });

    expect(mockMark).toHaveBeenCalledWith('n1', expect.anything());
  });

  it('handles fetch error silently (no throw)', async () => {
    mockFetch.mockRejectedValue(new Error('Network'));

    const { result } = await renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.notifications).toEqual([]);
  });
});
