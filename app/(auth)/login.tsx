import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { AuthScreenLayout } from '@/components/AuthScreenLayout';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme';

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
    <AuthScreenLayout
      title="Masuk LastBite"
      subtitle="Selamat datang kembali"
      footer={
        <Pressable onPress={() => router.push('/register')}>
          <Text className="text-center text-sm">
            Belum punya akun?{' '}
            <Text className="font-semibold" style={{ color: colors.primary }}>
              Daftar
            </Text>
          </Text>
        </Pressable>
      }
    >
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable onPress={() => router.push('/forgot-password')} className="self-end">
        <Text className="text-sm" style={{ color: colors.primary }}>
          Lupa password?
        </Text>
      </Pressable>

      <PrimaryButton onPress={handleLogin} loading={loading}>
        Masuk
      </PrimaryButton>
    </AuthScreenLayout>
  );
}
