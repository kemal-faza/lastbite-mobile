import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'FOOD_SAVER' | 'MITRA' | 'ADMIN';
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
