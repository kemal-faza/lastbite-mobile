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

      {__DEV__ && (
        <View className="mt-6 pt-4 border-t border-gray-200">
          <Text className="text-xs text-gray-400 text-center mb-2">Mode Development</Text>
          <PrimaryButton
            onPress={() => {
              setUser({
                id: 'dev-foodsaver-001',
                email: 'foodsaver@lastbite.id',
                name: 'Food Saver LastBite',
                phone: '081111111111',
                role: 'FOOD_SAVER',
                isVerified: true,
              });
              router.replace('/(food-saver)');
            }}
          >
            Masuk sebagai Food Saver (Dev)
          </PrimaryButton>
          <View className="h-2" />
          <PrimaryButton
            onPress={() => {
              setUser({
                id: 'dev-mitra-001',
                email: 'warung-makmur@lastbite.app',
                name: 'Warung Makmur',
                phone: '081234567890',
                role: 'MITRA',
                isVerified: true,
              });
              router.replace('/(mitra)');
            }}
          >
            Masuk sebagai Mitra (Dev)
          </PrimaryButton>
        </View>
      )}
    </AuthScreenLayout>
  );
}
