import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import type { TextInputProps } from 'react-native';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function TextField({ label, error, ...rest }: TextFieldProps) {
  return (
    <View className="mb-3">
      {label && (
        <Text className="text-sm font-medium text-foreground mb-1.5">
          {label}
        </Text>
      )}
      <Input {...rest} />
      {error && (
        <Text className="text-destructive text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
