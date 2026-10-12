export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    totalUrls: number;
    activeUrls: number;
    disabledUrls: number;
    totalClicks: number;
    totalRoles: number;
    recentUsers?: AdminUser[];
    recentUrls?: AdminUrl[];
}

export interface AdminUser {
    id: number;
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    company?: string | null;
    phoneNumber?: string | null;
    isActive: boolean;
    roles: string[];
    totalUrls: number;
    totalClicks: number;
    createdAt: string;
}

export interface UpdateUserRequest {
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    company?: string;
    phoneNumber?: string;
    isActive?: boolean;
}

export interface ResetPasswordRequest {
    newPassword: string;
}

export interface AdminUrl {
    id: number;
    title?: string | null;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    userEmail?: string | null;
    userId?: number | null;
    clickCount: number;
    isActive: boolean;
    createdAt: string;
    expiresAt?: string | null;
}

export interface PermissionItem {
    id: number;
    name: string;
    description?: string | null;
    module: string;
}

export interface RoleItem {
    id: number;
    name: string;
    description?: string | null;
    isSystem: boolean;
    permissions: PermissionItem[];
    userCount: number;
    createdAt: string;
}

export interface SpringPage<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface CreateRoleRequest {
    name: string;
    description?: string;
    permissionNames: string[];
}

export interface UpdateRoleRequest {
    description?: string;
    permissionNames: string[];
}
