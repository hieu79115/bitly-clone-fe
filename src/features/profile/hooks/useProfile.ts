import { useAuthStore } from "@/stores/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";
import type { UpdateProfileRequest, ChangePasswordRequest } from "../types";
import { toast } from "sonner";
import axios from "axios";

export function useProfile() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const queryClient = useQueryClient();

    const profileQuery = useQuery({
        queryKey: ['user-profile'],
        queryFn: profileApi.getProfile,
        enabled: isAuthenticated,
        staleTime: 10 * 1000,
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
        onSuccess: (updated) => {
            queryClient.setQueryData(['user-profile'], updated);
            toast.success('Profile updated successfully!');
        },
        onError: (error: Error) => {
            let message = 'Failed to update profile';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            toast.error(message);
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordRequest) => profileApi.changePassword(data),
        onSuccess: () => {
            toast.success('Password changed successfully!');
        },
        onError: (error: Error) => {
            let message = 'Failed to change password';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            toast.error(message);
        },
    });

    return {
        data: profileQuery.data,
        isLoading: profileQuery.isLoading,
        refetch: profileQuery.refetch,
        updateProfile: updateProfileMutation.mutateAsync,
        isUpdatingProfile: updateProfileMutation.isPending,
        changePassword: changePasswordMutation.mutateAsync,
        isChangingPassword: changePasswordMutation.isPending,
    };
}