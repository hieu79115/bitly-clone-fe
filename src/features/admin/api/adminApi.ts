import { api } from '@/lib/axiosClient';
import type {
    AdminStats,
    AdminUser,
    AdminUrl,
    RoleItem,
    PermissionItem,
    SpringPage,
    CreateRoleRequest,
    UpdateRoleRequest,
    UpdateUserRequest,
    ResetPasswordRequest,
} from '../types';

export const adminApi = {
    // 1. Stats
    getStats: async (): Promise<AdminStats> => {
        const response = await api.get<AdminStats>('/api/v1/admin/stats');
        return response.data;
    },

    // 2. Users
    getUsers: async (
        page = 0,
        size = 10,
        search?: string,
        role?: string,
        isActive?: boolean
    ): Promise<SpringPage<AdminUser>> => {
        const params: Record<string, string | number | boolean> = { page, size };
        if (search && search.trim()) params.search = search.trim();
        if (role && role !== 'all') params.role = role;
        if (isActive !== undefined) params.isActive = isActive;

        const response = await api.get<SpringPage<AdminUser>>('/api/v1/admin/users', { params });
        return response.data;
    },

    getUserById: async (userId: number): Promise<AdminUser> => {
        const response = await api.get<AdminUser>(`/api/v1/admin/users/${userId}`);
        return response.data;
    },

    updateUser: async (userId: number, data: UpdateUserRequest): Promise<AdminUser> => {
        const response = await api.put<AdminUser>(`/api/v1/admin/users/${userId}`, data);
        return response.data;
    },

    resetUserPassword: async (userId: number, data: ResetPasswordRequest): Promise<void> => {
        await api.post(`/api/v1/admin/users/${userId}/reset-password`, data);
    },

    getUserUrls: async (
        userId: number,
        page = 0,
        size = 10,
        search?: string,
        isActive?: boolean
    ): Promise<SpringPage<AdminUrl>> => {
        const params: Record<string, string | number | boolean> = { page, size };
        if (search && search.trim()) params.search = search.trim();
        if (isActive !== undefined) params.isActive = isActive;

        const response = await api.get<SpringPage<AdminUrl>>(`/api/v1/admin/users/${userId}/urls`, { params });
        return response.data;
    },

    updateUserStatus: async (userId: number, isActive: boolean): Promise<AdminUser> => {
        const response = await api.patch<AdminUser>(`/api/v1/admin/users/${userId}/status`, { isActive });
        return response.data;
    },

    assignUserRoles: async (userId: number, roleNames: string[]): Promise<AdminUser> => {
        const response = await api.patch<AdminUser>(`/api/v1/admin/users/${userId}/roles`, { roleNames });
        return response.data;
    },

    // 3. URLs
    getUrls: async (
        page = 0,
        size = 10,
        search?: string,
        isActive?: boolean
    ): Promise<SpringPage<AdminUrl>> => {
        const params: Record<string, string | number | boolean> = { page, size };
        if (search && search.trim()) params.search = search.trim();
        if (isActive !== undefined) params.isActive = isActive;

        const response = await api.get<SpringPage<AdminUrl>>('/api/v1/admin/urls', { params });
        return response.data;
    },

    updateUrlStatus: async (urlId: number, isActive: boolean): Promise<AdminUrl> => {
        const response = await api.patch<AdminUrl>(`/api/v1/admin/urls/${urlId}/status`, { isActive });
        return response.data;
    },

    deleteUrl: async (urlId: number): Promise<void> => {
        await api.delete(`/api/v1/admin/urls/${urlId}`);
    },

    // 4. Dynamic Roles & Permissions
    getRoles: async (): Promise<RoleItem[]> => {
        const response = await api.get<RoleItem[]>('/api/v1/admin/roles');
        return response.data;
    },

    getPermissions: async (): Promise<PermissionItem[]> => {
        const response = await api.get<PermissionItem[]>('/api/v1/admin/permissions');
        return response.data;
    },

    createRole: async (data: CreateRoleRequest): Promise<RoleItem> => {
        const response = await api.post<RoleItem>('/api/v1/admin/roles', data);
        return response.data;
    },

    updateRole: async (roleId: number, data: UpdateRoleRequest): Promise<RoleItem> => {
        const response = await api.put<RoleItem>(`/api/v1/admin/roles/${roleId}`, data);
        return response.data;
    },

    deleteRole: async (roleId: number): Promise<void> => {
        await api.delete(`/api/v1/admin/roles/${roleId}`);
    },
};
