import { api } from "@/lib/axiosClient";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const authApi = {
    // POST /api/v1/auth/login
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/v1/auth/login', credentials);
        return response.data;
    },

    // POST /api/v1/auth/register
    register: async (data: RegisterRequest): Promise<string> => {
        const response = await api.post<string>('/api/v1/auth/register', data);
        return response.data;
    },

    // POST /api/v1/auth/logout
    logout: async (): Promise<string> => {
        const response = await api.post<string>('/api/v1/auth/logout');
        return response.data;
    }
}