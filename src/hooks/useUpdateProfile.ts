import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '@/lib/api/profile';
import { useAuthStore } from '@/stores/authStore';

export function useUpdateProfile() {
  const updateUser = useAuthStore(s => s.updateUser);

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string }) => updateProfile(data),
    onSuccess: (user) => {
      updateUser(user);
    },
  });
}
