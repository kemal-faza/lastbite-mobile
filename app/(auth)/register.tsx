import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { register } from '@/lib/api/auth';
import { AuthScreenLayout } from '@/components/AuthScreenLayout';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme';

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
    <AuthScreenLayout
      title="Daftar LastBite"
      subtitle="Bergabung menyelamatkan makanan"
      footer={
        <Pressable onPress={() => router.push('/login')}>
          <Text className="text-center text-sm">
            Sudah punya akun?{' '}
            <Text className="font-semibold" style={{ color: colors.primary }}>
              Masuk
            </Text>
          </Text>
        </Pressable>
      }
    >
      <View className="flex-row mb-3">
        <Pressable
          onPress={() => setRole('FOOD_SAVER')}
          className={`flex-1 py-3 rounded-l-lg items-center ${role === 'FOOD_SAVER' ? 'bg-primary' : 'bg-white'}`}
        >
          <Text className={role === 'FOOD_SAVER' ? 'text-white font-semibold' : 'text-gray-700'}>
            Food Saver
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setRole('MITRA')}
          className={`flex-1 py-3 rounded-r-lg items-center ${role === 'MITRA' ? 'bg-primary' : 'bg-white'}`}
        >
          <Text className={role === 'MITRA' ? 'text-white font-semibold' : 'text-gray-700'}>
            Mitra
          </Text>
        </Pressable>
      </View>

      <TextField label="Nama" value={name} onChangeText={setName} />
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextField label="Telepon" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <PrimaryButton onPress={handleRegister} loading={loading}>
        Daftar
      </PrimaryButton>
    </AuthScreenLayout>
  );
}
