import { api } from '@/lib/axiosClient';
import type { UserProfile } from '../types';

export const profileApi = {
    // GET /api/v1/profile
    getProfile: async (): Promise<UserProfile> => {
        const response = await api.get<UserProfile>('/api/v1/profile');
        return response.data;
    },
};