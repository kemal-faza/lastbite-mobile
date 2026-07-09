import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import { useGeolocation } from '../useGeolocation';

const mockLocation = Location as jest.Mocked<typeof Location>;

describe('useGeolocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('granted permission + position returns lat/lng', async () => {
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
    } as any);
    mockLocation.getCurrentPositionAsync.mockResolvedValueOnce({
      coords: { latitude: -6.2, longitude: 106.8 },
    } as any);

    const { result } = await renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lat).toBe(-6.2);
    expect(result.current.lng).toBe(106.8);
    expect(result.current.permissionDenied).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('denied permission sets permissionDenied true', async () => {
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'denied',
    } as any);

    const { result } = await renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.permissionDenied).toBe(true);
    expect(result.current.error).toContain('Izin');
    expect(result.current.lat).toBeNull();
  });

  it('getCurrentPositionAsync error sets error message', async () => {
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
    } as any);
    mockLocation.getCurrentPositionAsync.mockRejectedValueOnce(new Error('GPS off'));

    const { result } = await renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toContain('Gagal');
    expect(result.current.lat).toBeNull();
  });

  it('requestLocation manual trigger re-fetches', async () => {
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
      status: 'granted',
    } as any);
    mockLocation.getCurrentPositionAsync
      .mockResolvedValueOnce({ coords: { latitude: 1, longitude: 1 } } as any)
      .mockResolvedValueOnce({ coords: { latitude: 2, longitude: 2 } } as any);

    const { result } = await renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.lat).toBe(1));

    await act(async () => {
      await result.current.requestLocation();
    });

    expect(result.current.lat).toBe(2);
  });
});
