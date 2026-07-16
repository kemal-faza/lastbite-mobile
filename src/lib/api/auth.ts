import { apiFetch, setSession } from './client';
import type { User } from '@/stores/authStore';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'FOOD_SAVER' | 'MITRA';
}

export async function register(data: RegisterData) {
  return apiFetch<{ message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function verifyOtp(email: string, code: string) {
  return apiFetch<{ verified: boolean; message: string }>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function login(email: string, password: string) {
  const res = await apiFetch<{
    tokens: { accessToken: string; refreshToken: string };
    user: User;
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await setSession(res.tokens.accessToken, res.tokens.refreshToken, res.user);
  return res;
}
