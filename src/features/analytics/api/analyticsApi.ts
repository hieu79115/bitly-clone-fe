import { api } from "@/lib/axiosClient";
import type { AnalyticsSummary } from "../types";

export const analyticsApi = {
    // GET /api/v1/analytics/overview?days=7
    getOverviewAnalytics: async (days = 7): Promise<AnalyticsSummary> => {
        const response = await api.get<AnalyticsSummary>('/api/v1/analytics/overview', {
            params: { days },
        });
        return response.data;
    },

    // GET /api/v1/analytics/{shortCode}?days=7
    getLinkAnalytics: async (shortCode: string, days = 7): Promise<AnalyticsSummary> => {
        const response = await api.get<AnalyticsSummary>(`/api/v1/analytics/${shortCode}`, {
            params: { days },
        });
        return response.data;
    },
};
