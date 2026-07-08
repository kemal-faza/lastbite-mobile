import { cn } from '@/lib/utils';
import { TextInput, type TextInputProps } from 'react-native';

function Input({ className, ...props }: TextInputProps) {
  return (
    <TextInput
      className={cn(
        'border-border bg-background text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-base',
        className,
      )}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

export { Input };
