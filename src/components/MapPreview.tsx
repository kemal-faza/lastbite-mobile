import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export function MapPreview({ lat, lng, storeName }: { lat: number; lng: number; storeName: string }) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} title={storeName} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 192, borderRadius: 12, overflow: 'hidden', marginVertical: 16 },
  map: { flex: 1 },
});
