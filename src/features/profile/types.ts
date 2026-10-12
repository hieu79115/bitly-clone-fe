export interface UserProfile {
    id: number;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    phoneNumber?: string;
    company?: string;
    totalUrls: number;
    totalClicks: number;
    roles?: string[];
    permissions?: string[];
    createdAt: string;
}

export interface UpdateProfileRequest {
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
    phoneNumber?: string;
    company?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}