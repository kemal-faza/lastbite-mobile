import { cn } from '@/lib/utils';
import * as LabelPrimitive from '@rn-primitives/label';

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Text>) {
  return (
    <LabelPrimitive.Root
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <LabelPrimitive.Text
        className={cn('text-foreground text-sm font-medium', className)}
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

export { Label };
