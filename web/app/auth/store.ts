import { create } from 'zustand';
import type { UserRole } from '~/types';
import { fetchMe, logout as apiLogout } from '~/api/auth';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: UserRole | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userId: null,
  email: null,
  role: null,
  isLoading: true,
  checkAuth: async () => {
    try {
      const data = await fetchMe();
      set({
        isAuthenticated: true,
        userId: data.userId,
        email: data.email,
        role: data.role as UserRole,
        isLoading: false,
      });
    } catch {
      set({
        isAuthenticated: false,
        userId: null,
        email: null,
        role: null,
        isLoading: false,
      });
    }
  },
  logout: async () => {
    await apiLogout();
    set({
      isAuthenticated: false,
      userId: null,
      email: null,
      role: null,
      isLoading: false,
    });
  },
}));

export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserId = () => useAuthStore((state) => state.userId);
export const useUserRole = () => useAuthStore((state) => state.role);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useCheckAuth = () => useAuthStore((state) => state.checkAuth);
export const useLogout = () => useAuthStore((state) => state.logout);
