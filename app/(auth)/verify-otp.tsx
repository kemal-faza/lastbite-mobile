import { useState } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { verifyOtp } from '@/lib/api/auth';
import { AuthScreenLayout } from '@/components/AuthScreenLayout';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOtpAttempts } from '@/hooks/useOtpAttempts';

const otpSchema = z.object({
  code: z.string()
    .min(1, 'Kode OTP wajib diisi')
    .regex(/^\d{4,6}$/, 'Kode OTP harus 4-6 digit angka'),
});

type OtpForm = z.infer<typeof otpSchema>;

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [loading, setLoading] = useState(false);
  const { attempts, cooldown, canAttempt, recordFailure, maxAttempts } = useOtpAttempts({ maxAttempts: 5 });
  const { control, handleSubmit, formState: { errors } } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' },
  });

  const handleVerify = async (data: OtpForm) => {
    setLoading(true);
    try {
      await verifyOtp(email, data.code);
      router.replace('/login');
    } catch (e: any) {
      recordFailure();
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      title="Verifikasi OTP"
      subtitle="Masukkan kode yang dikirim ke email"
    >
      <View className="mb-4">
        {email && (
            <Text className="text-sm text-center mb-3" style={{ color: colors.textSecondary }}>
            Kode dikirim ke {email}
          </Text>
        )}
      </View>
      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Kode OTP"
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            error={errors.code?.message}
          />
        )}
      />
      <PrimaryButton
        onPress={handleSubmit(handleVerify)}
        loading={loading}
        disabled={!canAttempt}
      >
        {!canAttempt
          ? cooldown > 0
            ? `Coba lagi dalam ${cooldown}s`
            : `Batas percobaan (${attempts}/${maxAttempts})`
          : 'Verifikasi'
        }
      </PrimaryButton>
    </AuthScreenLayout>
  );
}
