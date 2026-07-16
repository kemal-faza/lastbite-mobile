import { apiFetch } from './client';
import type { User } from '@/stores/authStore';

interface RawUserResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: string;
    isVerified: boolean;
  };
}

export async function getProfile(): Promise<User> {
  const raw = await apiFetch<RawUserResponse>('/users/me', { auth: true });
  return {
    id: raw.user.id,
    email: raw.user.email,
    name: raw.user.name,
    phone: raw.user.phone,
    role: raw.user.role as User['role'],
    isVerified: raw.user.isVerified,
  };
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
}): Promise<User> {
  const raw = await apiFetch<RawUserResponse>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
    auth: true,
  });
  return {
    id: raw.user.id,
    email: raw.user.email,
    name: raw.user.name,
    phone: raw.user.phone,
    role: raw.user.role as User['role'],
    isVerified: raw.user.isVerified,
  };
}
