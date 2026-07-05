import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await login(email, password);
      setUser(res.user);
      router.replace(res.user.role === 'MITRA' ? '/(mitra)' : '/(food-saver)');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-background">
      <Text className="text-2xl font-bold text-primary mb-6">Masuk LastBite</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} className="mb-3" />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry className="mb-3" />
      <Button mode="contained" onPress={handleLogin} loading={loading} className="mt-4">
        Masuk
      </Button>
      <Button onPress={() => router.push('/register')} className="mt-2">
        Belum punya akun?
      </Button>
    </View>
  );
}
