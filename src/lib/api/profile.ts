import { apiFetch } from './client';
import type { User } from '@/types/domain';

export function mapUser(raw: any): User {
  if (!raw) {
    return {
      id: '',
      email: '',
      name: '',
      phone: null,
      role: 'FOOD_SAVER',
      isVerified: false,
    };
  }
  return {
    id: String(raw.id || ''),
    email: String(raw.email || ''),
    name: String(raw.name || ''),
    phone: raw.phone ? String(raw.phone) : null,
    role: (raw.role || 'FOOD_SAVER') as User['role'],
    isVerified: Boolean(raw.isVerified || raw.is_verified),
  };
}

export async function getProfile(options?: { silent401?: boolean }): Promise<User> {
  const raw = await apiFetch<any>('/users/me', { auth: true, ...options });
  return mapUser(raw?.user);
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
}): Promise<User> {
  const raw = await apiFetch<any>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
    auth: true,
  });
  return mapUser(raw?.user);
}
