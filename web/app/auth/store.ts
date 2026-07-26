import { create } from 'zustand';
import type { UserRole } from '~/auth/types';
import { fetchMe, logout as apiLogout, updateTheme as apiUpdateTheme } from '~/api/auth';

type Theme = "light" | "dark";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: UserRole | null;
  theme: Theme;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userId: null,
  email: null,
  role: null,
  theme: "light",
  isLoading: true,
  checkAuth: async () => {
    try {
      const data = await fetchMe();
      set({
        isAuthenticated: true,
        userId: data.userId,
        email: data.email,
        role: data.role as UserRole,
        theme: data.preference?.theme ?? "light",
        isLoading: false,
      });
    } catch {
      set({
        isAuthenticated: false,
        userId: null,
        email: null,
        role: null,
        theme: "light",
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
      theme: "light",
      isLoading: false,
    });
  },
  setTheme: async (theme: Theme) => {
    set({ theme });
    try {
      await apiUpdateTheme(theme);
    } catch (error) {
      console.error("Failed to update theme preference", error);
    }
  },
}));

export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserId = () => useAuthStore((state) => state.userId);
export const useUserRole = () => useAuthStore((state) => state.role);
export const useUserEmail = () => useAuthStore((state) => state.email);
export const useUserTheme = () => useAuthStore((state) => state.theme);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useCheckAuth = () => useAuthStore((state) => state.checkAuth);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSetTheme = () => useAuthStore((state) => state.setTheme);
