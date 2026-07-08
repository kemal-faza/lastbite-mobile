import { useState } from 'react';
import { Alert } from 'react-native';
import { AuthScreenLayout } from '@/components/AuthScreenLayout';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Masukkan email terdaftar');
      return;
    }
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
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <PrimaryButton onPress={handleReset}>
        Kirim Link Reset
      </PrimaryButton>
    </AuthScreenLayout>
  );
}
