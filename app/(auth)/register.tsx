import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { register } from '@/lib/api/auth';
import { AuthScreenLayout } from '@/components/AuthScreenLayout';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  phone: z.string()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, 'Format telepon tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [role, setRole] = useState<'FOOD_SAVER' | 'MITRA'>('FOOD_SAVER');
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  const onRegister = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await register({ email: data.email, password: data.password, name: data.name, phone: data.phone, role });
      router.push({ pathname: '/verify-otp', params: { email: data.email } });
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

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Nama"
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Telepon"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            error={errors.phone?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      <PrimaryButton onPress={handleSubmit(onRegister)} loading={loading}>
        Daftar
      </PrimaryButton>
    </AuthScreenLayout>
  );
}
