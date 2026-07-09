import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ActivityIndicator, type PressableProps } from 'react-native';

interface PrimaryButtonProps extends PressableProps {
  loading?: boolean;
  children: React.ReactNode;
}

export function PrimaryButton({ loading, children, disabled, ...rest }: PrimaryButtonProps) {
  return (
    <Button
      className="mt-4 w-full"
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className="text-white font-semibold text-center">{children}</Text>
      )}
    </Button>
  );
}
