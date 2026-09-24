import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LoginRequest, RegisterRequest } from "../types";
import { authApi } from "../api/authApi";
import { toast } from "sonner";
import axios from "axios";
import { queryClient } from "@/lib/queryClient";


export function useAuth() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const logoutStore = useAuthStore((state) => state.logout);

    const loginMutation = useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: (response) => {
            queryClient.clear();
            setAuth(response);
            toast.success('Login successful!');
            navigate('/dashboard');
        },
        onError: (error: Error) => {
            let message = 'Incorrect email or password!';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            toast.error(message);
        },
    });

    const registerMutation = useMutation({
        mutationFn: (data: RegisterRequest) => authApi.register(data),
        onSuccess: () => {
            toast.success('Account registration successful! Please log in');
            navigate('/login');
        },
        onError: (error: Error) => {
            let message = 'Registration failed; please try again!';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            toast.error(message);
        },
    });

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch {
            // ignore
        } finally {
            queryClient.clear();
            logoutStore();
            toast.info('Logged out');
            navigate('/login');
        }
    };

    return {
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        logout: handleLogout,
    };
}