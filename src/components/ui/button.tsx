import { cn } from '@/lib/utils';
import { TextClassContext } from '@/components/ui/text';
import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable, type PressableProps } from 'react-native';

const buttonVariants = cva(
  'group shrink-0 flex-row items-center justify-center gap-2 rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary active:bg-primary/90',
        destructive: 'bg-destructive active:bg-destructive/90',
        outline: 'border border-border bg-background active:bg-accent',
        secondary: 'bg-secondary active:bg-secondary/80',
        ghost: 'active:bg-accent',
        link: '',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const buttonTextVariants = cva(
  'text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'text-white',
        destructive: 'text-white',
        outline: 'text-foreground',
        secondary: 'text-foreground',
        ghost: 'text-foreground',
        link: 'text-primary underline-offset-4 underline',
      },
      size: {
        default: '',
        sm: '',
        lg: '',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps extends PressableProps, ButtonVariants {
  className?: string;
}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonVariants, buttonTextVariants };
export type { ButtonProps };
