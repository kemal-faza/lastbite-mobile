import { render } from '@testing-library/react-native';
import MapPinPicker from '@/components/MapPinPicker';

describe('MapPinPicker', () => {
  it('should export MapPinPicker as a function component', () => {
    expect(typeof MapPinPicker).toBe('function');
  });

  it('renders the map view with a pin icon', async () => {
    const { getByTestId } = await render(
      <MapPinPicker
        initialLocation={{ latitude: -6.2, longitude: 106.8 }}
        onLocationChange={() => {}}
      />
    );
    expect(getByTestId('map-view')).toBeTruthy();
  });
});
