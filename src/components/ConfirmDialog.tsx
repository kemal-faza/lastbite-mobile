import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ActivityIndicator } from 'react-native';

interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  visible,
  onClose,
  title,
  description,
  confirmLabel = 'Ya',
  cancelLabel = 'Batal',
  onConfirm,
  destructive = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={onClose}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onPress={onConfirm}
            disabled={loading}
            className={destructive ? 'bg-destructive' : ''}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
