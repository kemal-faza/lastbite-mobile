import { View, Text, StyleSheet } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

type Location = {
  latitude: number;
  longitude: number;
};

type Props = {
  initialLocation: Location;
  onLocationChange: (loc: Location) => void;
};

export default function MapPinPicker({ initialLocation, onLocationChange }: Props) {
  const handleRegionChangeComplete = (region: Region) => {
    onLocationChange({ latitude: region.latitude, longitude: region.longitude });
  };

  return (
    <View className="h-64 rounded-xl overflow-hidden mb-4 relative" testID="map-view">
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          ...initialLocation,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
      />
      {/* Static pin in the center of the map */}
      <View className="absolute top-1/2 left-1/2 -ml-3 -mt-6 pointer-events-none">
        <MaterialIcons name="location-on" size={32} color="#EF4444" />
      </View>
      <View className="absolute bottom-2 left-2 right-2 bg-white/90 p-2 rounded-lg">
        <Text className="text-xs text-center font-medium">
          Geser peta untuk menyesuaikan pin toko
        </Text>
      </View>
    </View>
  );
}
