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
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (data: AuthResponse) =>
                set({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    isAuthenticated: true,
                    user: {
                        email: data.email,
                        role: 'ROLE_USER', // default
                    },
                }),

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
        }),
        {
            name: 'auth-storage',
        }
    )
);
