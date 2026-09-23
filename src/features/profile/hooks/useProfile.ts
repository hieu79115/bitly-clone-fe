import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";

export function useProfile() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return useQuery({
        queryKey: ['user-profile'],
        queryFn: profileApi.getProfile,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}