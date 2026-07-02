import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserRole } from '~/types';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: UserRole | null;
  login: (userId: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      role: null,
      login: (userId, role) => set({ isAuthenticated: true, userId, role }),
      logout: () => set({ isAuthenticated: false, userId: null, role: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserId = () => useAuthStore((state) => state.userId);
export const useUserRole = () => useAuthStore((state) => state.role);
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
