import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { urlApi } from "../api/urlApi";
import type { CreateUrlRequest, UpdateUrlRequest } from "../types";
import { toast } from "sonner";
import axios from "axios";

export function useUrls(
    page = 0,
    size = 10,
    tagId?: number,
    search?: string,
    status?: string,
    sort?: string
) {
    const queryClient = useQueryClient();

    const urlsQuery = useQuery({
        queryKey: ['urls', page, size, tagId, search, status, sort],
        queryFn: () => urlApi.getUrls(page, size, tagId, search, status, sort),
        staleTime: 0, // Always revalidate links in the background on page switch
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
            if (axios.isAxiosError(error) && error.response?.data) {
                const data = error.response.data;
                if (data.errors && typeof data.errors === 'object') {
                    const errorMessages = Object.values(data.errors);
                    if (errorMessages.length > 0 && typeof errorMessages[0] === 'string') {
                        message = errorMessages.join(', ');
                    }
                } else if (data.message) {
                    message = data.message;
                }
            }
            toast.error(message);
        },
    });

    const updateUrlMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUrlRequest }) =>
            urlApi.updateUrl(id, data),
        onSuccess: () => {
            toast.success('Short link updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
        onError: (error: Error) => {
            let message = 'Failed to update short link';
            if (axios.isAxiosError(error) && error.response?.data) {
                const data = error.response.data;
                if (data.errors && typeof data.errors === 'object') {
                    const errorMessages = Object.values(data.errors);
                    if (errorMessages.length > 0 && typeof errorMessages[0] === 'string') {
                        message = errorMessages.join(', ');
                    }
                } else if (data.message) {
                    message = data.message;
                }
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
            if (axios.isAxiosError(error) && error.response?.data) {
                const data = error.response.data;
                if (data.errors && typeof data.errors === 'object') {
                    const errorMessages = Object.values(data.errors);
                    if (errorMessages.length > 0 && typeof errorMessages[0] === 'string') {
                        message = errorMessages.join(', ');
                    }
                } else if (data.message) {
                    message = data.message;
                }
            }
            toast.error(message);
        },
    });

    const updateTagMutation = useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) => urlApi.updateTag(id, name),
        onSuccess: () => {
            toast.success('Tag updated!');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
        onError: () => {
            toast.error('Failed to update tag');
        },
    });

    const deleteTagMutation = useMutation({
        mutationFn: (id: number) => urlApi.deleteTag(id),
        onSuccess: () => {
            toast.success('Tag deleted!');
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['urls'] });
        },
        onError: () => {
            toast.error('Failed to delete tag');
        },
    });

    return {
        urlsData: urlsQuery.data,
        isLoadingUrls: urlsQuery.isLoading,
        tags: tagsQuery.data || [],
        createUrl: createUrlMutation.mutateAsync,
        isCreating: createUrlMutation.isPending,
        updateUrl: updateUrlMutation.mutateAsync,
        isUpdating: updateUrlMutation.isPending,
        deleteUrl: deleteUrlMutation.mutate,
        isDeleting: deleteUrlMutation.isPending,
        createTag: createTagMutation.mutateAsync,
        isCreatingTag: createTagMutation.isPending,
        updateTag: updateTagMutation.mutateAsync,
        isUpdatingTag: updateTagMutation.isPending,
        deleteTag: deleteTagMutation.mutateAsync,
        isDeletingTag: deleteTagMutation.isPending,
        refetchUrls: urlsQuery.refetch,
        isRefetching: urlsQuery.isRefetching,
    };
}

export function useUrlDetails(id: number | null | undefined) {
    return useQuery({
        queryKey: ['url-details', id],
        queryFn: () => urlApi.getUrlById(id!),
        enabled: Boolean(id),
    });
}