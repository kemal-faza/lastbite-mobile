import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import { register } from '@/lib/api/auth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'FOOD_SAVER' | 'MITRA'>('FOOD_SAVER');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register({ email, password, name, phone, role });
      router.push({ pathname: '/verify-otp', params: { email } });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-background">
      <Text className="text-2xl font-bold text-primary mb-6">Daftar LastBite</Text>
      <TextInput label="Nama" value={name} onChangeText={setName} className="mb-3" />
      <TextInput label="Email" value={email} onChangeText={setEmail} className="mb-3" />
      <TextInput label="Telepon" value={phone} onChangeText={setPhone} className="mb-3" />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry className="mb-3" />
      <Button mode="contained" onPress={handleRegister} loading={loading} className="mt-4">
        Daftar
      </Button>
    </View>
  );
}
