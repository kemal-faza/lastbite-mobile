import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    loading: true,
    error: null,
    permissionDenied: false,
  });

  const requestLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({
          lat: null,
          lng: null,
          loading: false,
          error: 'Izin lokasi ditolak. Aktifkan di pengaturan.',
          permissionDenied: true,
        });
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setState({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        loading: false,
        error: null,
        permissionDenied: false,
      });
    } catch {
      setState({
        lat: null,
        lng: null,
        loading: false,
        error: 'Gagal mendapatkan lokasi.',
        permissionDenied: false,
      });
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { ...state, requestLocation };
}
