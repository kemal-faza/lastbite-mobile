import { Alert } from 'react-native';
import { AuthScreenLayout } from '@/components/AuthScreenLayout';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const forgotSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onReset = (data: ForgotForm) => {
    Alert.alert(
      'Fitur Segera Hadir',
      'Fitur reset password akan tersedia di update selanjutnya.',
    );
  };

  return (
    <AuthScreenLayout
      title="Lupa Password"
      subtitle="Masukkan email untuk reset password"
    >
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
      <PrimaryButton onPress={handleSubmit(onReset)}>
        Kirim Link Reset
      </PrimaryButton>
    </AuthScreenLayout>
  );
}
