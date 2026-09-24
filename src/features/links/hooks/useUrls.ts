import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { urlApi } from "../api/urlApi";
import type { CreateUrlRequest } from "../types";
import { toast } from "sonner";
import axios from "axios";

export function useUrls(page = 0, size = 10, tagId?: number) {
    const queryClient = useQueryClient();

    const urlsQuery = useQuery({
        queryKey: ['urls', page, size, tagId],
        queryFn: () => urlApi.getUrls(page, size, tagId),
    });

    const tagsQuery = useQuery({
        queryKey: ['tags'],
        queryFn: urlApi.getTags,
    });

    const createUrlMutation = useMutation({
        mutationFn: (data: CreateUrlRequest) => urlApi.createUrl(data),
        onSuccess: () => {
            toast.success('Short link created successfully!');
            queryClient.invalidateQueries({ queryKey: ['urls'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: (error: Error) => {
            let message = 'Failed to create short link';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            toast.error(message);
        },
    });

    const deleteUrlMutation = useMutation({
        mutationFn: (id: number) => urlApi.deleteUrl(id),
        onSuccess: () => {
            toast.success('Link deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['urls'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: () => {
            toast.error('Failed to delete link');
        },
    });

    const createTagMutation = useMutation({
        mutationFn: (name: string) => urlApi.createTag(name),
        onSuccess: () => {
            toast.success('Tag created!');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
        onError: (error: Error) => {
            let message = 'Failed to create tag';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            toast.error(message);
        },
    });

    return {
        urlsData: urlsQuery.data,
        isLoadingUrls: urlsQuery.isLoading,
        tags: tagsQuery.data || [],
        createUrl: createUrlMutation.mutateAsync,
        isCreating: createUrlMutation.isPending,
        deleteUrl: deleteUrlMutation.mutate,
        isDeleting: deleteUrlMutation.isPending,
        createTag: createTagMutation.mutateAsync,
        isCreatingTag: createTagMutation.isPending,
    };
}