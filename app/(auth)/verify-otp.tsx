import { useState } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { verifyOtp } from '@/lib/api/auth';
import { AuthScreenLayout } from '@/components/AuthScreenLayout';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/theme';

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyOtp(email, code);
      router.replace('/login');
    } catch (e: any) {
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
      <TextField
        label="Kode OTP"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <PrimaryButton onPress={handleVerify} loading={loading}>
        Verifikasi
      </PrimaryButton>
    </AuthScreenLayout>
  );
}
