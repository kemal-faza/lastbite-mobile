import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import MapPinPicker from '@/components/MapPinPicker';
import { useGeolocation } from '@/hooks/useGeolocation';
import { registerMitra } from '@/lib/api/mitra';

export default function RegisterMitraScreen() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const { location: gpsLocation, errorMsg, requestPermission } = useGeolocation();

  useEffect(() => {
    if (gpsLocation && !location) {
      setLocation({
        latitude: gpsLocation.coords.latitude,
        longitude: gpsLocation.coords.longitude,
      });
    }
  }, [gpsLocation]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !location) {
      Alert.alert('Error', 'Nama toko dan lokasi wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      await registerMitra({
        name,
        description: desc,
        lat: location.latitude,
        lng: location.longitude,
        imageUrl: image || undefined,
      });
      Alert.alert('Sukses', 'Toko berhasil didaftarkan!', [
        { text: 'OK', onPress: () => router.replace('/(mitra)') },
      ]);
    } catch {
      Alert.alert('Error', 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Pendaftaran Mitra</Text>

      <Text className="font-medium mb-2">Foto Toko</Text>
      <TouchableOpacity
        onPress={pickImage}
        className="h-40 bg-gray-100 rounded-xl justify-center items-center mb-6 overflow-hidden border border-gray-200"
      >
        {image ? (
          <Image source={{ uri: image }} className="w-full h-full" />
        ) : (
          <View className="items-center">
            <MaterialIcons name="add-a-photo" size={32} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">Pilih Foto Toko</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text className="font-medium mb-1">Nama Toko *</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Contoh: Toko Roti Berkah"
        value={name}
        onChangeText={setName}
      />

      <Text className="font-medium mb-1">Deskripsi Singkat</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Jual aneka roti sisa hari ini"
        value={desc}
        onChangeText={setDesc}
        multiline
      />

      <Text className="font-medium mb-2">Lokasi Toko *</Text>
      {!location ? (
        <View className="mb-6">
          <Button variant="outline" onPress={requestPermission} className="w-full">
            <Text>Deteksi Lokasi Saat Ini</Text>
          </Button>
          {errorMsg && <Text className="text-red-500 mt-2 text-sm">{errorMsg}</Text>}
        </View>
      ) : (
        <MapPinPicker initialLocation={location} onLocationChange={setLocation} />
      )}

      <Button
        onPress={handleSubmit}
        disabled={loading || !name || !location}
        className="w-full"
      >
        <Text>{loading ? 'Memproses...' : 'Daftar Toko'}</Text>
      </Button>
      <View className="h-10" />
    </ScrollView>
  );
}
