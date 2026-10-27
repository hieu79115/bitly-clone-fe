import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { toast } from 'sonner';
import type { CreateRoleRequest, UpdateRoleRequest } from '../types';

export const ADMIN_QUERY_KEYS = {
    stats: ['admin', 'stats'] as const,
    users: (page: number, size: number, search?: string, role?: string, isActive?: boolean) =>
        ['admin', 'users', page, size, search, role, isActive] as const,
    urls: (page: number, size: number, search?: string, isActive?: boolean) =>
        ['admin', 'urls', page, size, search, isActive] as const,
    roles: ['admin', 'roles'] as const,
    permissions: ['admin', 'permissions'] as const,
};

// 1. Stats Hook
export function useAdminStats() {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.stats,
        queryFn: adminApi.getStats,
        refetchInterval: 15000,
    });
}

// 2. Users Hooks
export function useAdminUsers(
    page = 0,
    size = 10,
    search?: string,
    role?: string,
    isActive?: boolean
) {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.users(page, size, search, role, isActive),
        queryFn: () => adminApi.getUsers(page, size, search, role, isActive),
    });
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
            adminApi.updateUserStatus(userId, isActive),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'user', data.id] });
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
            toast.success(
                data.isActive
                    ? `Account for ${data.email} reactivated.`
                    : `Account for ${data.email} suspended.`
            );
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update user status.');
        },
    });
}

export function useAssignUserRoles() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, roleNames }: { userId: number; roleNames: string[] }) =>
            adminApi.assignUserRoles(userId, roleNames),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'user', data.id] });
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.roles });
            toast.success(`Roles updated for ${data.email}`);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to assign roles.');
        },
    });
}

export function useAdminUser(userId: number | null) {
    return useQuery({
        queryKey: ['admin', 'user', userId],
        queryFn: () => (userId ? adminApi.getUserById(userId) : null),
        enabled: Boolean(userId),
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }: { userId: number; data: import('../types').UpdateUserRequest }) =>
            adminApi.updateUser(userId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'user', data.id] });
            toast.success(`User ${data.email} profile updated successfully.`);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update user profile.');
        },
    });
}

export function useResetUserPassword() {
    return useMutation({
        mutationFn: ({ userId, data }: { userId: number; data: import('../types').ResetPasswordRequest }) =>
            adminApi.resetUserPassword(userId, data),
        onSuccess: () => {
            toast.success('Password reset successfully! User sessions have been invalidated.');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to reset password.');
        },
    });
}

export function useAdminUserUrls(
    userId: number | null,
    page = 0,
    size = 10,
    search?: string,
    isActive?: boolean
) {
    return useQuery({
        queryKey: ['admin', 'user-urls', userId, page, size, search, isActive],
        queryFn: () => (userId ? adminApi.getUserUrls(userId, page, size, search, isActive) : null),
        enabled: Boolean(userId),
    });
}

// 3. URLs Hooks
export function useAdminUrls(page = 0, size = 10, search?: string, isActive?: boolean) {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.urls(page, size, search, isActive),
        queryFn: () => adminApi.getUrls(page, size, search, isActive),
    });
}

export function useUpdateUrlStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ urlId, isActive }: { urlId: number; isActive: boolean }) =>
            adminApi.updateUrlStatus(urlId, isActive),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'urls'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'user-urls'] });
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
            toast.success(
                data.isActive
                    ? `Link ${data.shortCode} activated and cache cleared.`
                    : `Link ${data.shortCode} disabled and cache evicted.`
            );
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update link status.');
        },
    });
}

export function useDeleteUrlByAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (urlId: number) => adminApi.deleteUrl(urlId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'urls'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'user-urls'] });
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
            toast.success('Link deleted successfully and cache evicted.');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to delete link.');
        },
    });
}

// 4. Roles & Permissions Hooks
export function useAdminRoles() {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.roles,
        queryFn: adminApi.getRoles,
    });
}

export function useAdminPermissions() {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.permissions,
        queryFn: adminApi.getPermissions,
    });
}

export function useCreateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRoleRequest) => adminApi.createRole(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.roles });
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
            toast.success(`Custom role ${data.name} created successfully.`);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to create role.');
        },
    });
}

export function useUpdateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ roleId, data }: { roleId: number; data: UpdateRoleRequest }) =>
            adminApi.updateRole(roleId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.roles });
            toast.success(`Role ${data.name} updated successfully.`);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update role.');
        },
    });
}

export function useDeleteRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (roleId: number) => adminApi.deleteRole(roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.roles });
            queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
            toast.success('Role deleted successfully.');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to delete role.');
        },
    });
}
