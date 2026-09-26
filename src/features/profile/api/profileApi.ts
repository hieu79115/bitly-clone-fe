import { api } from '@/lib/axiosClient';
import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types';

export const profileApi = {
    // GET /api/v1/profile
    getProfile: async (): Promise<UserProfile> => {
        const response = await api.get<UserProfile>('/api/v1/profile');
        return response.data;
    },

    // PUT /api/v1/profile
    updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
        const response = await api.put<UserProfile>('/api/v1/profile', data);
        return response.data;
    },

    // PUT /api/v1/profile/change-password
    changePassword: async (data: ChangePasswordRequest): Promise<string> => {
        const response = await api.put<string>('/api/v1/profile/change-password', data);
        return response.data;
    },
};