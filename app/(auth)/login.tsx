import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthScreenLayout } from '@/components/AuthScreenLayout';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme';
import { authService } from '@/lib/auth';

export default function LoginScreen() {
  const { returnUrl } = useLocalSearchParams<{ returnUrl?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const target = returnUrl || (res.user.role === 'MITRA' ? '/(mitra)' : '/(food-saver)');
      router.replace(target as any);
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
            loading={loading}
            onPress={async () => {
              setLoading(true);
              try {
                await authService.login('foodsaver@lastbite.id', 'foodsaver123');
                router.replace((returnUrl || '/(food-saver)') as any);
              } catch (e: any) {
                alert(e.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            Masuk sebagai Food Saver (Dev)
          </PrimaryButton>
          <View className="h-2" />
          <PrimaryButton
            loading={loading}
            onPress={async () => {
              setLoading(true);
              try {
                await authService.login('dapurbuani@lastbite.id', 'password123');
                router.replace((returnUrl || '/(mitra)') as any);
              } catch (e: any) {
                alert(e.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            Masuk sebagai Mitra (Dev)
          </PrimaryButton>
        </View>
      )}
    </AuthScreenLayout>
  );
}
