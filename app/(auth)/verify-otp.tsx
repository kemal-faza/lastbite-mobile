import { useState } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import { verifyOtp } from '@/lib/api/auth';

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
    <View className="flex-1 justify-center p-6 bg-background">
      <Text className="text-2xl font-bold text-primary mb-6">Verifikasi OTP</Text>
      <Text className="mb-4">Masukkan kode yang dikirim ke {email}</Text>
      <TextInput label="Kode OTP" value={code} onChangeText={setCode} keyboardType="number-pad" className="mb-4" />
      <Button mode="contained" onPress={handleVerify} loading={loading}>
        Verifikasi
      </Button>
    </View>
  );
}
