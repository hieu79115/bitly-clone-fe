import { api } from "@/lib/axiosClient";
import type { CreateUrlRequest, SpringPage, TagItem, UrlItem } from "../types";

export const urlApi = {
    // GET /api/v1/urls (Pagination & Filter by Tag)
    getUrls: async (page = 0, size = 10, tagId?: number): Promise<SpringPage<UrlItem>> => {
        const params: Record<string, string | number> = { page, size };
        if (tagId) params.tagId = tagId;
        const response = await api.get<SpringPage<UrlItem>>('/api/v1/urls', { params });
        return response.data;
    },

    // POST /api/v1/urls
    createUrl: async (data: CreateUrlRequest): Promise<UrlItem> => {
        const response = await api.post<UrlItem>('/api/v1/urls', data);
        return response.data;
    },

    // DELETE /api/v1/urls/{id}
    deleteUrl: async (id: number): Promise<void> => {
        await api.delete(`/api/v1/urls/${id}`);
    },

    // GET /api/v1/tags
    getTags: async (): Promise<TagItem[]> => {
        const response = await api.get<TagItem[]>('/api/v1/tags');
        return response.data;
    },

    // POST /api/v1/tags
    createTag: async (name: string): Promise<TagItem> => {
        const response = await api.post<TagItem>('/api/v1/tags', { name });
        return response.data;
    },
}