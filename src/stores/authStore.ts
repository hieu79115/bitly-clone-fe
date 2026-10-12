import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';
import type { AuthResponse } from '@/features/auth/types';

import { queryClient } from '@/lib/queryClient';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    setAuth: (data: AuthResponse) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
    isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (data: AuthResponse) => {
                const primaryRole = (data.roles && data.roles.length > 0) ? data.roles[0] : 'USER';
                set({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    isAuthenticated: true,
                    user: {
                        email: data.email,
                        role: primaryRole,
                        roles: data.roles || [primaryRole],
                        permissions: data.permissions || [],
                    },
                });
            },

            setTokens: (accessToken: string, refreshToken: string) =>
                set({ accessToken, refreshToken }),

            setUser: (user: User) => set({ user }),

            logout: () => {
                queryClient.clear();
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            hasRole: (roleName: string) => {
                const user = get().user;
                if (!user) return false;
                const upper = roleName.toUpperCase();
                return Boolean(
                    user.roles?.some((r) => r.toUpperCase() === upper) ||
                    user.role?.toUpperCase() === upper
                );
            },

            hasPermission: (permissionName: string) => {
                const user = get().user;
                if (!user) return false;
                // SUPER_ADMIN has all permissions implicitly
                if (get().hasRole('SUPER_ADMIN')) return true;
                return Boolean(user.permissions?.includes(permissionName));
            },

            isAdmin: () => {
                const user = get().user;
                if (!user) return false;
                return Boolean(
                    get().hasRole('SUPER_ADMIN') ||
                    get().hasRole('ADMIN') ||
                    get().hasRole('MODERATOR') ||
                    get().hasPermission('URL_READ') ||
                    get().hasPermission('USER_READ') ||
                    get().hasPermission('ANALYTICS_READ')
                );
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
